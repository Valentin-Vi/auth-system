import { Link } from 'react-router-dom';
import EmailInput from './EmailInput';
import PasswordInput from './PasswordInput';
import Loading from '../informative/Loading';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../security/AuthProvider';

function Login() {

    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');

    const { login, user, isLoading } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        if(!isLoading && user) navigate('/home');
    }, [ user, isLoading, navigate, ]);

    async function handleLoginSubmit(e) {
        e.preventDefault();
        try {
            const status = await login(email, password);

            if(status === 200) {
                navigate('/home');
            }
        } catch(err) {
            console.error(err);
        };
    };

    if(isLoading) return <Loading />;

    return (
        <form onSubmit={ handleLoginSubmit }>
            <div className="flex flex-col items-center w-full pt-10 pb-10">
                <label className="text-xl text-gray-600 text-center mb-2">
                    LogIn
                </label>
                <EmailInput
                    email={ email }
                    setEmail={ setEmail }
                />
                <PasswordInput
                    password={ password }
                    setPassword={ setPassword }
                />
                <div className="flex items-center">
                    <Link to='/signup' className="bg-white border-solid  border-gray-400 hover:bg-gray-300 text-gray-400 font-bold py-2 px-4 rounded mt-2">
                        Sign-up
                    </Link>
                    <button title="login" type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
                        Login
                    </button>
                </div>
            </div>
        </form>
    );
}

export default Login;