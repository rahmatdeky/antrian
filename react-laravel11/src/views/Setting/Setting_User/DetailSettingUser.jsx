import React from 'react';
import { Row, Col, Image, Card, Button, Table, Skeleton, Modal, Divider, Form, Select, message, Input } from 'antd';
import { DeleteOutlined, SendOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import axiosClient from '../../../axios-client';
import { useLocation } from 'react-router-dom';
import './SettingUser.css';

const { confirm } = Modal;
const DetailSettingUser = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingRole, setIsLoadingRole] = useState(false);
    const [isLoadingRefRole, setIsLoadingRefRole] = useState(false);
    const [dataRole, setDataRole] = useState([]);
    const [dataUser, setDataUser] = useState({});
    const [refRole, setRefRole] = useState([]);
    const [optionsBidang, setOptionsBidang] = useState([]);
    const [modalTambahRole, setModalTambahRole] = useState(false);
    const [modalEditUser, setModalEditUser] = useState(false);
    const [modalGantiPassword, setModalGantiPassword] = useState(false);
    const [formTambahRole] = Form.useForm();
    const [formEditUser] = Form.useForm();
    const [formGantiPassword] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const location = useLocation();
    const userId = location.state?.userId;

    const tabelAkses = [
        {
            title: 'Role',
            dataIndex: 'role',
        },
        {
            title: 'Aksi',
            width: '30%',
            render: (_, record) => (
                <Button variant="outlined" color="danger" icon={<DeleteOutlined />} onClick={() => confirmDeleteRole(record.id)} ></Button>
            )
        }
    ];

    const handleGetDataDetailUser = () => {
        setIsLoading(true);
        setIsLoadingRole(true);
        axiosClient.get(`/user/detail/${userId}`)
            .then(({ data }) => {
                setIsLoading(false);
                setIsLoadingRole(false);
                setDataUser(data.user);
                setDataRole(data.role);
            })
            .catch(() => {
                setIsLoading(false);
                setIsLoadingRole(false);
            })
    }

    const handleGetRefRole = () => {
        setIsLoadingRefRole(true);
        axiosClient.get('/referensi/role')
            .then(({ data }) => {
                setIsLoadingRefRole(false);
                setRefRole(data);
            })
            .catch(() => {
                setIsLoadingRefRole(false);
            })
    }

    const handleGetDataBidang = () => {
        axiosClient.get('/referensi/bidang')
            .then(({ data }) => {
                setOptionsBidang(data);
            })
            .catch(() => {
            })
    }

    const showModalTambahRole = () => {
        setModalTambahRole(true);
        handleGetRefRole();
    }

    const handleCloseModalTambahRole = () => {
        setModalTambahRole(false);
        formTambahRole.resetFields();
    }

    const showModalEditUser = () => {
        setModalEditUser(true);
        handleGetDataBidang();
    }

    const handleCloseModalEditUser = () => {
        setModalEditUser(false);
        formEditUser.resetFields();
    }

    const showModalGantiPassword = () => {
        setModalGantiPassword(true);
    }

    const handleCloseModalGantiPassword = () => {
        setModalGantiPassword(false);
        formGantiPassword.resetFields();
    }

    const handleSubmitTambahRole = (values) => {
        setIsLoadingRole(true);
        const payload = {
            id_user: userId,
            role: values.role,
            nip: dataUser.pegawai.nip
        }
        axiosClient.post('/user/add/role', payload)
            .then(({data})=> {
                setIsLoadingRole(false);
                messageApi.open({
                    type: data.status,
                    content: data.message,
                })
                handleGetDataDetailUser();
                handleCloseModalTambahRole();
            })
            .catch(err => {
                const response = err.response;
                if (response) {
                    setIsLoadingRole(false);
                    messageApi.open({
                        type: response.data.status,
                        content: response.data.message,
                    })
                }
            })
    }

    const confirmDeleteRole = (id) => {
        confirm({
            title: 'Konfirmasi',
            content: 'Apakah anda yakin ingin menghapus role ini?',
            onOk() {
                handleDeleteRole(id);
            },
            onCancel() {
            },
        })
    }

    const handleDeleteRole = (id) => {
        setIsLoadingRole(true);
        axiosClient.delete(`/user/delete/role/${id}`)
            .then(({ data }) => {
                setIsLoadingRole(false);
                messageApi.open({
                    type: data.status,
                    content: data.message,
                })
                handleGetDataDetailUser();
            })
            .catch(err => {
                const response = err.response;
                if (response) {
                    setIsLoadingRole(false);
                    messageApi.open({
                        type: response.data.status,
                        content: response.data.message,
                    })
                }
            })
    }

    const confirmSubmitEditUser = (values) => {
        confirm({
            title: 'Konfirmasi',
            content: 'Apakah anda yakin ingin mengubah data user ini?',
            onOk() {
                handleSubmitEditUser(values);
            },
            onCancel() {
            }
        })
    }

    const handleSubmitEditUser = (values) => {
        setIsLoading(true);
        const payload = {
            id_user: userId,
            nama: values.nama,
            golongan: values.golongan,
            jabatan: values.jabatan,
            bidang: values.bidang,
            nomor_telepon: values.nomor_telepon,
            email: values.email
        }
        axiosClient.post('/user/edit', payload)
            .then(({ data }) => {
                handleCloseModalEditUser();
                handleGetDataDetailUser();
                setIsLoading(false);
                messageApi.open({
                    type: data.status,
                    content: data.message,
                })
            })
            .catch(err => {
                const response = err.response;
                if (response) {
                    setIsLoading(false);
                    messageApi.open({
                        type: response.data.status,
                        content: response.data.message,
                    })
                }
            })
    }

    const confirmSubmitGantiPassword = (values) => {
        confirm({
            title: 'Konfirmasi',
            content: 'Apakah anda yakin ingin mengubah password user ini?',
            onOk() {
                handleSubmitGantiPassword(values);
            },
            onCancel() {
            }
        })
    }

    const handleSubmitGantiPassword = (values) => {
        setIsLoading(true);
        const payload = {
            id_user: userId,
            password: values.password
        }
        axiosClient.post('/user/ganti/password', payload)
            .then(({ data }) => {
                handleCloseModalGantiPassword();
                handleGetDataDetailUser();
                setIsLoading(false);
                messageApi.open({
                    type: data.status,
                    content: data.message,
                })
            })
            .catch(err => {
                const response = err.response;
                if (response) {
                    setIsLoading(false);
                    messageApi.open({
                        type: response.data.status,
                        content: response.data.message,
                    })
                }
            })
    }

    const selectRole = refRole.map((role) => ({
        value: role.role,
        label: role.role
    }))

    const selectOptionsBidang = optionsBidang.map((bidang) => ({
        value: bidang.id,
        label: bidang.bidang
    }))

    useEffect(() => {
        if (userId) {
            handleGetDataDetailUser();
        }
    }, [userId]);

    return (
        <>
            {contextHolder}
            <Row>
                <Col xs={24} md={8} style={{ display: 'flex', justifyContent: 'center' }}>
                    {isLoading ? (
                        <Skeleton.Image active /> // Active untuk Skeleton
                    ) : (
                        <Image
                            style={{ marginBottom: '20px' }}
                            width="75%"
                            preview={false}
                            src=""
                            fallback="data:image/png;base64,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"
                        />
                    )}
                </Col>
                <Col xs={24} md={16}>
                    <Card>
                        <Skeleton active loading={isLoading}>
                            <Row>
                                <Col xs={9} md={6} className='data-detail-user'> NIP</Col>
                                <Col xs={2} md={1} className='data-detail-user'>:</Col>
                                <Col xs={24} md={17} className='data-detail-user'> {dataUser?.pegawai?.nip} </Col>
                            </Row>
                            <Row>
                                <Col xs={9} md={6} className='data-detail-user'>Nama</Col>
                                <Col xs={2} md={1} className='data-detail-user'>:</Col>
                                <Col xs={24} md={17} className='data-detail-user'> {dataUser.pegawai?.nama} </Col>
                            </Row>
                            <Row>
                                <Col xs={9} md={6} className='data-detail-user'>Golongan</Col>
                                <Col xs={2} md={1} className='data-detail-user'>:</Col>
                                <Col xs={24} md={17} className='data-detail-user'> {dataUser.pegawai?.golongan} </Col>
                            </Row>
                            <Row>
                                <Col xs={9} md={6} className='data-detail-user'>Jabatan</Col>
                                <Col xs={2} md={1} className='data-detail-user'>:</Col>
                                <Col xs={24} md={17} className='data-detail-user'> {dataUser.pegawai?.jabatan} </Col>
                            </Row>
                            <Row>
                                <Col xs={9} md={6} className='data-detail-user'>Bidang / Bagian</Col>
                                <Col xs={2} md={1} className='data-detail-user'>:</Col>
                                <Col xs={24} md={17} className='data-detail-user'> {dataUser.pegawai?.bidang?.bidang} </Col>
                            </Row>
                            <Row>
                                <Col xs={9} md={6} className='data-detail-user'>Nomor Telepon</Col>
                                <Col xs={2} md={1} className='data-detail-user'>:</Col>
                                <Col xs={24} md={17} className='data-detail-user'> {dataUser.pegawai?.no_telp} </Col>
                            </Row>
                            <Row>
                                <Col xs={9} md={6} className='data-detail-user'>Email</Col>
                                <Col xs={2} md={1} className='data-detail-user'>:</Col>
                                <Col xs={24} md={17} className='data-detail-user'> {dataUser.pegawai?.email} </Col>
                            </Row>
                            <Row>
                                <Col xs={9} md={6} className='data-detail-user'>Username</Col>
                                <Col xs={2} md={1} className='data-detail-user'>:</Col>
                                <Col xs={24} md={17} className='data-detail-user'> {dataUser.username} </Col>
                            </Row>
                        </Skeleton>
                    </Card>
                    <Row style={{ margin: "20px 0 " }} gutter={[16, 16]}>
                        <Col xs={24} sm={6} md={6} lg={4}>
                            <Button color="default" variant="outlined" block size="large" onClick={showModalTambahRole}>
                                Tambah Role
                            </Button>
                        </Col>
                        <Col xs={24} sm={6} md={6} lg={4}>
                            <Button color="primary" variant="solid" block size="large" onClick={showModalEditUser}>
                                Edit User
                            </Button>
                        </Col>
                        <Col xs={24} sm={6} md={6} lg={4}>
                            <Button color="danger" variant="solid" block size="large" onClick={showModalGantiPassword}>
                                Ganti Password
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={12}>
                            <Table rowKey="id" loading={isLoadingRole} columns={tabelAkses} dataSource={dataRole} pagination={false} scroll={{ y: 300 }} />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Modal
            title="Tambah Role"
            open={modalTambahRole}
            onCancel={handleCloseModalTambahRole}
            footer={[
                <Button type="default" key="cancel" onClick={handleCloseModalTambahRole}>
                    Batal
                </Button>,
                <Button type="primary" icon={<SendOutlined />} key="submit" onClick={() => formTambahRole.submit()}>
                    Simpan
                </Button>
            ]}>
                <Divider />
                <Form
                    form={formTambahRole}
                    labelCol = {{ span: 4 }}
                    labelWrap
                    labelAlign='left'
                    colon={false}
                    onFinish={handleSubmitTambahRole}
                >
                    <Form.Item
                    label="Role"
                    name="role"
                    rules={[
                        {
                        required: true,
                        message: 'Pilih Role'
                        }
                    ]}
                    >
                        <Select options={selectRole} loading={isLoadingRefRole} />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Edit User"
                open={modalEditUser}
                onCancel={handleCloseModalEditUser}
                footer={[
                    <Button type='default' key='cancel' onClick={handleCloseModalEditUser}>Batal</Button>,
                    <Button type='primary' key='submit' onClick={() => formEditUser.submit()} icon={<SendOutlined />}>Simpan</Button>
                ]}
            >
                <Divider />
                <Form
                    form={formEditUser}
                    labelCol={{ span: 4 }}
                    labelWrap
                    labelAlign='left'
                    colon={false}
                    onFinish={confirmSubmitEditUser}
                    initialValues={{
                        nama: dataUser.pegawai?.nama,
                        golongan: dataUser.pegawai?.golongan,
                        jabatan: dataUser.pegawai?.jabatan,
                        bidang: dataUser.pegawai?.id_bidang,
                        no_telp: dataUser.pegawai?.no_telp,
                        email: dataUser.pegawai?.email
                    }}
                >
                    <Form.Item
                        label="Nama"
                        name="nama"
                        rules={[
                            {
                                required: true,
                                message: 'Masukan Nama'
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Golongan"
                        name="golongan"
                        rules={[
                            {
                                required: true,
                                message: 'Masukan Golongan'
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Jabatan"
                        name="jabatan"
                        rules={[
                            {
                                required: true,
                                message: 'Masukan Jabatan'
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Bidang / Bagian"
                        name="bidang"
                        rules={[
                            {
                                required: true,
                                message: 'Masukan Bidang / Bagian'
                            }
                        ]}
                    >
                        <Select options={selectOptionsBidang} />
                    </Form.Item>
                    <Form.Item
                        label="Nomor Telepon"
                        name="no_telp"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                type: 'email',
                                message: 'Email yang dimasukkan tidak valid!'
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item style={{ display: 'none' }}>
                        <Button htmlType='submit'></Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
            title="Ganti Password"
            open={modalGantiPassword}
            onCancel={handleCloseModalGantiPassword}
            footer={[
                <Button type="default" key="cancel" onClick={handleCloseModalGantiPassword}>
                    Batal
                </Button>,
                <Button type="primary" icon={<SendOutlined />} key="submit" onClick={() => formGantiPassword.submit()}>
                    Simpan
                </Button>
            ]}
            >
                <Divider />
                <Form
                    form={formGantiPassword}
                    labelCol = {{ span: 4 }}
                    labelWrap
                    labelAlign='left'
                    colon={false}
                    onFinish={confirmSubmitGantiPassword}
                >
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Masukan Password'
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
                    <Form.Item
                        label="Konfirmasi Password"
                        name="password_confirmation"
                        rules={[
                            {
                                required: true,
                                message: 'Masukan Konfirmasi Password'
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Password yang anda masukkan tidak cocok!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item style={{ display: 'none' }}>
                        <Button htmlType='submit'></Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default DetailSettingUser;
