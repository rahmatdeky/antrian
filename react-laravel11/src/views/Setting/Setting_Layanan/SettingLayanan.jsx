import React from 'react'
import { Divider, Row, Col, Button, Table, Space } from 'antd';
import { useState } from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const SettingLayanan = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [dataLayanan, setDataLayanan] = useState([]);

  const fakeDataLayanan = [
    {
      id: 1,
      layanan: 'Layanan 1',
      kode_antrian: 'Layanan 1'
    },
    {
      id: 2,
      layanan: 'Layanan 2',
      kode_antrian: 'Layanan 2'
    },
  ]

  const tabelLayanan = [
    {
      title: 'No',
      width: '5%',
      render: (_, record, index) => index + 1
    },
    {
      title: 'Nama Layanan',
      dataIndex: 'layanan',
      key: 'layanan',
    },
    {
      title: 'Kode Antrian',
      dataIndex: 'kode_antrian',
      key: 'kode_antrian',
    },
    {
      title: 'aksi',
      key: 'aksi',
      width: '20%',
      render: (_, record) => (
        <>
        <Space size="large">
        <Button type='primary' icon={<EditOutlined />}></Button>
        <Button color='danger' variant='outlined' icon={<DeleteOutlined />}></Button>
        </Space>
        </>
      )
    }
  ]

  return (
    <>
      <h1>Setting Layanan</h1>
      <Divider />
      <Row>
        <Col span={24}>
          <Button type="primary" size="large" style={{ float: 'right' }}>Tambah Layanan</Button>
        </Col>
      </Row>
      <Table
      style={{ marginTop: 20 }}
      columns={tabelLayanan}
      dataSource={fakeDataLayanan}
      loading={isLoading}
      scroll={{ x: 'max-content' }} />
    </>
  )
}

export default SettingLayanan;
