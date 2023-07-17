import { Global } from '../../helpers/Global';
import avatar from '../../assets/img/user.png';
import useAuth from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import ReactTimeAgo from 'react-time-ago';

/*eslint-disable */
export const UserList = ({ users, following, setFollowing, loading, nextButton, page, setPage, getUsers }) => {

    const { auth } = useAuth();
    const follow = async (id) => {
        const url = Global.url + 'follow/save';
        const params = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({ followed: id })
        }
        try {
            const resp = await fetch(url, params);
            const data = await resp.json();
            if (data.status === 'success') {
                setFollowing([...following, id]);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const unFollow = async (id) => {
        const url = Global.url + 'follow/unfollow/' + id;
        const params = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        }
        try {
            const resp = await fetch(url, params);
            const data = await resp.json();
            if (data.status === 'success') {
                const newFollowing = following.filter(follow => follow !== id);
                setFollowing(newFollowing);
            }
        } catch (error) {
            console.log(error);
        }
    }
    const nextPage = async () => {
        let next = page + 1;
        if (nextButton) {
            setPage(next);
            getUsers(next);
        }
    }
    return (
        <>
            <div className="content__posts">

                {users.length > 0 && users.map(user => {
                    return (
                        <article key={user._id} className="posts__post">

                            <div className="post__container">

                                <div className="post__image-user">
                                    <Link to={"/social/profile/"+user._id} className="post__image-link">
                                        {user.image != "default.png" ? <img src={Global.url + "user/avatar/" + user.image} className="post__user-image" alt="Foto de perfil" /> :
                                            <img src={avatar} className="post__user-image" alt="Foto de perfil" />
                                        }
                                    </Link>
                                </div>

                                <div className="post__body">

                                    <div className="post__user-info">
                                        <Link to={"/social/profile/"+user._id} className="user-info__name">{user.name} {user.surname}</Link>
                                        <span className="user-info__divider"> | </span>
                                        <Link to={"/social/profile/"+user._id} className="user-info__create-date"><ReactTimeAgo date={Date.parse(user.created_at)} locale="es-Es"/></Link>
                                    </div>

                                    <h4 className="post__content">{user.bio}</h4>

                                </div>

                            </div>
                            {/* Muestro cuando el usuario no es el mio */}
                            {user._id !== auth._id &&
                                <div className="post__buttons">
                                    {!following.includes(user._id) &&
                                        <button className="post__button post__button--green"
                                            onClick={() => follow(user._id)}>
                                            Seguir
                                        </button>
                                    }
                                    {following.includes(user._id) &&
                                        <button className="post__button"
                                            onClick={() => unFollow(user._id)}>
                                            Dejar de seguir
                                        </button>
                                    }

                                </div>
                            }
                        </article>
                    )
                })}

            </div>
            {loading &&
                <div className='horizontal-center'>
                    <div className='line-loader'></div>
                </div>
            }
            {nextButton &&
                <div className="content__container-btn mg-10">
                    <button className="content__btn-more-post" onClick={nextPage}>
                        Ver mas personas
                    </button>
                </div>
            }
            <br />
        </>
    )
}
/*eslint-enable */