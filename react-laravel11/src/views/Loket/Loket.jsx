import React from 'react'
import { Divider, Row, Col, Tag, Table, Button, message, Modal } from 'antd'
import { CheckOutlined, LogoutOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import axiosClient from '../../axios-client'
import moment from 'moment'
import Pusher from 'pusher-js'

const { confirm } = Modal
const Loket = () => {
  const [dataLoket, setDataLoket] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()

  const fakeDataLoket = [
    {
      id: 1,
      nama_loket: 'loket 1',
      petugas: 'rahmat Deky Sofyan Hidayat',
      waktuCheckIn: '2024/10/22 08:01:00'
    },
    {
      id: 2,
      nama_loket: 'loket 2',
      petugas: 'rahmat Deky Sofyan Hidayat',
      waktuCheckIn: '2024/10/22 08:01:00'
    },
    {
      id: 3,
      nama_loket: 'loket 3',
      petugas: null,
      waktuCheckIn: null
    }
  ]

  const tabelPilihLoket = [
    {
        title: 'Nama Loket',
        dataIndex: 'nama_loket',
        key: 'loket',
    },
    {
        title: 'Petugas',
        dataIndex: ['loket_petugas', '0', 'nama'],
        key: 'petugas',
        render: (text) => text || '-'
    },
    {
        title: 'Waktu Check In',
        dataIndex: ['loket_petugas', '0', 'waktu_checkin'],
        key: 'waktuCheckIn',
        render: (text) => text ? moment(text).format('DD-MM-YYYY HH:mm') : '-'
    },
    {
        title: 'Aksi',
        key: 'aksi',
        render: (_, record) => (
            record.selected_by_user ? (
                <Button
                    type="primary"
                    icon={<LogoutOutlined />}
                    onClick={() => confirmCheckoutLoket(record.loket_petugas[0].id)}
                />
            ) : (
                <Button
                    type="primary"
                    disabled={!!record.loket_petugas}
                    icon={<CheckOutlined />}
                    onClick={() => confirmPilihLoket(record.id)}
                />
            )
        )
    }
  ];



  const confirmPilihLoket = (id) => {
    confirm({
      title: 'Konfirmasi',
      content: 'Apakah anda yakin ingin memilih loket ini?',
      onOk() {
        handlePilihLoket(id);
      },
      onCancel() {
      }
    })
  }

  const confirmCheckoutLoket = (id) => {
    confirm({
      title: 'Konfirmasi',
      content: 'Apakah anda yakin ingin checkout loket ini?',
      onOk() {
        handleCheckoutLoket(id);
      },
      onCancel() {
      }
    })
  }

  const handleGetDataLoket = () => {
    setIsLoading(true);
    axiosClient.get('/loket/pilih')
        .then(({ data }) => {
          setIsLoading(false);
          const usersWithKeys = data.data.map((item, index) => ({
            ...item,
            key: item.id || index, // Menggunakan id jika tersedia, atau index sebagai alternatif
          }));
          setDataLoket(usersWithKeys);
          // console.log(usersWithKeys)
        })
        .catch( err => {
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

  const handlePilihLoket= (id) => {
    setIsLoading(true);
    axiosClient.get(`/loket/pilih/${id}`)
    .then(({ data }) => {
      setIsLoading(false);
      messageApi.open({
        type: data.status,
        content: data.message,
      })
      handleGetDataLoket();
    })
    .catch( err => {
      const response = err.response;
      if (response) {
        handleGetDataLoket();
        setIsLoading(false);
        messageApi.open({
          type: response.data.status,
          content: response.data.message,
        })
      }
    })
  }

  const handleCheckoutLoket= (id) => {
    setIsLoading(true);
    axiosClient.get(`/loket/checkout/${id}`)
    .then(({ data }) => {
      setIsLoading(false);
      messageApi.open({
        type: data.status,
        content: data.message,
      })
      handleGetDataLoket();
    })
    .catch( err => {
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

  // useEffect(() => {
  //   handleGetDataLoket();
  //   // Enable pusher logging - don't include this in production
  //   // Pusher.logToConsole = true;

  //   // Initialize Pusher
  //   const pusher = new Pusher('3noeceoo4vqaomp92yg0', {
  //       cluster: 'ap1',
  //       enabledTransports: ['ws'],    // Menggunakan WebSocket sebagai transport
  //       forceTLS: false,              // Menonaktifkan TLS
  //       wsHost: '127.0.0.1',          // WebSocket host lokal
  //       wsPort: 8080 
  //   });

  //   // Subscribe to the channel
  //   const channel = pusher.subscribe('loket-channel');

  //   // Bind the event and alert the data when received
  //   channel.bind('pilih-loket-event', function(data) {
  //       // alert(JSON.stringify(data));
  //       handleGetDataLoket();
  //   });

  //   // Cleanup function to unsubscribe from channel when component unmounts
  //   return () => {
  //       channel.unbind_all();
  //       channel.unsubscribe();
  //   };
  // }, [])

  useEffect(() => {
    handleGetDataLoket();
    // Initialize Pusher
    const pusher = new Pusher('6d50297c33411d7978b2', {
      cluster: 'ap1'
  });
  // Subscribe to the channel
  const channel = pusher.subscribe('loket-channel');
  // Bind the event and alert the data when received
  channel.bind('pilih-loket-event', function(data) {
      handleGetDataLoket();
  });
  // Cleanup function to unsubscribe from channel when component unmounts
  return () => {
      channel.unbind_all();
      channel.unsubscribe();
  };
  }, [])

  return (
    <>
      {contextHolder}
      <h1>Pilih Loket</h1>
      <Divider />
      <Row>
        <Col span={24}>
          <Tag style={{ float: 'right', fontSize: '16px', padding: '8px 16px', borderRadius: '10px' }} color="#1677FF" >{moment().format('DD-MM-YYYY')}</Tag>
        </Col>
      </Row>
      <Table
      style={{marginTop: 20}}
      scroll={{ x: 'max-content' }}
      columns={tabelPilihLoket}
      dataSource={dataLoket}
      loading={isLoading} />
    </>
  )
}

export default Loket;
