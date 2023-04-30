import { useForm } from '../../hooks/UseForm';
import { Global } from '../../helpers/Global';
import { useState } from 'react';
import useAuth from '../../hooks/useAuth';


export const Login = () => {

    const { form, changed } = useForm({});
    const [ saved, setSaved ] = useState("not_sended");
    const { setAuth } = useAuth();
   
    const loginUser = async (e) => {
        e.preventDefault();
        let user = form;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        }
        //Guardar usar en la base de datos
        try {
            const request = await fetch(Global.url+'user/login', options);
            const data = await request.json();
            if (data.status === 'success') {
                setSaved('login');
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setAuth(data.user);
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
                //window.location.href = '/';
            } else {
                setSaved(data.message);
            }
        } catch (error) {
            setSaved(error.message);
            console.log(error);
        }
        
    }

    return (
        <>
            <header className="content__header">
                <h1 className="content__title">Login</h1>
            </header>
            {saved == "login" ?<strong className='alert alert-success'>Usuario Logueado correctamente</strong>:""}
            {(saved != "login" && saved !="not_sended")?<strong className='alert alert-danger'> {saved} </strong>: ""}
            <div className="content__posts" onSubmit={loginUser}>
                <form className="form-login">
                    <div className='form-group'>
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" onChange={changed}/>
                    </div>
                    <div className='form-group'>
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" onChange={changed} />
                    </div>
                    <input type="submit" value="Identificate" className="btn btn-success" />
                </form>
            </div>
        </>
    )
}
