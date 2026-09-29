import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from 'gsap/InertiaPlugin'

// Registro central de GSAP. Las animaciones se construyen en Etapa 3;
// todo componente que anime debe importar gsap desde este archivo.
gsap.registerPlugin(useGSAP, ScrollTrigger, Draggable, InertiaPlugin)

export { gsap, useGSAP, ScrollTrigger, Draggable }
