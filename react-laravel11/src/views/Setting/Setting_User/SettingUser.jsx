import React from 'react'
import { Divider, Flex, Button, Table, Input, Space, Row, Col, Modal, Form, Select, message, Spin } from 'antd';
import { SearchOutlined, SendOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import axiosClient from '../../../axios-client';
import { useNavigate, Link } from 'react-router-dom';

const { Search } = Input;
const { confirm } = Modal;
const SettingUser = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingRefBidang, setIsLoadingRefBidang] = useState(false);
    const [isLoadingAll, setIsLoadingAll] = useState(false);
    const [dataUser, setDataUser] = useState([]);
    const [modalTambahUser, setModalTambahUser] = useState(false);
    const [optionsBidang, setOptionsBidang] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();

    const [form] = Form.useForm();
    const navigate = useNavigate();

    const tabelUser = [
        {
            title: 'No',
            width: '5%',
            render: (_, record, index) => index + 1
        },
        {
            title: 'NIP',
            dataIndex: ['pegawai', 'nip'],
            key: 'pegawai.nip',
        },
        {
            title: 'Nama',
            dataIndex: ['pegawai', 'nama'],
            key: 'pegawai.nama',
        },
        {
            title: 'Aksi',
            key: 'aksi',
            width: '10%',
            render: (_, record) => (
                <Button type="primary" icon={<SearchOutlined />} onClick={() => navigate('/setting/user/detail', { state: { userId: record.id } })} ></Button>
            )
        }
    ];

    const confirmTambahUser = (values) => {
        confirm({
            title: 'Konfirmasi',
            content: 'Apakah anda yakin ingin menambahkan user ini?',
            onOk() {
                handleSubmitTambahUser(values);
            },
            onCancel() {
                closeModalTambahUser();
            },
        })
    }

    const handleGetDataUser = (search = '') => {
        setIsLoading(true);
        axiosClient.get('/user/get', {
            params: { search },
        })
            .then(({ data }) => {
                setIsLoading(false);
                const usersWithKeys = data.data.map((item, index) => ({
                    ...item,
                    key: item.id || index, // Menggunakan id jika tersedia, atau index sebagai alternatif
                }));
                setDataUser(usersWithKeys);
            })
            .catch(() => {
                setIsLoading(false);
            })
    }

    const handleGetDataBidang = () => {
        setIsLoadingRefBidang(true);
        axiosClient.get('/referensi/bidang')
            .then(({ data }) => {
                setIsLoadingRefBidang(false);
                setOptionsBidang(data);
            })
            .catch(() => {
                setIsLoadingRefBidang(false);
            })
    }

    const handleSubmitTambahUser = (values) => {
        setIsLoadingAll(true);
        axiosClient.post('/user/add', values)
            .then(({ data }) => {
                setIsLoadingAll(false);
                messageApi.open({
                    type: data.status,
                    content: data.message,
                })
                handleGetDataUser();
                closeModalTambahUser();
            })
            .catch(err => {
                const response = err.response;
                if (response && response.status === 422) {
                    setIsLoadingAll(false);
                    messageApi.open({
                        type: response.data.status,
                        content: response.data.message,
                    })
                }
            });
    }

    const handleSearchDataUser = (value) => {
        handleGetDataUser(value);
    }

    const showModalTambahUser = () => {
        setModalTambahUser(true);
        handleGetDataBidang();
    }

    const closeModalTambahUser = () => {
        setModalTambahUser(false);
        form.resetFields();
    }

    const selectOptionsBidang = optionsBidang.map((bidang) => ({
        value: bidang.id,
        label: bidang.bidang
    }))

    useEffect(() => {
        handleGetDataUser();
    }, []);

    return (
        <>
            <Spin spinning={isLoadingAll}>
            {contextHolder}
            <h1>Setting User</h1>
            <Divider />
            <Row>
                <Col xs={24} md={12}>
                    <Search className="search-user" size='large' placeholder="Pencarian" onSearch={handleSearchDataUser} />
                </Col>
                <Col xs={24} md={12}>
                    <Button style={{ float: 'right' }} size='large' type="primary" onClick={showModalTambahUser}>Tambah User</Button>
                </Col>
            </Row>
            <Table 
            style={{ marginTop: 20 }} 
            columns={tabelUser} 
            loading={isLoading} 
            dataSource={dataUser}
            scroll={{ x: 'max-content' }}
            />
            <Modal title="Tambah Pengguna"
            open={modalTambahUser}
            onCancel={closeModalTambahUser}
            footer={[
                <Button type="default" key="cancel" onClick={closeModalTambahUser}>
                    Batal
                </Button>,
                <Button type="primary" icon={<SendOutlined />} key="submit" onClick={() => form.submit()}>
                    Simpan
                </Button>,
            ]}>
                <Divider />
                <Form
                form={form}
                labelCol = {{ span: 4}}
                labelWrap
                labelAlign="left"
                colon={false}
                onFinish={confirmTambahUser}
                >
                    <Form.Item label="NIP" required
                        name="nip"
                        rules={[
                            {
                            required: true,
                            message: 'Masukkan NIP',
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="Nama" required
                        name="nama"
                        rules={[
                            {
                            required: true,
                            message: 'Masukkan Nama',
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="Golongan" required
                        name="golongan"
                        rules={[
                            {
                            required: true,
                            message: 'Masukkan Golongan',
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="Jabatan" required
                        name="jabatan"
                        rules={[
                            {
                            required: true,
                            message: 'Masukkan Jabatan',
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="Bidang / Bagian" required
                        name="bidang"
                        rules={[
                            {
                            required: true,
                            message: 'Masukkan Bidang / Bagian',
                            }
                        ]}
                    >
                        <Select options={selectOptionsBidang} loading={isLoadingRefBidang} />
                    </Form.Item>
                    <Form.Item label="Nomor Telepon"
                        name="nomor_telepon"
                    >
                        <Input addonBefore="+62" />
                    </Form.Item>
                    <Form.Item label="Email"
                        name="email"
                        rules={[
                            {
                            type: 'email',
                            message: 'Email yang dimasukkan tidak valid!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Divider />
                    <Form.Item label="Username" required
                        name="username"
                        rules={[
                            {
                            required: true,
                            message: 'Masukkan Username',
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="Password" required
                        name="password"
                        rules={[
                            {
                            required: true,
                            message: 'Masukkan Password',
                            },
                            {
                                min: 8,
                                message: 'Password minimal 8 karakter',
                            },
                            {
                                pattern: /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W])/,
                                message: 'Password harus mengandung huruf besar, huruf kecil, angka, dan simbol',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item style={{ display: 'none' }}>
                        <Button htmlType="submit" />
                    </Form.Item>
                </Form>
            </Modal>
            </Spin>
        </>
    )
}

export default SettingUser;
