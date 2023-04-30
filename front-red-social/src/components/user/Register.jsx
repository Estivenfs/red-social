import React, { useState } from 'react'
import { useForm } from '../../hooks/useForm';
import { Global } from '../../helpers/Global';

export const Register = () => {
    const { form, changed } = useForm({});
    const [ saved, setSaved ] = useState("not_sended");
    const saveUser = async (e) => {
        e.preventDefault();
        let newUser = form;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        }
        //Guardar usar en la base de datos
        const request = await fetch(Global.url+'user/register', options);
        const data = await request.json();
        if (data.status === 'success') {
            setSaved('saved');
        } else {
            setSaved(data.message);
        }

    }
    return (
        <>
            <header className="content__header">
                <h1 className="content__title">Registro</h1>
            </header>

            <div className="content__posts">
                {saved == "saved" ?<strong className='alert alert-success'>Usuario Registrado correctamente</strong>:""}
                {(saved != "saved" && saved !="not_sended")?<strong className='alert alert-danger'> {saved} </strong>: ""}
                <form className="register-form" onSubmit={saveUser}>
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">Nombre</label>
                        <input type="text" name="name" className="form-input" onChange={changed} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="surname" className="form-label">Apellidos</label>
                        <input type="text" name="surname" className="form-input" onChange={changed} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="nick" className="form-label">Nick</label>
                        <input type="text" name="nick" className="form-input" onChange={changed} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" name="email" className="form-input" onChange={changed} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Contraseña</label>
                        <input type="password" name="password" className="form-input" onChange={changed} />
                    </div>
                    <input type='submit' value='Registrate' className='btn btn-success' />
                </form>

            </div>
        </>
    )
}
