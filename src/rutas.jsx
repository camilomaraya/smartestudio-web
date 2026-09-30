import Layout from './Layout'
import Home from './paginas/Home'
import Servicios from './paginas/Servicios'
import FichaServicio from './paginas/FichaServicio'
import NoEncontrada from './paginas/NoEncontrada'

// Todas las rutas cuelgan del Layout: nav, contacto y footer son comunes.
export const rutas = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'servicios', element: <Servicios /> },
      { path: 'servicios/:slug', element: <FichaServicio /> },
      { path: '*', element: <NoEncontrada /> },
    ],
  },
]
