import React , { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useStateContext } from '../contexts/ContextProvider'
import axiosClient from '../axios-client'


export default function Login() {
    // const emailRef = useRef()
    const passwordRef = useRef()
    const usernameRef = useRef()

    const { setUser, setToken } = useStateContext()
    const onSubmit = (e) => {
        e.preventDefault()
        const payload = {
            // email: emailRef.current.value,
            password: passwordRef.current.value,
            username: usernameRef.current.value
        }

        axiosClient.post('/login', payload)
            .then(({ data }) => {
                setUser(data.user)
                setToken(data.token)
            })
            .catch(err => {
                const response = err.response
                if (response && response.status === 422) {
                    console.log(response.data.errors)
                }
            })
    }

  return (
    <div className='login-signup-form animated fadeInDown'>
        <div className='form'>
            <h1 className='title'>Login into your account</h1>
            <form action="" onSubmit={onSubmit}>
                {/* <input ref={emailRef} type="email" placeholder='Email' /> */}
                <input ref={usernameRef} type="text" placeholder='Username' />
                <input ref={passwordRef} type="password" placeholder='Password' />
                <button className='btn btn-block'>Login</button>
                {/* <p className='message'>Not Registered? <Link to='/signup'>Create an account</Link> </p> */}
            </form>
        </div>
    </div>
  )
}
