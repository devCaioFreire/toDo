import { useEffect, useState, useContext } from 'react';
import './task.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
import firebase from '../../service/firebaseConnection';
import { AuthContext } from '../../context/auth';

import { BsPlus } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';


export default function Task() {

    const { user } = useContext(AuthContext);

    const currentUid = user.uid;

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [customers, setCustomers] = useState([]);
    const [customersSelected, setCustomersSelected] = useState([0])
    const [subjectMatter, setSubjectMatter] = useState([]);
    const [subjectMatterSelected, setSubjectMatterSelected] = useState([0])
    const [status, setStatus] = useState('Aberto');
    const [description, setDescription] = useState('');

    // Buscar Clientes
    useEffect(() => {
        async function loadCustomers() {

            await firebase.firestore().collection('customers').doc(`${currentUid}`).collection('customers').get().then((snapshot) => {

                let listCustomers = [];

                snapshot.forEach((doc) => {
                    listCustomers.push({
                        id: doc.id,
                        customers: doc.data().customerName
                    });
                });
                if (listCustomers.length === 0) {
                    setCustomers([{ customerName: 'Nenhum cliente encontrado...' }])
                    setLoading(false);
                    return;
                };
                setCustomers(listCustomers);
                setLoading(false);

            });
        };

        async function loadSubjects() {

            await firebase.firestore().collection('subjectMatters').doc(`${currentUid}`).collection('subjectMatters').get().then((snapshot) => {

                let listSubjects = [];

                snapshot.forEach((doc) => {
                    listSubjects.push({
                        id: doc.id,
                        subjectMatter: doc.data().subjectMatters
                    })
                })
                if (listSubjects.length === 0) {
                    setSubjectMatter([{ id: 1, subjectMatter: 'Nenhuma tarefa encontrada...' }])
                    setLoading(false);
                    return;
                }
                setSubjectMatter(listSubjects);
                setLoading(false);
            })
        }

        loadCustomers()
        loadSubjects()
    }, [])

    async function handleSave(e) {
        e.preventDefault();

        await firebase.firestore().collection('calls').doc(`${currentUid}`).collection('calls').add({
            created: new Date(),
            customer: customers[customersSelected].customers,
            customerId: customers[customersSelected].id,
            subMatter: subjectMatter[subjectMatterSelected].subjectMatter,
            status: status,
            description: description,
            userId: user.uid
        })
            .then(() => {
                setCustomersSelected(0);
                setSubjectMatterSelected(0);
                setDescription('');
                navigate('/dashboard');
            })
    }

    return (
        <div>
            <Header />
            <div className='container-title'>

                <Title name={'Adicione suas tarefas'}>
                    <BsPlus size={20} />
                </Title>

                <div className="container-tasks">
                    <form className='form-tasks' onSubmit={handleSave}>

                        <label>Clientes</label>
                        {loading ? (
                            <input type={'text'} disabled={true} value={'Carregando...'} />
                        ) : (
                            <select value={customersSelected} onChange={(e) => setCustomersSelected(e.target.value)} multiple={false}>
                                {customers.map((item, index) => {
                                    return (
                                        <option key={index} value={index}>
                                            {item.customers}
                                        </option>
                                    )
                                })}
                            </select>
                        )
                        }

                        <label>Tarefa</label>
                        {loading ? (
                            <input type={'text'} disabled={true} value={'Carregando...'} />
                        ) : (
                            <select value={subjectMatterSelected} onChange={(e) => setSubjectMatterSelected(e.target.value)} multiple={false}>
                                {subjectMatter.map((item, index) => {
                                    return (
                                        <option key={index} value={index}>
                                            {item.subjectMatter}
                                        </option>
                                    )
                                })}
                            </select>
                        )
                        }

                        <label>Status</label>
                        <div className="status">

                            <input type="radio" name="radio" id="radio" value={'Aberto'} checked={status === 'Aberto'} onChange={(e) => setStatus(e.target.value)} />
                            <span>Aberto</span>

                            <input type="radio" name="radio" id="radio" value={'Em Progresso'} checked={status === 'Em Progresso'} onChange={(e) => setStatus(e.target.value)} />
                            <span>Em progresso</span>

                            <input type="radio" name="radio" id="radio" value={'Finalizado'} checked={status === 'Finalizado'} onChange={(e) => setStatus(e.target.value)} />
                            <span>Finalizado</span>
                        </div>

                        <label>Descrição</label>
                        <textarea placeholder='Descreva sua tarefa (opcional)' value={description} onChange={(e) => setDescription(e.target.value)} />

                        <button type='submit'>Registrar</button>

                    </form>
                </div>

            </div>
        </div>
    )
}