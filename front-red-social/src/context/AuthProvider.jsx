import { createContext, useState, useEffect } from 'react'
import { Global } from '../helpers/Global';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [auth, setAuth] = useState({});
  const [counters, setCounters] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authUser();
  }, []);

  const authUser = async () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (!token || !user) {
      setLoading(false);
      return false;
    }
    const userObj = JSON.parse(user);
    const userId = userObj.id;

    try {
      const request = await fetch(Global.url + 'user/profile/' + userId, {
        method: 'GET',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });
      const data = await request.json();
      if (data.status === 'success') {
        const user = data.user;
        setAuth(
          user
        );
      } else {
        setAuth({});
      }

      //Peticion para los contadores
      const requestCounters = await fetch(Global.url + 'user/counters/' + userId, {
        method: 'GET',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });
      const dataCounters = await requestCounters.json();
      if (dataCounters.status === 'success') {
        // const counters = dataCounters;
        setCounters(
          dataCounters
        );
      }
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }
  return (
    <AuthContext.Provider value={{ auth, setAuth , counters, setCounters, loading}}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext;