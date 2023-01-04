
import './task.css';
import Header from '../../components/Header';
import Title from '../../components/Title';

import { RiListSettingsLine } from 'react-icons/ri';

export default function Task() {
    return (
        <div>
            <Header />
            <div className='container-title'>
                <Title name={'Gerencie suas tarefas'}>
                    <RiListSettingsLine size={20} />
                </Title>
            </div>
        </div>
    )
}