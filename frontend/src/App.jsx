import AuthProvider from './security/AuthProvider';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { appRoutes } from './router/Routes';
import { CookiesProvider } from 'react-cookie';

const router = createBrowserRouter(appRoutes);

const App = () => {
  return (
    <CookiesProvider>
      <AuthProvider>
        <RouterProvider router={ router } />
      </AuthProvider>
    </CookiesProvider>
  );
};

export default App;