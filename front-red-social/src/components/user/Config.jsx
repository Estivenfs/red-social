import { useState } from 'react';
import avatar from '../../assets/img/user.png';
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';
import { SerializeForm } from '../../helpers/SerializeForm';

export const Config = () => {
   
    const [saved, setSaved] = useState("not_saved");
    const { auth, setAuth } = useAuth();
    const updateUser = async (e) => {
        e.preventDefault();
        const authToken = localStorage.getItem('token');
        let newDataUser = SerializeForm(e.target);
        delete newDataUser.file0;
        if(newDataUser.password === ""){
            delete newDataUser.password;
        }
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken
            },
            body: JSON.stringify(newDataUser)
        }
        //Guardar usar en la base de datos
        let data = null;
        try {
           
            const request = await fetch(Global.url + 'user/update', options);
            data = await request.json();
            if (data.status === 'success') {
                setSaved('saved');
                setAuth(data.user);
                //localStorage.setItem('user', JSON.stringify(data.user));
                //window.location.reload();
            } else {
                setSaved(data.message);
            }
        } catch (error) {
            setSaved(error.message);
            console.log(error);
        }

        //subida de la imagen
        const fileInput = document.getElementById('file0');
        if (data?.status=="success" && fileInput.files[0]) {
            const formData = new FormData();
            formData.append(
                'file0',
                fileInput.files[0]
            );
            const options = {
                method: 'POST',
                headers: {
                    'Authorization': authToken
                },
                body: formData
            }
            try {
                const request = await fetch(Global.url + 'user/upload-image', options);
                const uploadData = await request.json();
                if (uploadData.status === 'success') {
                    setSaved('saved');
                    setAuth(uploadData.user);
                    
                } else {
                    setSaved(uploadData.message);
                }
            } catch (error) {
                setSaved(error.message);
                console.log(error);
            }
        }
    }
    return (
        <>
            <header className="content__header">
                <h1 className="content__title">Ajustes</h1>
            </header>
            <div className="content__posts">
                {saved == "saved" ? <strong className='alert alert-success'>Usuario Actualizado correctamente</strong> : ""}
                {(saved != "saved" && saved != "not_saved") ? <strong className='alert alert-danger'> {saved} </strong> : ""}
                <form className="config-form" onSubmit={updateUser}>
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">Nombre</label>
                        <input type="text" name="name" className="form-input" defaultValue={auth.name} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="surname" className="form-label">Apellidos</label>
                        <input type="text" name="surname" className="form-input" defaultValue={auth.surname} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="nick" className="form-label">Nick</label>
                        <input type="text" name="nick" className="form-input" defaultValue={auth.nick} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="bio" className="form-label">Bio</label>
                        <textarea name="bio" className="form-input" defaultValue={auth.bio} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" name="email" className="form-input" defaultValue={auth.email} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Contraseña</label>
                        <input type="password" name="password" className="form-input" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="file0" className="form-label">Avatar</label>
                        <div className="general-info__container-avatar">
                            {auth.image != "default.png" ? <img src={Global.url + "user/avatar/" + auth.image} className="container-avatar__img" alt="Foto de perfil" /> :
                                <img src={avatar} className="container-avatar__img" alt="Foto de perfil" />
                            }
                        </div>
                        <br/>
                        <input type="file" name="file0" className="form-input" id='file0' />
                    </div>
                    <br></br>
                    <input type='submit' value='Actualizar' className='btn btn-success' />
                </form>
                <br/>
            </div>
        </>
    )
}
