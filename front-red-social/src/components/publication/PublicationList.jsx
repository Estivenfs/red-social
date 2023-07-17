/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom'
import { Global } from '../../helpers/Global';
import avatar from '../../assets/img/user.png';
import useAuth from '../../hooks/useAuth';
import ReactTimeAgo from 'react-time-ago';
export const PublicationList = ({publications, getPublications, page, setPage, nextButton, setNextButton, setPublications}) => {

    const { auth } = useAuth();

    const nextPage = () => {
        let nextPage = page + 1;
        setPage(nextPage);
        getPublications(nextPage);
    }

    const deletePublication = async (id) => {
        const url = Global.url + 'publication/remove/' + id;
        const params3 = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        }
        try {
            const resp = await fetch(url, params3);
            const data = await resp.json();
            if (data.status == 'success') {
                const newList = publications.filter((item) => item._id !== id);
                setPublications(newList);
            }
        } catch (error) {
            console.log(error);
        }
    }



    return (
        <>
            <div className="content__posts">
                {publications.map((publication) => {
                    return (
                        <article className="posts__post" key={publication._id}>

                            <div className="post__container">

                                <div className="post__image-user">
                                    <Link to={"/social/profile/" + publication.user._id} className="post__image-link">
                                        {publication.user.image != "default.png" ? <img src={Global.url + "user/avatar/" + publication.user.image} className="post__user-image" alt="Foto de perfil" /> :
                                            <img src={avatar} className="post__user-image" alt="Foto de perfil" />
                                        }
                                    </Link>
                                </div>

                                <div className="post__body">

                                    <div className="post__user-info">
                                        <a href="#" className="user-info__name">{publication.user.name} {publication.user.surname}</a>
                                        <span className="user-info__divider"> | </span>
                                        <a href="#" className="user-info__create-date"><ReactTimeAgo date={Date.parse(publication.created_at)}  locale="es-Es"/></a>
                                    </div>

                                    <h4 className="post__content">{publication.text}</h4>
                                    {publication.file && <img src={Global.url + "publication/media/" + publication.file} className="post__image" alt="Imagen de la publicacion" />}
                                </div>

                            </div>

                            {auth._id === publication.user._id &&
                                <div className="post__buttons">

                                    <button onClick={() => deletePublication(publication._id)} className="post__button">
                                        <i className="fa-solid fa-trash-can"></i>
                                    </button>

                                </div>
                            }
                        </article>
                    )
                })}



            </div>
            {nextButton &&
                <div className="content__container-btn">
                    <button className="content__btn-more-post" onClick={nextPage}>
                        Ver mas publicaciones
                    </button>
                </div>
            }
        </>

    )
}
