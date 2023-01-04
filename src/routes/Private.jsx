import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import firebase from '../service/firebaseConnection';

export default function Private({ children }) {

    const [loading, setLoading] = useState(true);
    const [signed, setSigned] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function checkLogin() {

            // Olhar se o user está logado ou não
            const not = firebase.auth().onAuthStateChanged((user) => {

                // Se o user estiver logado
                if (user) {
                    const userData = {
                        uid: user.uid,
                        email: user.email
                    }

                    localStorage.setItem('@UserInfo', JSON.stringify(userData))
                    setLoading(false);
                    setSigned(true);
                }
                else {
                    localStorage.removeItem('@UserInfo');
                    setLoading(false);
                    setSigned(false);
                }
            })
        }

        checkLogin()

    }, [])

    if (loading) {
        return <div />
    }

    if (!signed) {
        return navigate('/')
    }

    return children;
}