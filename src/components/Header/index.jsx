import { useContext, useState } from "react";
import { AuthContext } from '../../context/auth';
import avatarDefault from '../../assets/avatar.png';
import { Link } from 'react-router-dom';
import './header.css';
import firebase from '../../service/firebaseConnection';

import { FaTasks } from 'react-icons/fa';
import { RiShieldUserFill, RiListSettingsLine } from 'react-icons/ri';
import { RiDashboard2Fill } from 'react-icons/ri'

export default function Header() {

    const { user, Logout } = useContext(AuthContext);

    const m = firebase.firestore().collection('modifications').doc(user.uid).get();
    const colorSidebar = m.colorSidebar

    return (
        <div className="sidebar" style={{ backgroundColor: '#1b1b1b' }}>

            <div className='image'>
                <img src={user.avatar == null ? avatarDefault : user.avatar} alt={'Avatar User'} />
                <p className="text-img">Olá, <span>{user.nickname ? user.nickname : user.name + ' ' + user.lastName}</span> </p>
            </div>

            <Link to={'/dashboard'}>
                <RiDashboard2Fill color='#d9d9d9' size={24} />
                Dashboard
            </Link>

            <Link to={'/tasks'}>
                <FaTasks color='#d9d9d9' size={24} />
                Tarefas
            </Link>

            <Link to={'/config'}>
                <RiListSettingsLine color='#d9d9d9' size={24} />
                Configurar Tarefas
            </Link>

            <Link to={'/profile'}>
                <RiShieldUserFill color='#d9d9d9' size={24} />
                Perfil
            </Link>

            <div className="logout">
                <button className="navOut" onClick={() => Logout()}>Sair</button>
            </div>
        </div>
    )
}

