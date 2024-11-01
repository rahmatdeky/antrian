import React from 'react'
import { Divider, Row, Col, Tag, Table, Space, Button } from 'antd'
import { PhoneOutlined, RedoOutlined, CheckOutlined } from '@ant-design/icons'
import moment from 'moment'

const Antrian = () => {

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

  return (
    <>
      <h1>Antrian</h1>
      <Divider />
      <Row>
        <Col span={24}>
          <Tag style={{ float: 'right', fontSize: '16px', padding: '8px 16px', borderRadius: '10px' }} color="#1677FF" >{moment().format('DD-MM-YYYY')}</Tag>
        </Col>
      </Row>
      <Table
      style={{ marginTop: '20px' }}
      scroll={{ x: 'max-content' }}
      columns={tabelAntrian}
      dataSource={formattedData}
      bordered ></Table>
    </>
  )
}

export default Antrian;
