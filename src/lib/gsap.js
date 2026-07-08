import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Registro central de GSAP. Las animaciones se construyen en Etapa 3;
// todo componente que anime debe importar gsap desde este archivo.
gsap.registerPlugin(useGSAP, ScrollTrigger)

export { gsap, useGSAP, ScrollTrigger }
