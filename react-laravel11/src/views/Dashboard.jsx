import React from 'react'
import { Divider, Row, Col, Card, Flex, Tag, Spin, message } from 'antd'
import { useState, useEffect } from 'react'
import axiosClient from '../axios-client'


const Dashboard = () => {

  const [total, setTotal] = useState(0);
  const [dataToday, setDataToday] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleGetDataTotal = () => {
    setLoading(true);
    axiosClient.get('/dashboard/total')
      .then(({ data }) => {
        setLoading(false);
        setTotal(data.data);
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
      })
  }

  const handleGetDataToday = () => {
    setLoading(true);
    axiosClient.get('/dashboard/today')
      .then(({ data }) => {
        setLoading(false);
        setDataToday(data.data);
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
      })
  }

  useEffect(() => {
    handleGetDataTotal();
    handleGetDataToday();
  }, [])

  const fakeDataToday = [
    {
      id: 1,
      nama_loket: 'loket 1',
      waiting: 10,
      done: 5
    },
    {
      id: 2,
      nama_loket: 'loket 2',
      waiting: 10,
      done: 5
    },
    {
      id: 3,
      nama_loket: 'loket 3',
      waiting: 10,
      done: 5
    },
    {
      id: 4,
      nama_loket: 'loket 4',
      waiting: 10,
      done: 5
    },
    {
      id: 5,
      nama_loket: 'loket 5',
      waiting: 10,
      done: 5
    },
    {
      id: 6,
      nama_loket: 'loket 6',
      waiting: 10,
      done: 5
    },
    {
      id: 7,
      nama_loket: 'loket 7',
      waiting: 10,
      done: 5
    },
    {
      id: 8,
      nama_loket: 'loket 8',
      waiting: 10,
      done: 5
    }
  ]

  return (
    <>
    <Spin spinning={loading}>
      {contextHolder}
      <h1>Dashboard</h1>
      <Divider />
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col xs={24} md={8} style={{ marginTop: 20 }}>
          <Card bodyStyle={{ padding: 20 }}>
            <Flex vertical gap="middle">
            <h1>Jumlah Antrian</h1>
            <h1 style={{ textAlign: 'right', fontSize: '52px' }}> {total} </h1>
            </Flex>
          </Card>
        </Col>
        <Col xs={24} md={8} style={{ marginTop: 20 }}>
          <Card bodyStyle={{ padding: 20 }}>
            <Flex vertical gap="middle">
            <h1>Jumlah Antrian <Tag style={{ fontSize: '12px', padding: '2px 10px', borderRadius: '10px' }} color="#1677FF">Today</Tag> </h1>
            <h1 style={{ textAlign: 'right', fontSize: '52px' }}> {dataToday.totalAntrian} </h1>
            </Flex>
          </Card>
        </Col>
        <Col xs={24} md={8} style={{ marginTop: 20 }}>
          <Card bodyStyle={{ padding: 20 }}>
            <Flex vertical gap="middle">
            <h1>Antrian Selesai <Tag style={{ fontSize: '12px', padding: '2px 10px', borderRadius: '10px' }} color="#1677FF">Today</Tag></h1>
            <h1 style={{ textAlign: 'right', fontSize: '52px' }}> {dataToday.totalDone} </h1>
            </Flex>
          </Card>
        </Col>
      </Row>
      <Row style={{ marginTop: 20 }}>
        <Col>
          <Tag style={{ fontSize: '32px', padding: '12px 24px', borderRadius: '10px', fontWeight: 'bold' }} color="#1677FF">04 - 11 - 2024</Tag>
        </Col>
      </Row>
      <Row style={{ marginTop: 20 }} gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        {dataToday.perLayanan?.map((item) => (
        <Col key={item.id} xs={24} md={6} style={{ marginTop: 20 }}>
          <Card>
            <Flex vertical gap="middle">
              <h1> {item.layanan?.nama_layanan} </h1>
              <h3 style={{ color: "#484848" }}>Waiting: {item.total_status_1}</h3>
              <h3 style={{ color: "#484848" }}>Done: {item.total_status_3}</h3>
            </Flex>
          </Card>
        </Col>
        ))}
      </Row>
    </Spin>
    </>
  )
}

export default Dashboard