import { useState, useEffect, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import firebase from '../service/firebaseConnection';

export const AuthContext = createContext({});

export default function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const [colorSidebar, setColorSidebar] = useState('#1b1b1b');
    const [colorFont, setColorFont] = useState('#ffffff');
    const [colorTheme, setColorTheme] = useState('#1e1f23');
    const [colorButton, setColorButton] = useState('#0a2241');

    const navigate = useNavigate();

    useEffect(() => {

        function loadStorage() {
            const storageUser = localStorage.getItem('SystemUser');

            if (storageUser) {
                setUser(JSON.parse(storageUser));
                setLoading(false);
            }
            setLoading(false);
        }

        loadStorage();

    }, []);

    function storageUser(data) {
        localStorage.setItem('SystemUser', JSON.stringify(data));
    }

    // Logar User
    async function Login(email, password) {
        setLoadingAuth(true);

        // Confirmando dados para logar
        await firebase.auth().signInWithEmailAndPassword(email, password)

            // Caso esteja tudo certo
            .then(async (info) => {

                // Identificador único do user
                let uid = info.user.uid;

                // Pegando info do user no database
                const infoUser = await firebase.firestore().collection('users').doc(uid).get();

                // Criando variavél para atualizar os estados
                let data = {
                    uid: uid,
                    name: infoUser.data().name,
                    lastName: infoUser.data().lastName,
                    nickname: infoUser.data().nickname,
                    avatar: infoUser.data().avatar,
                    email: infoUser.data().email
                }

                // Mudando info do user
                setUser(data);
                // Adicionando dados na memória
                storageUser(data);
                setLoadingAuth(false);
                navigate('/dashboard')
            })
            .catch((error) => {
                console.log(error);
                setLoadingAuth(false);
            })

    }

    // Registrar User
    async function Register(name, lastName, email, password) {
        setLoadingAuth(true)

        // Cadastrando User
        await firebase.auth().createUserWithEmailAndPassword(email, password)

            // Caso de sucesso
            .then(async (value) => {

                // Pegando Identificador Unico do User
                let uid = value.user.uid;

                //Adicionando no Firestore
                await firebase.firestore().collection('users')
                    .doc(uid).set({
                        name: name,
                        lastName: lastName,
                        nickname: nickname,
                        email: email,
                        avatar: null
                    })

                    // Disponibilizar info dentro da aplicação
                    .then(() => {
                        let data = {
                            uid: uid,
                            name: name,
                            lastName: lastName,
                            nickname: nickname,
                            email: value.user.email,
                            avatarUrl: null
                        }
                        // Mudando info do user
                        setUser(data);
                        // Adicionando dados na memória
                        storageUser(data);
                        navigate('/dashboard')
                    })
            })
            .catch((error) => {
                console.log(error)
                setLoadingAuth(false)
            })
    }

    // Deslogar User
    async function Logout() {
        await firebase.auth().signOut();
        localStorage.removeItem('SystemUser');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, setUser, storageUser, loadingAuth, Login, Register, Logout, colorSidebar, setColorSidebar,colorFont, setColorFont, colorTheme, setColorTheme,colorButton, setColorButton }}>
            {children}
        </AuthContext.Provider>
    )
}