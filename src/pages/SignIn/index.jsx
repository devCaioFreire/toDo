import { useState, useContext } from 'react';
import { AuthContext } from '../../context/auth';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './signIn.css';

export default function SignIn() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { Login, loadingAuth } = useContext(AuthContext);

    function handleLogin(e) {
        e.preventDefault();

        if (email && password !== '') {
            Login(email, password)
        }
        else {
            alert('Preencha todos os campos!')
        }
    }

    return (
        <div className='container-si'>

            <div className="login">

                <div className="logo">
                    <img src={logo} alt={logo} />
                </div>

                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        name="email"
                        placeholder='seu@email.com'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder='***************'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button type='submit'>{loadingAuth ? 'Acessando...' : 'Acessar'}</button>

                </form>

                <Link to={'/register'}>Crie uma conta</Link>

            </div>
        </div>
    )
}