import React from 'react';
import { useAuth } from '../../security/AuthProvider';
import { useNavigate } from 'react-router-dom';
import Loading from '../informative/Loading';

function NavBar({ children }) {

    const { user, isLoading, logout } = useAuth();

    const navigate = useNavigate();

    function handleLogout(e) {

        if(isLoading) return;

        logout();
        navigate('/login');
    };

    if(isLoading) return <Loading />;

    const buttons_admin = [ 'Usuarios' ];

    return (
        <div className='fixed max-w-8xl mx-auto px-4 sm:px-6 md:px-8'>
            <div className='lg:text-sm lg:leading-6 relative'>
                <ul>
                    <li>
                        <form onSubmit={ handleLogout }>
                            <button type='submit'>
                                logout
                            </button>
                        </form>
                    </li>

                    {/* Viewable only by admins. */}
                    {user.role === 4 && 
                        buttons_admin.map((item, index) => {
                            <li className='w-full text-xs bg-white border-solid  border-gray-400 hover:bg-gray-300 text-gray-400 font-bold py-1 px-4 rounded mt-2'>
                                item
                            </li>
                        })
                    }

                    {/* Viewable by admins and desk workers. */}
                    {[4, 3].includes(user.role) &&
                        <>
                            <li>Consultar Turnos</li>
                            <li>Gestion de Inventarios</li>
                            <li>Reportes de Datos de Visitas</li>
                            <li>Reporte Financiero</li>
                            <li>Reporte de Inventario</li>
                            <li>Reporte de Medicacion</li>
                        </>
                    }
                </ul>
            </div>
        </div>
    );
};

export default NavBar;