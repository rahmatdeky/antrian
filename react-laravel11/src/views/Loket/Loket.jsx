import React from 'react'
import { Divider, Row, Col, Tag, Table, Button, message, Modal } from 'antd'
import { CheckOutlined, LogoutOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import axiosClient from '../../axios-client'
import moment from 'moment'

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
                    onClick={() => handleCheckoutLoket(record.id)}
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

  useEffect(() => {
    handleGetDataLoket();
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
