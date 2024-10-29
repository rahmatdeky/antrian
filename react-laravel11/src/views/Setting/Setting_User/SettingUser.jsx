import React from 'react'
import { Divider, Flex, Button, Table, Input, Space, Row, Col, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import axiosClient from '../../../axios-client';
import { useNavigate, Link } from 'react-router-dom';

const { Search } = Input;
const SettingUser = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [dataUser, setDataUser] = useState([]);
    const [modalTambahUser, setModalTambahUser] = useState(false);
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

    const handleSearchDataUser = (value) => {
        handleGetDataUser(value);
    }

    const showModalTambahUser = () => {
        setModalTambahUser(true);
    }

    useEffect(() => {
        handleGetDataUser();
    }, []);

    return (
        <>
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
            dataSource={dataUser} />
            <Modal title="Tambah Pengguna" open={modalTambahUser} onCancel={() => setModalTambahUser(false)}>
                <Divider />
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Modal>
        </>
    )
}

export default SettingUser;
