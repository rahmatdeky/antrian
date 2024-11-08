import {createBrowserRouter, Navigate} from 'react-router-dom';
import Login from './views/Login/Login';
import Signup from './views/Signup';
import Users from './views/Users';
import NotFound from './views/NotFound';
import DefaultLayout from './components/DefaultLayout2';
import GuestLayout from './components/GuestLayout';
import Dashboard from './views/Dashboard';
import UserForm from './views/UserForm';
import Forbidden from './views/Forbidden';
import ProtectedRoute from './components/protectedRoute';
import Team1 from './views/team1';
import Team2 from './views/team2';
import LandingPage from './views/LandingPage/LandingPage';
import LandingPageAntrian from './views/LandingPage/Antrian/LandingPageAntrian';
import Loket from './views/Loket/Loket';
import Antrian from './views/Antrian/Antrian';
import SettingLayanan from './views/Setting/Setting_Layanan/SettingLayanan';
import SettingLoket from './views/Setting/Setting_Loket/SettingLoket';
import SettingUser from './views/Setting/Setting_User/SettingUser';
import DetailSettingUser from './views/Setting/Setting_User/DetailSettingUser';
import RiwayatAntrian from './views/RiwayatAntrian/RiwayatAntrian';

const router = createBrowserRouter([
    {
        path: "/",
        element: <DefaultLayout />,
        children: [
            {
                path: "/",
                element: <Navigate to="/dashboard" />,
            },
            {
                path: "/dashboard",
                element: <Dashboard />,
            },
            {
                path: "/loket",
                element: (
                    <ProtectedRoute requiredAccess="Petugas Loket">
                        <Loket />
                    </ProtectedRoute>
                )
            },
            {
                path: "/antrian",
                element: (
                    <ProtectedRoute requiredAccess="Petugas Loket">
                        <Antrian />
                    </ProtectedRoute>
                )
            },
            {
                path: "/setting/layanan",
                element: (
                    <ProtectedRoute requiredAccess="Admin">
                        <SettingLayanan />
                    </ProtectedRoute>
                )
            },
            {
                path: "/setting/loket",
                element: (
                    <ProtectedRoute requiredAccess="Admin">
                        <SettingLoket />
                    </ProtectedRoute>
                )
            },
            {
                path: "/setting/user",
                element: (
                    <ProtectedRoute requiredAccess="Admin">
                        <SettingUser />
                    </ProtectedRoute>
                )
            },
            {
                path: "/setting/user/detail",
                element: (
                    <ProtectedRoute requiredAccess="Admin">
                        <DetailSettingUser />
                    </ProtectedRoute>
                )
            },
            {
                path: "/riwayat",
                element: <RiwayatAntrian />,
            },
        ],
    },
    {
        path: "/",
        element: <GuestLayout />,
        children: [
            {
                path: "/",
                element: <Navigate to="/landing" />,
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/landing",
                element: <LandingPage />,
            },
            {
                path: "/landing/antrian",
                element: <LandingPageAntrian />,
            }
            // {
            //     path: "/signup",
            //     element: <Signup />,
            // },
        ],
    },
    {
        path: "*",
        element: <NotFound />,
    },
    {
        path: "/403",
        element: <Forbidden />,
    },
],
{
    basename: "/react-app",
});

export default router