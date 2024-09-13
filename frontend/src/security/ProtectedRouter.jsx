import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import Loading from '../components/informative/Loading';

export default function ProtectedRoute({ children, allowedRoles }) {
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if(isLoading) return;

        if(!user) {
            navigate('/login', { replace: true });
        } else if(!allowedRoles.includes(user.role)) {
            navigate('/unauthorized', { replace: true });
        };
    }, [ user, allowedRoles, navigate, isLoading, ]);
    
    if(isLoading) {
        return <Loading />
    }

    return user && (!allowedRoles || allowedRoles.includes(user.role)) ? children : null;
};