import { Header } from '../private/Header'
import { Navigate, Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import useAuth from '../../../hooks/useAuth'
import { Loading } from '../public/Loading'

export const PrivateLayout = () => {
  const { auth, loading } = useAuth();
  if (loading) {
    return (
      <Loading/>
    );
  } else {
    return (
      <>
        {!auth._id ? <Navigate to='/' /> :
          <>
            {/* Layout */}

            <Header />
            {/* Contenido Principal */}
            <section className='layout__content'>
              <Outlet />
            </section>
            {/* Barra Lateral */}
            <Sidebar />

          </>
        }
      </>
    )
  }
}
