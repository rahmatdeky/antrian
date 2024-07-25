import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axiosClient from '../axios-client'
import { useStateContext } from '../contexts/ContextProvider'

export default function UserForm() {
    const {setNotification} = useStateContext()
    const navigate = useNavigate()
    const {id} = useParams()
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState({
        id: null,
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    })

    if (id) {
        useEffect(() => {
            setLoading(true)
            axiosClient.get(`/users/${id}`)
            .then(({data}) => {
                setLoading(false)
                setUser(data)
            })
            .catch(() => {
                setLoading(false)
            })
        }, [])
    }

    const onSubmit = (e) => {
        e.preventDefault()

        if (user.id) {
            axiosClient.put(`/users/${user.id}`, user)
            .then(() => {
                // TODO: show notification
                setNotification('User was successfully updated')
                navigate('/users')
            })
            .catch((err) => {
                const response = err.response
                if (response.status === 422) {
                    const errors = response.data.errors
                }
            })
        } else {
            axiosClient.post('/users', user)
            .then(() => {
                // TODO: show notification
                setNotification('User was successfully created')
                navigate('/users')
            })
            .catch((err) => {
                const response = err.response
                if (response.status === 422) {
                    const errors = response.data.errors
                }
            })
        }
    }


  return (
    <div>
        {user.id && <h1>Update User: {user.name} </h1> }
        {!user.id && <h1>Create User</h1> }
        <div className='card animated fadeInDown'>
            {loading && (
                <div className='text-center'>Loading...</div>
            )}
            {!loading && (
                <form onSubmit={onSubmit}>
                    <input value={user.name} onChange={e => setUser({...user, name: e.target.value})} type="text" placeholder='Name' />
                    <input value={user.email} onChange={e => setUser({...user, email: e.target.value})} type="email" placeholder='Email' />
                    <input type="password" onChange={e => setUser({...user, password: e.target.value})} placeholder='Password' />
                    <input type="password" onChange={e => setUser({...user, password_confirmation: e.target.value})} placeholder='Password Confirmation' />
                    <button className='btn'>Save</button>
                </form>
            )}
        </div>
        <div></div>
    </div>
  )
}
