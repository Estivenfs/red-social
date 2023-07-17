import { useEffect, useState } from 'react'
import avatar from '../../assets/img/user.png'
import { Link, useParams } from 'react-router-dom'
import { Global } from '../../helpers/Global'
import useAuth from '../../hooks/useAuth';
import { PublicationList } from './PublicationList'

export const Feed = () => {

    const { auth } = useAuth();
    const params = useParams();
    const [publications, setPublications] = useState([]);
    const [page, setPage] = useState(1);
    const [nextButton, setNextButton] = useState(true);

    useEffect(() => {
        
        
        getPublications(1,false);
        setNextButton(true);
    }, []);


    const getPublications = async (page = 1, showNews = false) => {

        if(showNews){
            setPublications([]);
            setPage(1);
            page=1;
            setNextButton(true);
        }

        const url = Global.url + 'publication/feed/'  + page;
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
                if (page == 1) {
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
            <header className="content__header">
                <h1 className="content__title">Timeline</h1>
                <button className="content__button" onClick={()=>getPublications(1,true)}>Mostrar nuevas</button>
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
        </>
    )
}
