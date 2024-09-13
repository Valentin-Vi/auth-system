import { Link } from 'react-router-dom';
import EmailInput from './EmailInput';
import PasswordInput from './PasswordInput';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../security/AuthProvider';
import Loading from '../informative/Loading';

function Register() {
    
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ firstname, setFirstname ] = useState('');
    const [ lastname, setLastname ] = useState('');

    const { signup, user, isLoading } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        if(!isLoading && user) navigate('/home');
    },[ user, isLoading, navigate, ])

    async function handleRegisterSubmit(e) {
        e.preventDefault();
        const status = await signup(email, password, firstname, lastname);
        if(status === 200) {
            navigate('/login');
        };
    };
    
    function handleFirstnameChange(e) {
        setFirstname(e.target.value);
    };

    function handleLastnameChange(e) {
        setLastname(e.target.value);
    };

    if(isLoading) return <Loading />;

    return (
        <form onSubmit={handleRegisterSubmit}>
            <div className="flex flex-col items-center w-full pt-10 pb-10">
                <label className="text-xl text-gray-600 text-center mb-2">
                    Register
                </label>
                <EmailInput setEmail={setEmail}/>
                <PasswordInput setPassword={setPassword}/>
                <div className="relative max-w-xs mt-2">
                    <input
                        type="text"
                        placeholder="First Name"
                        value={firstname}
                        onChange={handleFirstnameChange}
                        className='w-full pl-12 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg'
                    />
                    <svg className='w-6 h-6 text-gray-600 absolute left-3 inset-y-0 my-auto' xmlns='http://www.w3.org/2000/svg'  fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="gray">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" />
                    </svg>
                </div>
                <div className="relative max-w-xs mt-2">
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={lastname}
                        onChange={handleLastnameChange}
                        className='w-full pl-12 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg'
                    />
                    <svg className='w-6 h-6 text-gray-600 absolute left-3 inset-y-0 my-auto' xmlns='http://www.w3.org/2000/svg'  fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="gray">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" />
                    </svg>
                </div>
                <div className='flex items-center'>
                    <Link to='/login' className='bg-white border-solid border-gray-400 hover:bg-gray-100 text-gray-400 font-bold py-2 px-4 rounded mt-2'>Login</Link>
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
                        Submit
                    </button>
                </div>
            </div>
        </form>
    );
};

export default Register;