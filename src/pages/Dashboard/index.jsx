import { useState } from 'react';
import './dashboard.css';
import Header from '../../components/Header';
import Title from '../../components/Title';

import { RiDashboardFill, RiSearchEyeFill, RiEditBoxFill } from 'react-icons/ri';
import { BsPlus } from 'react-icons/bs';
import { Link } from 'react-router-dom';

export default function Dashboard() {

    const [tasks, setTasks] = useState([0]);
    const [loading, setLoading] = useState(true);

    return (
        <div>
            <Header />
            <div className='container-title'>

                <Title name={'Dashboard'}>
                    <RiDashboardFill size={20} />
                </Title>

                {tasks.length === 0 ? (
                    <div className="container-dashboard">
                        <span>Você não tem nenhuma tarefa...</span>
                        <Link to={'/tasks'} className='taskLink'>
                            <BsPlus size={20} color={'#fff'} />
                            Adicionar tarefa
                        </Link>
                    </div>
                ) : (
                    <>
                        <Link to={'/tasks'} className='taskLink'>
                            <BsPlus size={20} color={'#fff'} />
                            Adicionar tarefa
                        </Link>

                        <table>
                            <thead>
                                <tr>
                                    <th scope='col'>Clientes</th>
                                    <th scope='col'>Assunto</th>
                                    <th scope='col'>Status</th>
                                    <th scope='col'>Criado</th>
                                    <th scope='col'>#</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td data-label='Cliente'>Caio Freire</td>
                                            <td data-label='Assunto'>Manutenção de Código</td>
                                            <td data-label='Status'>
                                                <span className='badge' style={{ backgroundColor: item.status === 'Open' ? '#1BCF6C' || item.status === 'Progress' : '#999' || '#ff0' }}>Aberto</span>
                                            </td>
                                            <td data-label='Assunto'>10/01/2023</td>
                                            <td data-label='#'>
                                                <button className='action' style={{ backgroundColor: '#0A2241' }} onClick={() => togglePostModal(item)}>
                                                    <RiSearchEyeFill color='#fff' size={17} />
                                                </button>
                                                <Link className='action' style={{ backgroundColor: '#1F336F' }} to={`/new/${item.id}`}>
                                                    <RiEditBoxFill color='#fff' size={17} />
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </>
                )}

            </div>
        </div>
    )
}