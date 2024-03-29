import { useEffect, useState } from 'react'
import { Global } from '../../helpers/Global';
import { UserList } from './UserList';


export const People = () => {


  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [nextButton, setNextButton] = useState(true);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState([]);


  useEffect(() => {
    getUsers(1);
  }, []);

  const getUsers = async (nextPage) => {
    setLoading(true);
    const url = Global.url + 'user/list/' + nextPage;
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
      if (data.status === 'success') {
        const newUsers = data.users;
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
        <h1 className="content__title">Gente</h1>

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
