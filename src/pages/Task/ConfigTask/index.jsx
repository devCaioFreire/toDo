import { useState, useContext } from 'react';
import '../../Task/task.css'
import Header from '../../../components/Header';
import Title from '../../../components/Title';
import firebase from '../../../service/firebaseConnection';
import { AuthContext } from '../../../context/auth';

import { IoSettingsOutline } from 'react-icons/io5';
import { BsPlus } from 'react-icons/bs';


export default function ConfigTask() {

    const { user } = useContext(AuthContext);

    const [customerName, setCustomerName] = useState('');
    const [email, setEmail] = useState('');
    const [cnpjStatus, setCnpjStatus] = useState('Não');
    const [cnpj, setCnpj] = useState('');
    const [phoneStatus, setPhoneStatus] = useState('Não');
    const [phone, setPhone] = useState('');
    const [adressStatus, setAdressStatus] = useState('Não');
    const [adress, setAdress] = useState('');

    const [subjectMatter, setSubjectMatter] = useState();

    async function handleRegisterCustomer(e) {
        e.preventDefault();

        const currentUid = user.uid;

        if (customerName && email && cnpjStatus && phoneStatus && adressStatus !== '') {
            await firebase.firestore().collection('customers').doc(`${currentUid}`).collection('customers').add({
                customerName: customerName,
                email: email,
                cnpj: cnpj,
                phone: phone,
                adress: adress
            })
        }
        // else if (customerName && email !== '' && cnpjStatus && phoneStatus && adressStatus === 'Sim') {
        //     await firebase.firestore().collection('customers').doc(`${currentUid}`).collection('customers').add({
        //         cnpj: cnpj,
        //         phone: phone,
        //         adress: adress
        //     })
        // }
        setCustomerName('');
        setEmail('');
        setCnpj('');
        setPhone('');
        setAdress('');
    }

    async function handleSubjectMatter(e) {
        e.preventDefault();

        const currentUid = user.uid;

        if (subjectMatter !== '') {

            await firebase.firestore().collection('subjectMatters').doc(`${currentUid}`).collection('subjectMatters').add({
                subjectMatters: subjectMatter
            })
        }
        setSubjectMatter('');
    }

    return (
        <div>
            <Header />
            <div className='container-title'>

                <Title name={'Configuração de tarefas'}>
                    <IoSettingsOutline size={20} />
                </Title>

                <div className="container-tasks">
                    <form className='form-configTask' onSubmit={handleRegisterCustomer}>

                        <label>Cliente</label>
                        <input type="text" placeholder='Caio Freire' value={customerName} onChange={(e) => setCustomerName(e.target.value)} />

                        <label>Email</label>
                        <input type="email" placeholder='seu@email.com' value={email} onChange={(e) => setEmail(e.target.value)} />

                        <div className="areaRadios">
                            <label>CNPJ</label>
                            <label>Telefone</label>
                            <label>Endereço</label>
                        </div>
                        <div className="status">

                            <input type="radio" value={'Não'} checked={cnpjStatus === 'Não'} onChange={(e) => setCnpjStatus(e.target.value)} />
                            <span>Não</span>

                            <input type="radio" value={'Sim'} checked={cnpjStatus === 'Sim'} onChange={(e) => setCnpjStatus(e.target.value)} />
                            <span>Sim</span>

                            <input type="radio" value={'Não'} checked={phoneStatus === 'Não'} onChange={(e) => setPhoneStatus(e.target.value)} />
                            <span>Não</span>

                            <input type="radio" value={'Sim'} checked={phoneStatus === 'Sim'} onChange={(e) => setPhoneStatus(e.target.value)} />
                            <span>Sim</span>

                            <input type="radio" value={'Não'} checked={adressStatus === 'Não'} onChange={(e) => setAdressStatus(e.target.value)} />
                            <span>Não</span>

                            <input type="radio" value={'Sim'} checked={adressStatus === 'Sim'} onChange={(e) => setAdressStatus(e.target.value)} />
                            <span>Sim</span>

                        </div>

                        {cnpjStatus === 'Sim' ? (
                            <>
                                <label>Insira o CNPJ</label>
                                <input type={'number'} placeholder={'xxxxxxxx0001-xx'} value={cnpj} onChange={((e) => setCnpj(e.target.value))} />
                            </>
                        )
                            :
                            <></>
                        }

                        {phoneStatus === 'Sim' ? (
                            <>
                                <label>Insira o Telefone</label>
                                <input type={'tel'} placeholder={'xxxxx-xxxx'} value={phone} onChange={((e) => setPhone(e.target.value))} />
                            </>
                        )
                            :
                            <></>
                        }

                        {adressStatus === 'Sim' ? (
                            <>
                                <label>Insira o Endereço</label>
                                <input type={'text'} placeholder={'Rua Fictícia, 100'} value={adress} onChange={((e) => setAdress(e.target.value))} />
                            </>
                        )
                            :
                            <></>
                        }

                        <button type="submit">Registrar Cliente</button>

                    </form>
                </div>


                <Title name={'Adicione o assunto de suas tarefas'}>
                    <BsPlus size={20} />
                </Title>

                <div className="container-tasks">
                    <form className='form-configTask' onSubmit={handleSubjectMatter}>

                        <label>Assunto</label>
                        <input type={'text'} placeholder={'Manutenção de Código'} value={subjectMatter} onChange={(e) => setSubjectMatter(e.target.value)} />

                        <button type='submit'>Registrar</button>

                    </form>
                </div>

            </div>
        </div>
    )
}