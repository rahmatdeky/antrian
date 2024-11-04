import React, { useState, useEffect } from 'react';
import { Divider, DatePicker, Row, Col, Select, message, Spin, Button, Table } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import axiosClient from '../../axios-client';
import moment from 'moment'


const { RangePicker } = DatePicker;

const RiwayatAntrian = () => {
  const [dataLayanan, setDataLayanan] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [tanggalRange, setTanggalRange] = useState(null);
  const [idLayanan, setIdLayanan] = useState(null);
  const [dataAntrian, setDataAntrian] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const selectDataLayanan = dataLayanan.map((layanan) => ({
    value: layanan.id,
    label: layanan.nama_layanan
  }));

  const tabelDataAntrian = [
    {
      title: 'Layanan',
      dataIndex: ['layanan', 'nama_layanan'],
      key: 'layanan',
    },
    {
      title: 'Nomor Antrian',
      dataIndex: 'nomor_antrian',
      key: 'nomor_antrian',
    },
    {
      title: 'Tanggal',
      dataIndex: 'tanggal',
      key: 'tanggal',
    },
    {
      title: 'Waktu Panggil',
      dataIndex: 'waktu_panggil',
      key: 'waktu_panggil',
      render: (text) => text ? moment(text).format('DD-MM-YYYY HH:mm') : '-'
    },
    {
      title: 'Waktu Selesai',
      dataIndex: 'waktu_selesai',
      key: 'waktu_selesai',
      render: (text) => text ? moment(text).format('DD-MM-YYYY HH:mm') : '-'
    },
    {
      title: 'NIP',
      dataIndex: 'nip',
      key: 'nip',
    }
  ]

  const getDataLayanan = () => {
    setIsLoading(true);
    axiosClient.get('/layanan')
      .then(({ data }) => {
        setIsLoading(false);
        setDataLayanan(data.data);
      })
      .catch(err => {
        setIsLoading(false);
        const response = err.response;
        if (response) {
          messageApi.open({
            type: response.data.status,
            content: response.data.message,
          });
        }
      });
  };

  const fetchDataAntrian = (pagination) => {
    setIsLoading(true);
    const [start, end] = tanggalRange || [];
    axiosClient.get('/antrian/riwayat', {
      params: {
        start_date: start ? start.format('YYYY-MM-DD') : undefined,
        end_date: end ? end.format('YYYY-MM-DD') : undefined,
        id_layanan: idLayanan,
        page: pagination.current,
        pageSize: pagination.pageSize,
      },
    })
    .then(({ data }) => {
      setIsLoading(false);
      setDataAntrian(data.data);
      setPagination({
        ...pagination,
        total: data.total, // Total data dari server
      });
    })
    .catch(err => {
      setIsLoading(false);
      const response = err.response;
      if (response) {
        messageApi.open({
          type: response.data.status,
          content: response.data.message,
        });
      }
    });
  };

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchDataAntrian({ current: 1, pageSize: pagination.pageSize });
  };

  const handleTableChange = (newPagination) => {
    fetchDataAntrian(newPagination);
  };

  useEffect(() => {
    getDataLayanan();
  }, []);

  return (
    <>
      <Spin spinning={isLoading}>
        {contextHolder}
        <h1>Riwayat Antrian</h1>
        <Divider />
        <Row gutter={16}>
          <Col xs={24} md={4} style={{ marginBottom: 20 }}>
            <RangePicker
              onChange={(dates) => setTanggalRange(dates)}
              placeholder={['Tanggal Mulai', 'Tanggal Selesai']}
            />
          </Col>
          <Col xs={24} md={3} style={{ marginBottom: 20 }}>
            <Select
              style={{ width: '100%' }}
              options={selectDataLayanan}
              placeholder="Pilih Layanan"
              onChange={(value) => setIdLayanan(value)}
              allowClear
            />
          </Col>
          <Col xs={24} md={2} style={{ marginBottom: 20 }}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSearch}
              disabled={!tanggalRange} // Disable jika tanggal belum dipilih
            >
            </Button>
          </Col>
        </Row>
        <Table
          dataSource={dataAntrian}
          columns={tabelDataAntrian}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20', '50', '100', '200'],
          }}
          onChange={handleTableChange}
          scroll={{ x: 'max-content' }}
        />
      </Spin>
    </>
  );
};

export default RiwayatAntrian;
