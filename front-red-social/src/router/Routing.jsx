import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { PublicLayout } from '../components/layout/public/PublicLayout';
import { Login } from '../components/user/Login';
import { Logout } from '../components/user/Logout';
import { Register } from '../components/user/Register';
import { PrivateLayout } from '../components/layout/private/PrivateLayout';
import { Feed } from '../components/publication/Feed';
import { AuthProvider } from '../context/AuthProvider';
import { People } from '../components/user/People';
import { Config } from '../components/user/Config';

export const Routing = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<PublicLayout />} >
            <Route index element={<Login />} />
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
          </Route>
          <Route path='/social' element={<PrivateLayout />} >
            <Route index element={<Feed />} />
            <Route path='feed' element={<Feed />} />
            <Route path='people' element={<People />} />
            <Route path='config' element={<Config />} />
            <Route path='logout' element = {<Logout/>} />

          </Route>
          <Route path='*' element={
            <>
              <p>
                <h1>Error 404</h1>
                <Link to='/'>Volver al inicio</Link>
              </p>
            </>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
