import { useEffect, useState } from 'react'
import avatar from '../../assets/img/user.png'
import { getProfile } from '../../helpers/getProfile'
import { Link, useParams } from 'react-router-dom'
import { Global } from '../../helpers/Global'
import useAuth from '../../hooks/useAuth';
import { PublicationList } from '../publication/PublicationList'
export const Profile = () => {
    const { auth } = useAuth();
    const [user, setUser] = useState({});
    const [counters, setCounters] = useState({});
    const params = useParams();
    const [iFollow, setIFollow] = useState(false);
    const [publications, setPublications] = useState([]);
    const [page, setPage] = useState(1);
    const [nextButton, setNextButton] = useState(true);


    async function fetchData() {
        let dataUser = await getProfile(params.userId, setUser);
        if (dataUser.following && dataUser.following._id) {
            setIFollow(true);
        }
    }
    useEffect(() => {
        fetchData();
        getCounters();
        getPublications(1,true);
        setNextButton(true);
    }, [params]);

    useEffect(() => {
        fetchData();
        getCounters();
        getPublications(1,true);
        setNextButton(true);
    }, []);
    const getCounters = async () => {
        const url = Global.url + 'user/counters/' + params.userId;
        const token = localStorage.getItem("token");
        const paramsl = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        }
        try {
            const response = await fetch(url, paramsl);
            const data = await response.json();
            if (data.status == "success") {
                setCounters(data);
            }

        } catch (error) {
            console.log(error);
            return null;
        }
    }

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
                setIFollow(true);
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

                setIFollow(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getPublications = async (page = 1, newProfile = false) => {
        const url = Global.url + 'publication/user/' + params.userId + '/' + page;
        const params2 = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        }
        try {
            const resp = await fetch(url, params2);
            const data = await resp.json();
            if (data.status == 'success') {
                
                let newPublications = [];
                if (newProfile) {
                    newPublications=data.publications;
                    setPage(1);
                }
                else{
                    newPublications = [...publications, ...data.publications];
                }
                setPublications(newPublications);
                if (newPublications.length >= data.total ) {
                    setNextButton(false);
                }
                
            }
        } catch (error) {
            console.log(error);
        }
    }

    

    return (
        <>



            <header className="aside__profile-info">

                <div className="profile-info__general-info">
                    <div className="general-info__container-avatar">
                        {user.image != "default.png" ? <img src={Global.url + "user/avatar/" + user.image} className="container-avatar__img" alt="Foto de perfil" /> :
                            <img src={avatar} className="container-avatar__img" alt="Foto de perfil" />
                        }
                    </div>

                    <div className="general-info__container-names">
                        <div className="container-names__name">
                            <h1>{user.name} {user.surname}</h1>
                            {user._id != auth._id &&
                                (iFollow ?
                                    <button className="content__button content__button--right post__button" onClick={() => unFollow(user._id)}>Dejar de seguir</button>
                                    :
                                    <button className="content__button content__button--right" onClick={() => follow(user._id)}>Seguir</button>
                                )
                            }
                        </div>
                        <h2 className="container-names__nickname">{user.nick}</h2>
                        <p>{user.bio}</p>

                    </div>
                </div>

                <div className="profile-info__stats">

                    <div className="stats__following">
                        <Link to={"/social/following/" + user._id} className="following__link">
                            <span className="following__title">Siguiendo</span>
                            <span className="following__number">{counters.following}</span>
                        </Link>
                    </div>
                    <div className="stats__following">
                        <Link to={"/social/followers/" + user._id} className="following__link">
                            <span className="following__title">Seguidores</span>
                            <span className="following__number">{counters.followed}</span>
                        </Link>
                    </div>


                    <div className="stats__following">
                        <Link to={"/social/profile/" + user._id} className="following__link">
                            <span className="following__title">Publicaciones</span>
                            <span className="following__number">{counters.publications}</span>
                        </Link>
                    </div>


                </div>
            </header>


            <PublicationList 
                publications={publications} 
                getPublications={getPublications}
                setPublications={setPublications}
                page={page}
                setPage={setPage}
                nextButton={nextButton}
                setNextButton={setNextButton}
            />
            
            
            <br />
        </>
    )
}
