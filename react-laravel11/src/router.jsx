import {createBrowserRouter, Navigate} from 'react-router-dom';
import Login from './views/Login';
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
                path: "/users",
                element: (
                <ProtectedRoute requiredAccess="userManagement">
                    <Users />
                </ProtectedRoute>

                ),
            },
            {
                path: "/users/new",
                element: <UserForm key="userCreate" />,
            },
            {
                path: "/users/:id",
                element: <UserForm key="userUpdate" />,
            },
            {
                path: "/dashboard",
                element: <Dashboard />,
            },
            {
                path: "/team1",
                element: <Team1 />,
            },
            {
                path: "/team2",
                element: <Team2 />,
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
]);

export default router