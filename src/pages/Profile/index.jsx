import { useState, useContext } from 'react';
import { AuthContext } from '../../context/auth';
import './profile.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
import firebase from '../../service/firebaseConnection';

import avatarDefault from '../../assets/avatar.png';
import { IoSettingsOutline } from 'react-icons/io5';
import { FiUpload } from 'react-icons/fi';


export default function Profile() {

    const { user, setUser, storageUser } = useContext(AuthContext);

    const [name, setName] = useState(user && user.name);
    const [lastName, setLastName] = useState(user && user.lastName);
    const [email, setEmail] = useState(user && user.email);
    const [userAvatar, setUserAvatar] = useState(user && user.avatar);
    const [avatars, setAvatars] = useState(null);

    // Trocando Avatar
    function handleFile(e) {
        if (e.target.files[0]) {
            const imageFile = e.target.files[0];

            // Setando imagens suportadas
            if (imageFile.type === 'image/jpeg'
                || imageFile.type === 'image/png'
                || imageFile.type === 'image/svg+xml'
                || imageFile.type === 'image/webp'
                || imageFile.type === 'image/gif') {

                // Trocando de null para a imagem selecionada
                setAvatars(imageFile);

                // Preview 
                setUserAvatar(URL.createObjectURL(e.target.files[0]));
            }
            else {
                alert('Imagem não suportada!');
                setUserAvatar(null);
                return null;
            }
        }
    }

    // Atualizar Avatar
    async function handleUpload() {

        // Pegando UID do user
        const currentUid = user.uid;

        // Criando um local para armazenar no database
        const uploadProfile = await firebase.storage()
            .ref(`images/${currentUid}/${avatars.name}`)
            .put(avatars)
            .then(async () => {
                alert('Imagem enviada com sucesso!')

                // Pegando a URL da imagem
                await firebase.storage()
                    .ref(`images/${currentUid}`)
                    .child(avatars.name)
                    .getDownloadURL()
                    .then(async (url) => {

                        let urlAvatar = url;

                        // Atualizando na coleção de users
                        await firebase.firestore()
                            .collection('users')
                            .doc(user.uid)
                            .update({
                                avatar: urlAvatar,
                                name: name,
                                lastName: lastName
                            })
                            .then(() => {
                                let data = {
                                    ...user,
                                    avatar: urlAvatar,
                                    name: name,
                                    lastName: lastName
                                }
                                // Atualizando na aplicação inteira
                                setUser(data);
                                storageUser(data);
                            })
                    })
            })
    }

    async function handleSave(e) {
        e.preventDefault();

        if (name !== '' && lastName !== '') {
            await firebase.firestore().collection('users').doc(user.uid).update({
                name: name,
                lastName: lastName,
            })
                .then(() => {
                    let data = {
                        ...user,
                        name: name,
                        lastName: lastName,
                    };
                    setUser(data);
                    storageUser(data);
                })
        }
        else if (name !== '' && lastName !== '' && avatars !== null) {
            handleUpload();
        }
    }

    return (
        <div>
            <Header />
            <div className='container-title'>
                <Title name={'Configuração'}>
                    < IoSettingsOutline size={20} />
                </Title>

                <div className="container-profile">

                    <form className="form-profile" onSubmit={handleSave}>

                        <label className='avatar-label'>
                            <span>
                                <FiUpload color='#fff' size={25} />
                            </span>

                            <input type={'file'} accept={'image/*'} onChange={handleFile} />

                            {userAvatar === null
                                ?
                                <img src={avatarDefault} width={250} height={250} />
                                :
                                <img src={userAvatar} width={250} height={250} />
                            }

                        </label>

                        <div className="form-inputs">

                            <label>Nome</label>
                            <input type="text" value={name} onChange={(name) => setName(name.target.value)} />

                            <label>Sobrenome</label>
                            <input type="text" value={lastName} onChange={(lName) => setLastName(lName.target.value)} />

                            <label>E-mail</label>
                            <input type="email" value={email} disabled={true} />

                            <button type={'submit'}>Salvar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}