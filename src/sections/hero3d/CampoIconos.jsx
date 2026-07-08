import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/*
 * Campo de íconos instanciado: un solo InstancedMesh (1 draw call) con
 * ~280 quads. Cada instancia toma su ícono del atlas vía un offset UV
 * por-instancia; el drift y la reacción al cursor se calculan en el
 * vertex shader (la CPU solo lerpea 3 valores por frame).
 *
 * Reacción al cursor ("spotlight"): la distancia de cada instancia al
 * cursor (en coordenadas de mundo) define una "cercanía" 0..1 que
 * — tiñe el gris hacia dorado (uColorOro → uColorOroClaro en el centro),
 * — sube el alfa,
 * — y agranda un pelín el quad.
 * Sin cursor sobre el hero (o antes de moverlo), uFuerza vale 0 y el
 * campo queda estático en gris.
 */

const CANTIDAD = 280

/*
 * Diales (uniforms):
 *  uTiempo         reloj del drift ambiente
 *  uMouse          posición del cursor en coordenadas de mundo (lerpeada)
 *  uFuerza         0..1: activación global de la reacción (fade in/out suave)
 *  uRadio          radio del spotlight en unidades de mundo
 *  uFalloff        exponente del falloff (mayor = transición más concentrada)
 *  uIntensidad     cuánto se tiñe de dorado como máximo (0..1)
 *  uEscalaCursor   escala extra máxima cerca del cursor (0.3 = +30%)
 *  uAlfaExtra      alfa extra máximo cerca del cursor
 *  uColor          gris base
 *  uColorOro       dorado del borde del spotlight
 *  uColorOroClaro  dorado claro del centro del spotlight
 */
function crearMaterial(atlas) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTiempo: { value: 0 },
      uAtlas: { value: new THREE.CanvasTexture(atlas.canvas) },
      uEscalaCelda: { value: new THREE.Vector2(1 / atlas.columnas, 1 / atlas.filas) },
      uColor: { value: new THREE.Color('#6a6a6a') },
      uOpacidad: { value: 0.3 },
      uMouse: { value: new THREE.Vector2(0, -100) }, // lejos hasta el primer movimiento
      uFuerza: { value: 0 },
      uRadio: { value: 2.4 },
      uFalloff: { value: 1.8 },
      uIntensidad: { value: 0.85 },
      uEscalaCursor: { value: 0.3 },
      uAlfaExtra: { value: 1.4 },
      uColorOro: { value: new THREE.Color('#f3c13a') },
      uColorOroClaro: { value: new THREE.Color('#ffe39a') },
    },
    vertexShader: /* glsl */ `
      attribute vec2 aCeldaUv;  // celda del atlas de esta instancia
      attribute float aFase;    // desfase aleatorio del drift
      attribute float aAlfa;    // variación sutil de opacidad por instancia

      uniform float uTiempo;
      uniform vec2 uMouse;
      uniform float uFuerza;
      uniform float uRadio;
      uniform float uFalloff;
      uniform float uEscalaCursor;

      varying vec2 vUv;
      varying vec2 vCeldaUv;
      varying float vAlfa;
      varying float vCercania;

      void main() {
        vUv = uv;
        vCeldaUv = aCeldaUv;
        vAlfa = aAlfa;

        // Drift ambiente: vaivén vertical lento + balanceo horizontal mínimo.
        vec2 drift = vec2(
          cos(uTiempo * 0.22 + aFase * 1.7) * 0.07,
          sin(uTiempo * 0.35 + aFase) * 0.18
        );

        // Cercanía al cursor medida desde el centro de la instancia
        // (con drift incluido, para que el spotlight siga al ícono).
        vec2 centro = (instanceMatrix * vec4(vec3(0.0), 1.0)).xy + drift;
        float distancia = distance(centro, uMouse);
        float cercania = 1.0 - smoothstep(0.0, uRadio, distancia);
        cercania = pow(cercania, uFalloff) * uFuerza;
        vCercania = cercania;

        // Escala extra cerca del cursor (sobre el vértice local: crece
        // desde el centro de la instancia).
        vec3 posLocal = position * (1.0 + cercania * uEscalaCursor);

        vec4 posicion = instanceMatrix * vec4(posLocal, 1.0);
        posicion.xy += drift;

        gl_Position = projectionMatrix * modelViewMatrix * posicion;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D uAtlas;
      uniform vec2 uEscalaCelda;
      uniform vec3 uColor;
      uniform float uOpacidad;
      uniform float uIntensidad;
      uniform float uAlfaExtra;
      uniform vec3 uColorOro;
      uniform vec3 uColorOroClaro;

      varying vec2 vUv;
      varying vec2 vCeldaUv;
      varying float vAlfa;
      varying float vCercania;

      void main() {
        // UV local del quad remapeada a la celda del ícono en el atlas.
        float alfaTextura = texture2D(uAtlas, vCeldaUv + vUv * uEscalaCelda).a;
        if (alfaTextura < 0.05) discard;

        // Gris → dorado según cercanía; el centro del spotlight aclara
        // hacia el dorado suave.
        vec3 oro = mix(uColorOro, uColorOroClaro, vCercania);
        vec3 color = mix(uColor, oro, vCercania * uIntensidad);

        float alfa = alfaTextura * uOpacidad * vAlfa * (1.0 + vCercania * uAlfaExtra);
        gl_FragColor = vec4(color, min(alfa, 1.0));
      }
    `,
  })
}

