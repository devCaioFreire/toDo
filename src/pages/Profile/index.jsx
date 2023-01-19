import { useState, useContext, useEffect } from 'react';
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
    const [colorSidebar, setColorSidebar] = useState('#1b1b1b');
    const [colorFont, setColorFont] = useState('#ffffff');
    const [colorTheme, setColorTheme] = useState('#1e1f23');
    const [colorButton, setColorButton] = useState('#0a2241');

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

    // Salvar Modificações
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

        await firebase.firestore().collection('modifications').doc(user.uid).set({
            colorSidebar: '#1b1b1b',
            colorFont: '#ffffff',
            colorTheme: '#1e1f23',
            colorButton: '#0a2241'
        });
    }

    // Salvar Modificações de cores
    async function handleSaveColors() {
        await firebase.firestore().collection('modifications').doc(user.uid).update({
            colorSidebar: colorSidebar,
            colorFont: colorFont,
            colorTheme: colorTheme,
            colorButton: colorButton
        });
        // setColorSidebar(colorSidebar);
        // setColorFont(colorFont);
        // setColorTheme(colorTheme);
        // setColorButton(colorButton);
    }

    // Código para restaurar as cores padrão
    function handleRestore() {
        setColorSidebar('#1b1b1b');
        setColorFont('#ffffff');
        setColorTheme('#1e1f23');
        setColorButton('#0a2241');
    }

    // Puxando cores do banco de dados
    useEffect(() => {
        async function loadColors() {
            const doc = await firebase.firestore().collection('modifications').doc(user.uid).get();
            if (doc.exists) {
                const data = doc.data();
                setColorSidebar(data.colorSidebar);
                setColorFont(data.colorFont);
                setColorTheme(data.colorTheme);
                setColorButton(data.colorButton);
            }
        }
        loadColors();
    }, [user.uid]);

    return (
        <div>
            <Header />
            <div className='container-title' >
                <Title name={'Configuração'}>
                    < IoSettingsOutline size={20} />
                </Title>

                <div className="container-profile" style={{ backgroundColor: colorTheme }}>

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

                            <button type={'submit'} style={{ backgroundColor: colorButton }}>Salvar</button>
                        </div>
                    </form>
                </div>

                <div className="settings-nav" style={{ backgroundColor: colorTheme }}>

                    <h3>Escolha sua paleta de cores</h3>

                    <div className="color">

                        <div className="sidebarColor">
                            <label>Sidebar</label>
                            <input type="color" value={colorSidebar} onChange={(e) => setColorSidebar(e.target.value)} id="sidebarColor" />
                        </div>

                        <div className="font-color">
                            <label>Font</label>
                            <input type="color" value={colorFont} onChange={(e) => setColorFont(e.target.value)} id="fontColor" />
                        </div>

                        <div className="theme">
                            <label>Tema</label>
                            <input type="color" value={colorTheme} onChange={(e) => setColorTheme(e.target.value)} id="themeColor" />
                        </div>

                        <div className="btns">
                            <label>Botões</label>
                            <input type="color" value={colorButton} onChange={(e) => setColorButton(e.target.value)} id="btnColor" />
                        </div>

                    </div>

                    <div className="areaBtn">
                        <button onClick={handleRestore} style={{ backgroundColor: colorButton }}>Restaurar</button>
                        <button onClick={handleSaveColors} style={{ backgroundColor: colorButton }}>Salvar</button>
                    </div>

                </div>

            </div>
        </div>
    )
}