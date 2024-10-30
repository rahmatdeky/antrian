import React from 'react';
import { Row, Col, Image, Card, Button, Table, Skeleton } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import axiosClient from '../../../axios-client';
import { useLocation } from 'react-router-dom';
import './SettingUser.css';

const DetailSettingUser = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [dataRole, setDataRole] = useState([]);
    const [dataUser, setDataUser] = useState({});
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
                <Button variant='outlined' color='danger' icon={<DeleteOutlined />} ></Button>
            )
        }
    ];

    const handleGetDataDetailUser = () => {
        setIsLoading(true);
        axiosClient.get(`/user/detail/${userId}`)
            .then(({ data }) => {
                setIsLoading(false);
                setDataUser(data.user);
                setDataRole(data.role);
            })
            .catch(() => {
                setIsLoading(false);
            })
    }

    useEffect(() => {
        if (userId) {
            handleGetDataDetailUser();
        }
    }, [userId]);

    return (
        <>
            <Row>
                <Col xs={24} md={8} style={{ display: 'flex', justifyContent: 'center' }}>
                    {isLoading ? (
                        <Skeleton.Image active /> // Active untuk Skeleton
                    ) : (
                        <Image
                            style={{ marginBottom: '20px' }}
                            width="75%"
                            preview={false}
                            src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
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
                            <Button color="default" variant="outlined" block size="large">
                                Tambah Role
                            </Button>
                        </Col>
                        <Col xs={24} sm={6} md={6} lg={4}>
                            <Button color="primary" variant="solid" block size="large">
                                Edit User
                            </Button>
                        </Col>
                        <Col xs={24} sm={6} md={6} lg={4}>
                            <Button color="danger" variant="solid" block size="large">
                                Ganti Password
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={12}>
                            <Table rowKey="id" loading={isLoading} columns={tabelAkses} dataSource={dataRole} pagination={false} scroll={{ y: 300 }} />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    )
}

export default DetailSettingUser;
