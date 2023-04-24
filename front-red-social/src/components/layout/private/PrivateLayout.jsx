import { Header } from '../private/Header'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export const PrivateLayout = () => {
  return (
    <>
        {/* Layout */}
        <Header/>
        {/* Contenido Principal */}
        <section className='layout__content'>
            <Outlet />
      </section>
      {/* Barra Lateral */}
      <Sidebar/>
    </>
  )
}
