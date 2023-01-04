import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/auth';
import logo from '../../assets/logo.png';
import './signUp.css';

export default function SignUp() {

    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { Register } = useContext(AuthContext);

    function handleRegister(e) {
        e.preventDefault();

        if (name && lastName && email && password !== '') {
            Register(name, lastName, email, password);
            setName('');
            setLastName('');
            setEmail('');
            setPassword('');
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

                <form className='form-register' onSubmit={handleRegister}>
                    <input
                        type="text"
                        name="name"
                        placeholder='Nome'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <input
                        type="text"
                        name="lastName"
                        placeholder='Sobrenome'
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />

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

                    <button type='submit'>Registrar</button>

                </form>

                <Link to={'/'}>Já tenho uma conta</Link>

            </div>
        </div>
    )
}