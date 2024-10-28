import React from 'react'
import { Divider, Flex, Button, Table, Input, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import axiosClient from '../../../axios-client';
import { useNavigate, Link } from 'react-router-dom';

const { Search } = Input;
const SettingUser = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [dataUser, setDataUser] = useState([]);
    const navigate = useNavigate();

    const tabelUser = [
        {
            title: 'No',
            width: '5%',
            render: (_, record, index) => index + 1
        },
        {
            title: 'NIP',
            dataIndex: 'nip',
            key: 'nip',
        },
        {
            title: 'Nama',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Aksi',
            key: 'aksi',
            width: '10%',
            render: (_, record) => (
                <Button type="primary" icon={<SearchOutlined />} onClick={() => navigate(`/setting/user/${record.id}`)} ></Button>
            )
        }
    ];

    const handleGetDataUser = (search = '') => {
        setIsLoading(true);
        axiosClient.get('/users', {
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

    useEffect(() => {
        handleGetDataUser();
    }, []);

    return (
        <>
            <h1>Setting User</h1>
            <Divider />
            <Flex justify="space-between">
            <Search style={{ width: 300 }} size='large' placeholder="Pencarian" onSearch={handleSearchDataUser} />
            <Button size='large' type="primary">Tambah User</Button>
            </Flex>
            <Table 
            style={{ marginTop: 20 }} 
            columns={tabelUser} 
            loading={isLoading} 
            dataSource={dataUser} />
        </>
    )
}

export default SettingUser;
