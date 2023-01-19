import { useState, useEffect, useContext } from 'react';
import './dashboard.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
import firebase from '../../service/firebaseConnection';
import { AuthContext } from '../../context/auth';
import { format, set } from 'date-fns';

import { RiDashboardFill, RiSearchEyeFill, RiEditBoxFill } from 'react-icons/ri';
import { BsPlus } from 'react-icons/bs';
import { Link } from 'react-router-dom';

export default function Dashboard() {

    const { user } = useContext(AuthContext);
    const currentUID = user.uid;

    const ref = firebase.firestore().collection('calls').doc(`${currentUID}`).collection('calls').orderBy('created', 'desc');
    // const query = ref.where().orderBy('created', 'desc').limit(5);

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [doc, setDoc] = useState();
    const [isEmpty, setIsEmpty] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [detail, setDetail] = useState();

    useEffect(() => {
        async function loadCalls() {
            await ref.limit(5).get().then((snapshot) => {
                updateState(snapshot)
            })
                .catch((error) => {
                    console.log('Erro ao buscar', error);
                    setLoading(false)
                })
            setLoading(false);
        }

        loadCalls();

    }, [])

    async function updateState(snapshot) {
        const isCollectionEmpty = snapshot.size === 0;

        if (!isCollectionEmpty) {

            let list = [];

            snapshot.forEach((doc) => {
                list.push({
                    id: doc.id,
                    customerID: doc.data().customerId,
                    subjectMatter: doc.data().subMatter,
                    customer: doc.data().customer,
                    status: doc.data().status,
                    created: doc.data().created,
                    createdFormat: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
                    description: doc.data().description
                })
            })
            const lastDoc = snapshot.docs[snapshot.docs.length - 1];
            setTasks([...tasks, ...list]);
            setDoc(lastDoc);
        }
        else {
            setIsEmpty(true);
        }
        setLoadingMore(false);
    }

    function togglePostModal(item) {
        setShowModal(!showModal);
        setDetail(item)
    }

    async function handleMore() {
        setLoadingMore(true);
        await ref.startAfter(doc).limit(5)
            .get()
            .then((snapshot) => {
                updateState(snapshot);
            })
    }

    if (loading) {
        return (
            <div>
                <Header />

                <div className='container-title'>
                    <Title name={'Dashboard'}>
                        <RiDashboardFill color='#fff' size={20} />
                    </Title>

                    <div className='container-dashboard'>
                        <span>Buscando Chamados...</span>
                    </div>

                </div>
            </div>
        )
    }

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
                                            <td data-label='Cliente'>{item.customer}</td>
                                            <td data-label='Assunto'>{item.subjectMatter}</td>
                                            <td data-label='Status'>
                                                <span className='badge' style={{ backgroundColor: item.status === 'Aberto' ? '#1BCF6C' : item.status === 'Em Progresso' ? '#0F2651' : '#999' }}>{item.status}</span>
                                            </td>
                                            <td data-label='Data'>{item.createdFormat}</td>
                                            <td data-label='#'>
                                                <button className='action' style={{ backgroundColor: '#d9d9d9' }} onClick={() => togglePostModal(item)} >
                                                    <RiSearchEyeFill color='#000' size={17} />
                                                </button>
                                                <Link className='action' style={{ backgroundColor: '#d9d9d9' }} to={`/tasks/${item.id}`}>
                                                    <RiEditBoxFill color='#000' size={17} />
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        {!loadingMore && !isEmpty && <button className='btn-more' onClick={handleMore}>Carregar Tarefas</button>}
                        {loadingMore && <h3 className='btn-more'>Buscando dados...</h3>}
                    </>
                )}

            </div>
        </div>
    )
}