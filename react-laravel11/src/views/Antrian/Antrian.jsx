import React from 'react'
import { Divider, Row, Col, Tag, Table, Space, Button, message, Spin, Modal } from 'antd'
import { PhoneOutlined, RedoOutlined, CheckOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import axiosClient from '../../axios-client'
import moment from 'moment'
import Pusher from 'pusher-js'

const { confirm } = Modal;
const Antrian = () => {
  const [selectedLoket, setSelectedLoket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [antrian, setAntrian] = useState([]);
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
      waiting: antrian
        .filter(item => item.id_status === 1)
        .map(item => (
          <Row key={item.id} style={{ marginBottom: '8px' }}>
            <Col span={12}>
            {item.nomor_antrian}
            </Col>
            <Col span={12}>
            <Button
              icon={<PhoneOutlined />}
              style={{float: 'right'}}
              onClick={() => confirmPanggil(item.id)}
            />
            </Col>
          </Row>
        )),
      active: antrian
        .filter(item => item.id_status === 2)
        .map(item => (
          <Row key={item.id}>
            <Col span={12}>
            {item.nomor_antrian} - {item.loket?.nama_loket}
            </Col>
            <Col span={12}>
            <div style={{float: 'right'}}>
            <Button
              icon={<RedoOutlined />}
              style={{ marginLeft: '8px' }}
              onClick={() => confirmPanggilUlang(item.id)}
              disabled={item.id_loket !== selectedLoket?.id}
            />
            <Button
              icon={<CheckOutlined />}
              style={{ marginLeft: '8px' }}
              onClick={() => confirmSelesai(item.id)}
              disabled={item.id_loket !== selectedLoket?.id}
            />
            </div>
            </Col>
          </Row>
        )),
      done: antrian
        .filter(item => item.id_status === 3)
        .map(item => (
          <Row key={item.id}>
            <Col span={24}>
            {item.nomor_antrian}
            </Col>
          </Row>
        ))
    }
  ];
  
  const tabelAntrian = [
    { title: 'Waiting', key: 'waiting', dataIndex: 'waiting', align: 'center', width: '33%' },
    { title: 'Active', key: 'active', dataIndex: 'active', align: 'center', width: '33%' },
    { title: 'Done', key: 'done', dataIndex: 'done', align: 'center', width: '33%' }
  ];

  const confirmPanggil = (id) => {
    confirm({
      title: 'Panggil antrean?',
      icon: <PhoneOutlined />,
      content: 'Apakah anda yakin ingin memanggil antrean ini?',
      okText: 'Ya',
      okType: 'primary',
      cancelText: 'Tidak',
      onOk() {
        handlePanggil(id);
      }
    });
  }

  const confirmPanggilUlang = (id) => {
    confirm({
      title: 'Panggil ulang antrean?',
      icon: <RedoOutlined />,
      content: 'Apakah anda yakin ingin memanggil ulang antrean ini?',
      okText: 'Ya',
      okType: 'primary',
      cancelText: 'Tidak',
      onOk() {
        handlePanggilUlang(id);
      }
    })
  }

  const confirmSelesai = (id) => {
    confirm({
      title: 'Selesaikan antrean?',
      icon: <CheckOutlined />,
      content: 'Apakah anda yakin ingin menyelesaikan antrean ini?',
      okText: 'Ya',
      okType: 'primary',
      cancelText: 'Tidak',
      onOk() {
        handleSelesai(id);
      }
    })
  }
  
  const handlePanggil = (id) => {
    setLoading(true);
    axiosClient.get(`antrian/panggil/${id}/${selectedLoket.id}`)
        .then(() => {
          setLoading(false);
          handleGetDataAntrianByLayanan(selectedLoket.id_layanan);
        })
        .catch( err => {
          const response = err.response;
          if (response) {
            setLoading(false);
            messageApi.open({
              type: response.data.status,
              content: response.data.message,
            })
            handleGetDataAntrianByLayanan(selectedLoket.id_layanan);
          }
        } )
  };
  
  const handlePanggilUlang = (id) => {
    setLoading(true);
    axiosClient.get(`antrian/panggil-ulang/${id}/${selectedLoket.id}`)
        .then(({ data }) => {
          setLoading(false);
          messageApi.open({
            type: data.status,
            content: data.message,
          })
        })
        .catch( err => {
          const response = err.response;
          if (response) {
            setLoading(false);
            messageApi.open({
              type: response.data.status,
              content: response.data.message,
            })
            handleGetDataAntrianByLayanan(selectedLoket.id_layanan);
          }
        } )
  };
  
  const handleSelesai = (id) => {
    setLoading(true);
    axiosClient.get(`antrian/selesai/${id}/${selectedLoket.id}`)
        .then(({ data }) => {
          setLoading(false);
          messageApi.open({
            type: data.status,
            content: data.message,
          })
          handleGetDataAntrianByLayanan(selectedLoket.id_layanan);
        })
        .catch( err => {
          const response = err.response;
          if (response) {
            setLoading(false);
            messageApi.open({
              type: response.data.status,
              content: response.data.message,
            })
            handleGetDataAntrianByLayanan(selectedLoket.id_layanan);
          }
        } )
    // console.log(`Selesai antrean ${id}`);
  };

  const handleGetDataLoket = () => {
    setLoading(true);
    axiosClient.get('antrian/loket/pilih')
        .then(({ data }) => {
          setLoading(false);
          setSelectedLoket(data.data);
          handleGetDataAntrianByLayanan(data.data.id_layanan);
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

  const handleGetDataAntrianByLayanan = (id) => {
    setLoading(true);
    axiosClient.get(`antrian/loket/${id}`)
        .then(({ data }) => {
          setLoading(false);
          setAntrian(data.data);
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
    const pusher = new Pusher('3noeceoo4vqaomp92yg0', {
      cluster: 'ap1',
      enabledTransports: ['ws'],    // Menggunakan WebSocket sebagai transport
      forceTLS: false,              // Menonaktifkan TLS
      wsHost: '127.0.0.1',          // WebSocket host lokal
      wsPort: 8080
    });

    const channel = pusher.subscribe('panggil-antrian-channel');

    channel.bind('panggil-antrian-event', function(data) {
      handleGetDataAntrianByLayanan(selectedLoket?.id_layanan);
    });
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
