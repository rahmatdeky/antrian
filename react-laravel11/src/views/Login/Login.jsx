import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Flex, message } from 'antd';
import { useStateContext } from '../../contexts/ContextProvider';
import axiosClient from '../../axios-client';
import './Login.css';

export default function Login() {
    const passwordRef = useRef();
    const usernameRef = useRef();
    const { setUser, setToken } = useStateContext();
    const [isLoading, setIsLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();


    
    const onFinish = (values) => {
        setIsLoading(true);
        const payload = {
            username: values.username,
            password: values.password,
        }

        axiosClient.post('/login', payload)
        .then(({ data}) => {
            setUser(data.user);
            setToken(data.token);
            setIsLoading(false);
            messageApi.open({
                type: data.type,
                content: data.message,
            })
        })
        .catch(err => {
            const response = err.response;
            if (response) {
                setIsLoading(false);
                messageApi.open({
                    type: response.data.type,
                    content: response.data.message,
                })
            }
        });
    };
            
    return (
        <div className="login-page">
            {contextHolder}
            <div className="login-container">
                <div className="login-card">
                    {/* <img src="../../../img/logo-bea-cukai.png" alt="Logo" className="logo" /> */}
                    <img src={`${import.meta.env.VITE_BASE_PATH}/img/logo-bea-cukai.png`} alt="Logo" className="logo" />
                    <h2>Antrian Loket Pelayanan</h2>
                    <p>Kantor Pelayanan Utama Bea dan Cukai Tipe B Batam</p>
                    <Form
                        name="login"
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your username!',
                                },
                            ]}
                        >
                            <Input size='large' prefix={<UserOutlined />} placeholder="Username"></Input>
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                        >
                            <Input.Password size='large' prefix={<LockOutlined />} placeholder='Password' />
                        </Form.Item>
                        <Form.Item>
                            <Flex justify="space-between" align="center">
                            <Link to="">Forgot password</Link>
                            </Flex>
                        </Form.Item>
                        <Form.Item>
                            <Button loading={isLoading} size='large' block type="primary" htmlType="submit">
                            Login
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
}
