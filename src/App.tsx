import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import Login from './routes/login';
import Spinner from './components/spinner';
import { lazy, Suspense } from 'react';
import ConfirmAccount from './routes/confirm-account';
import { AuthProvider } from './services/auth/context/auth-context';
import ProtectedRoute from './components/ ProtectedRoute';

const SuperAdmin = lazy(() => import('./pages/admin'));

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Login />} />
      <Route path="/confirm-account" element={<ConfirmAccount />} />

      <Route
        path="/admin/*"
        element={
          // <ProtectedRoute requiredRole={['Super Admin']}>
          <ProtectedRoute adminOnly>
            <SuperAdmin />
          </ProtectedRoute>
        }
      />
    </>,
  ),
);

export const Loading = () => (
  <div className="bg-gray-50 text-gray-90 flex h-screen w-full items-center justify-center">
    <Spinner />
  </div>
);

const App = () => (
  <AuthProvider>
    <Suspense fallback={<Loading />}>
      <RouterProvider router={router} />
    </Suspense>
  </AuthProvider>
);

export default App;
