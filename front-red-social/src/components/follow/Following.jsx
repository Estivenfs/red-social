import { useEffect, useState } from 'react'
import { Global } from '../../helpers/Global';
import { UserList } from '../user/UserList';
import { useParams } from 'react-router-dom';
import { getProfile } from '../../helpers/getProfile';


export const Following = () => {


  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [nextButton, setNextButton] = useState(true);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState([]);
  const [profile, setProfile] = useState({});

    const paramsl = useParams();

  useEffect(() => {
    getUsers(1);
    getProfile(paramsl.userId,setProfile);
  }, []);

  const getUsers = async (nextPage=1) => {
    setLoading(true);
    const userId = paramsl.userId;
    const url = Global.url + 'follow/following/' +userId +"/"+ nextPage;
    const params = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
      }
    }
    try {
      const resp = await fetch(url, params);
      const data = await resp.json();
      let cleanUsers = [];
      if (data.status === 'success') {
        data.follows.forEach((follow) => {
          cleanUsers = [...cleanUsers, follow.followed];
        });
        const newUsers = cleanUsers;
        const count = users.length + newUsers.length;
        setUsers([...users, ...newUsers]);
        setFollowing(data.users_following);
        if (count >= data.total) {
          setNextButton(false);
        }
      }


    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);

    }


  }

  

  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Usuarios que {profile.name} sigue </h1>

      </header>

      <UserList users={users}
        following={following}
        setFollowing={setFollowing}
        loading={loading}
        nextButton={nextButton}
        page={page}
        setPage={setPage}
        getUsers={getUsers}

      />

    </>
  )
}
