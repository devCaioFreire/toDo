import { useContext } from "react";
import { AuthContext } from '../../context/auth';
import avatarDefault from '../../assets/avatar.png';
import { Link } from 'react-router-dom';
import './header.css';

import { FaTasks } from 'react-icons/fa';
import { RiShieldUserFill } from 'react-icons/ri';
import { RiDashboard2Fill } from 'react-icons/ri'

export default function Header() {

    const { user, Logout } = useContext(AuthContext);

    return (
        <div className="sidebar">

            <div className='image'>
                <img src={user.avatar == null ? avatarDefault : user.avatar} alt={'Avatar User'} />
            </div>

            <Link to={'/dashboard'}>
                <RiDashboard2Fill color='#d9d9d9' size={24} />
                Dashboard
            </Link>

            <Link to={'/tasks'}>
                <FaTasks color='#d9d9d9' size={24} />
                Tarefas
            </Link>

            <Link to={'/profile'}>
                <RiShieldUserFill color='#d9d9d9' size={24} />
                Configuração
            </Link>

            <div className="logout">
                <button className="navOut" onClick={() => Logout()}>Sair</button>
            </div>
        </div>
    )
}
