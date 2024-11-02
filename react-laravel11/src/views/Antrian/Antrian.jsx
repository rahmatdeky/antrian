import React from 'react'
import { Divider, Row, Col, Tag, Table, Space, Button, message, Spin } from 'antd'
import { PhoneOutlined, RedoOutlined, CheckOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import axiosClient from '../../axios-client'
import moment from 'moment'

const Antrian = () => {
  const [selectedLoket, setSelectedLoket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const fakeDataAntrian = [
    { id: 1, nomor: 'A 001', id_status: 1, loket: {} },
    { id: 2, nomor: 'A 002', id_status: 2, loket: { id: 1, nama_loket: 'Loket 1'} },
    { id: 3, nomor: 'A 003', id_status: 3, loket: { id: 2, nama_loket: 'Loket 2'} },
  ];
  
  // Membuat data untuk setiap baris berdasarkan status
  const formattedData = [
    {
      key: 1,
      waiting: fakeDataAntrian
        .filter(item => item.id_status === 1)
        .map(item => (
          <div key={item.id}>
            {item.nomor}
            <Button
              icon={<PhoneOutlined />}
              style={{ marginLeft: '8px' }}
              onClick={() => handlePanggil(item.id)}
            />
          </div>
        )),
      active: fakeDataAntrian
        .filter(item => item.id_status === 2)
        .map(item => (
          <div key={item.id}>
            {item.nomor} - {item.loket?.nama_loket || 'Belum diambil'}
            <Button
              icon={<RedoOutlined />}
              style={{ marginLeft: '8px' }}
              onClick={() => handlePanggilUlang(item.id)}
            />
            <Button
              icon={<CheckOutlined />}
              style={{ marginLeft: '8px' }}
              onClick={() => handleSelesai(item.id)}
            />
          </div>
        )),
      done: fakeDataAntrian
        .filter(item => item.id_status === 3)
        .map(item => item.nomor)
        .join(', ')
    }
  ];
  
  const tabelAntrian = [
    { title: 'Waiting', key: 'waiting', dataIndex: 'waiting', align: 'center' },
    { title: 'Active', key: 'active', dataIndex: 'active', align: 'center' },
    { title: 'Done', key: 'done', dataIndex: 'done', align: 'center' }
  ];
  
  // Fungsi untuk menangani klik tombol
  const handlePanggil = (id) => {
    console.log(`Panggil antrean ${id}`);
  };
  
  const handlePanggilUlang = (id) => {
    console.log(`Panggil ulang antrean ${id}`);
  };
  
  const handleSelesai = (id) => {
    console.log(`Selesai antrean ${id}`);
  };

  const handleGetDataLoket = () => {
    setLoading(true);
    axiosClient.get('antrian/loket/pilih')
        .then(({ data }) => {
          setLoading(false);
          setSelectedLoket(data.data);
        })
        .catch( err => {
          const response = err.response;
          if (response) {
            setLoading(false);
            messageApi.open({
              type: response.data.status,
              content: response.data.message,
            })
          }
        } )
  }

  useEffect(() => {
    handleGetDataLoket();
  }, [])

  return (
    <>
    <Spin spinning={loading}>
      {contextHolder}
      <h1>Antrian</h1>
      <Divider />
      <Row justify="space-between">
        <Col span={12}>
          <Tag style={{ fontSize: '16px', padding: '8px 16px', borderRadius: '10px' }} color="#1677FF" >{selectedLoket?.nama_loket}</Tag>
        </Col>
        <Col span={12}>
          <Tag style={{ float: 'right', fontSize: '16px', padding: '8px 16px', borderRadius: '10px' }} color="#1677FF" >{moment().format('DD-MM-YYYY')}</Tag>
        </Col>
      </Row>
      <Table
      style={{ marginTop: '20px' }}
      scroll={{ x: 'max-content' }}
      columns={tabelAntrian}
      dataSource={formattedData}
      bordered ></Table>
      </Spin>
    </>
  )
}

export default Antrian;
