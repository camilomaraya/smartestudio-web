import { createContext, useContext } from 'react'

/*
 * Contexto de la cortina de transición entre rutas.
 *
 * Vive acá y no en Transicion.jsx para que ese módulo exporte solo el
 * componente: Fast Refresh de Vite invalida el módulo entero cuando mezcla
 * componentes con otros exports, y Transicion.jsx se va a seguir editando.
 *
 * Expone:
 *   navegarCon(to, opciones)  — navega con cortina; misma firma que navigate()
 *   avisarScrollListo()       — "ya salté al ancla, podés destapar"
 */
export const ContextoTransicion = createContext(null)

export function useTransicion() {
  const contexto = useContext(ContextoTransicion)
  if (!contexto) {
    throw new Error('useTransicion() se usó fuera de <Transicion>')
  }
  return contexto
}
