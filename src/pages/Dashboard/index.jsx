
import './dashboard.css';
import Header from '../../components/Header';
import Title from '../../components/Title';

import { RiDashboardFill } from 'react-icons/ri';

export default function Dashboard() {
    return (
        <div>
        <Header />
        <div className='container-title'>
            <Title name={'Dashboard'}>
                <RiDashboardFill size={20} />
            </Title>
        </div>
    </div>
    )
}