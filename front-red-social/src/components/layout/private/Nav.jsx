import { NavLink } from 'react-router-dom'
import avatar from '../../../assets/img/user.png'
import useAuth from '../../../hooks/useAuth';
import { Global } from '../../../helpers/Global';

export const Nav = () => {
    const { auth } = useAuth();
    return (
        <nav className="navbar__container-lists">

            <ul className="container-lists__menu-list">
                <li className="menu-list__item">
                    <NavLink to="/social" className="menu-list__link">
                        <i className="fa-solid fa-house"></i>
                        <span className="menu-list__title">Inicio</span>
                    </NavLink>
                </li>

                <li className="menu-list__item">
                    <NavLink to="/social/feed" className="menu-list__link">
                        <i className="fa-solid fa-list"></i>
                        <span className="menu-list__title">Timeline</span>
                    </NavLink>
                </li>

                <li className="menu-list__item">
                    <NavLink to="/social/people" className="menu-list__link">
                        <i className="fa-solid fa-user"></i>
                        <span className="menu-list__title">Gente</span>
                    </NavLink>
                </li>

                {/* <li className="menu-list__item">
                    <a href="#" className="menu-list__link">
                        <i className="fa-regular fa-envelope"></i>
                        <span className="menu-list__title">Mensajes</span>
                    </a>
                </li> */}
            </ul>

            <ul className="container-lists__list-end">
                <li className="list-end__item">
                    <NavLink to={"/social/profile/" + auth._id} className="list-end__link-image">
                    {auth.image != "default.png" ?<img src= {Global.url + "user/avatar/" + auth.image}  className="list-end__img" alt="Imagen de perfil" /> : 
                        <img src= {avatar}  className="list-end__img" alt="Imagen de perfil" />
                    }
                    </NavLink>
                </li>
                <li className="list-end__item">
                    <NavLink to={"/social/profile/" + auth._id} className="list-end__link">
                        <span className="list-end__name">{auth.nick}</span>
                        {/* <i className="fa-solid fa-caret-down"></i> */}
                    </NavLink>
                </li>
                <li className="list-end__item">
                    <NavLink to="/social/config" className="list-end__link">
                        <i className="fa-solid fa-cog"></i>
                        <span className="list-end__name">Ajuste</span>
                    </NavLink>
                </li>
                <li className="list-end__item">
                    <NavLink to="/social/logout" className="list-end__link">
                        <i className="fa-solid fa-sign-out"></i>                        
                        <span className="list-end__name">Cerrar Sesión</span>
                    </NavLink>
                </li>
            </ul>

        </nav>
    )
}
