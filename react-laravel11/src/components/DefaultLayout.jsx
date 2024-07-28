import React, { useEffect } from 'react'
import { Link, Navigate, Outlet } from 'react-router-dom'
import { useStateContext } from '../contexts/ContextProvider'
import axiosClient from '../axios-client'
import ProtectedLink from './ProtectedLink'
import { Button } from "antd";

export default function DefaultLayout() {
    const { user, token, notification, setUser, setToken, setNotification } = useStateContext()
    if (!token) {
        return <Navigate to="/login" />
    }

    const onLogout = (e) => {
        e.preventDefault()

        axiosClient.post('/logout')
        .then(() => {
            setUser({})
            setToken(null)
        })
    }

    useEffect(() => {
        axiosClient.get('/user')
        .then(({data}) => {
            setUser(data)
        })
    }, [])
    return (
        <div id="defaultLayout" >
            <aside>
                <Link to="/dashboard">
                    <Button type='primary'>Dashboard</Button>
                </Link>
                <ProtectedLink to="/users" requiredAccess="userManagement">Users</ProtectedLink>
            </aside>
            <div className='content'>
                <header>
                    <div>Header</div>
                    <div> {user ? user.name : ""}  &nbsp; &nbsp;
                    <a onClick={onLogout} className="btn-logout" href="#">Logout</a> </div>
                </header>
                <main>
                    <Outlet />
                </main>
            </div>
            {notification && <div className='notification'>
                {notification}
            </div>
            }
        </div>
    )
}