export default function CampoIconos({ atlas, puntero }) {
  const mallaRef = useRef(null)
  const { viewport } = useThree()

  const material = useMemo(() => crearMaterial(atlas), [atlas])

  // Atributos por instancia (fijos durante la vida del componente).
  const { celdasUv, fases, alfas, semillas } = useMemo(() => {
    const celdasUv = new Float32Array(CANTIDAD * 2)
    const fases = new Float32Array(CANTIDAD)
    const alfas = new Float32Array(CANTIDAD)
    // Semillas de posición/escala en [0,1], para re-distribuir en cada resize.
    const semillas = new Float32Array(CANTIDAD * 4)

    for (let i = 0; i < CANTIDAD; i++) {
      const celda = atlas.celdas[Math.floor(Math.random() * atlas.celdas.length)]
      celdasUv[i * 2] = celda[0]
      celdasUv[i * 2 + 1] = celda[1]
      fases[i] = Math.random() * Math.PI * 2
      alfas[i] = 0.5 + Math.random() * 0.5
      for (let j = 0; j < 4; j++) semillas[i * 4 + j] = Math.random()
    }
    return { celdasUv, fases, alfas, semillas }
  }, [atlas])

  // Distribuye las instancias por el área del hero (se recalcula al redimensionar).
  useLayoutEffect(() => {
    const malla = mallaRef.current
    const dummy = new THREE.Object3D()
    const ancho = viewport.width * 1.15
    const alto = viewport.height * 1.15

    for (let i = 0; i < CANTIDAD; i++) {
      dummy.position.set(
        (semillas[i * 4] - 0.5) * ancho,
        (semillas[i * 4 + 1] - 0.5) * alto,
        -semillas[i * 4 + 2] * 2, // leve profundidad
      )
      const escala = 0.16 + semillas[i * 4 + 3] * 0.26 // tamaño con variación sutil
      dummy.scale.setScalar(escala)
      dummy.rotation.z = (semillas[i * 4 + 2] - 0.5) * 0.3 // inclinación mínima
      dummy.updateMatrix()
      malla.setMatrixAt(i, dummy.matrix)
    }
    malla.instanceMatrix.needsUpdate = true
  }, [viewport.width, viewport.height, semillas])

  // Por frame: reloj del drift + lerp del cursor (trailing elegante).
  useFrame((state) => {
    const uniforms = material.uniforms
    uniforms.uTiempo.value = state.clock.elapsedTime

    const objetivoFuerza = puntero.current.activo ? 1 : 0
    uniforms.uFuerza.value += (objetivoFuerza - uniforms.uFuerza.value) * 0.06

    if (puntero.current.activo) {
      // NDC (-1..1) → coordenadas de mundo en el plano z=0.
      const mundoX = (puntero.current.x * viewport.width) / 2
      const mundoY = (puntero.current.y * viewport.height) / 2
      uniforms.uMouse.value.x += (mundoX - uniforms.uMouse.value.x) * 0.08
      uniforms.uMouse.value.y += (mundoY - uniforms.uMouse.value.y) * 0.08
    }
  })

  return (
    <instancedMesh ref={mallaRef} args={[undefined, undefined, CANTIDAD]} frustumCulled={false}>
      <planeGeometry args={[1, 1]}>
        <instancedBufferAttribute attach="attributes-aCeldaUv" args={[celdasUv, 2]} />
        <instancedBufferAttribute attach="attributes-aFase" args={[fases, 1]} />
        <instancedBufferAttribute attach="attributes-aAlfa" args={[alfas, 1]} />
      </planeGeometry>
      <primitive object={material} attach="material" />
    </instancedMesh>
  )
}
