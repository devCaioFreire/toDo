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

    const [nickname, setNickname] = useState(user && user.nickname);
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
                                nickname: nickname,
                                name: name,
                                lastName: lastName
                            })
                            .then(() => {
                                let data = {
                                    ...user,
                                    avatar: urlAvatar,
                                    nickname: nickname,
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

        if (name !== '' && lastName !== '' && avatars === null) {
            await firebase.firestore().collection('users').doc(user.uid).update({
                nickname: nickname,
                name: name,
                lastName: lastName,
            })
                .then(() => {
                    let data = {
                        ...user,
                        nickname: nickname,
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

                            <label>Nickname</label>
                            <input type="text" value={nickname} placeholder={'Como prefere ser chamado?'} onChange={(nick) => setNickname(nick.target.value)} />

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

                <div className="settings-nav">

                    <h3>Escolha a cor do tema</h3>

                    <div className="color">

                        <div className="sidebarColor">
                            <label>Sidebar</label>
                            <input type="color" value={'#1B1B1B'} id="sidebarColor" />
                        </div>

                        <div className="font-color">
                            <label>Font</label>
                            <input type="color" value={'#D9D9D9'} id="fontColor" />
                        </div>

                        <div className="theme">
                            <label>Tema</label>
                            <input type="color" value={'#1E1F23'} id="themeColor" />
                        </div>

                        <div className="btns">
                            <label>Botões</label>
                            <input type="color" value={'#0A2241'} id="btnColor" />
                        </div>

                    </div>

                    <div className="areaBtn">
                        <button>Restaurar</button>
                        <button>Salvar</button>
                    </div>

                </div>

            </div>
        </div>
    )
}