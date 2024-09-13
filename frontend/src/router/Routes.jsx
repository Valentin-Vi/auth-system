import NavBar from '../components/navigation/NavBar';
import Register from '../components/auth/Register';
import Login from '../components/auth/Login';
import Unauthorized from '../components/error/Unauthorized';
import Error from '../components/error/Error';
import NotFound from '../components/error/NotFound';
import ProtectedRoute from '../security/ProtectedRouter';
import Home from '../components/service/Home';

export const appRoutes = [
    {
        path: '/',
        element: (
            <ProtectedRoute allowedRoles={[ 0, 1, 2, 3, 4 ]}>
                <Home />
            </ProtectedRoute>
        ),
        errorElement: <Error />,
    }, {
        path: '/home',
        element: (
            <ProtectedRoute allowedRoles={[ 0, 1, 2, 3, 4 ]}>
                <Home />
            </ProtectedRoute>
        ),
        errorElement: <Error />,
    }, {
        path: '/signup',
        element: <Register />,
        errorElement: <Error />,
    }, {
        path: '/login',
        element: <Login />,
        errorElement: <Error />,
    }, {
        path: '/error',
        element: <Error />,
    }, {
        path: '/unauthorized',
        element: <Unauthorized />,
    }, {
        path: '/notfound',
        element: <NotFound />,
    }
];
