import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export const Logout = () => {
    const {setAuth, setCounters} = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuth({});
        setCounters({});
        navigate('/login');
    }, [])
  return (
    <h1>Logout</h1>
  )
}
