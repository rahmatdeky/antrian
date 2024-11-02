import React from 'react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button, Flex, Card, FloatButton, Spin, message, Modal } from 'antd';
import { useEffect, useState } from 'react';
import axiosClient from '../../axios-client';
import "./LandingPage.css";

const { confirm } = Modal;
const LandingPage = () => {
  const [layanan, setLayanan] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const scrollToAmbilAntrianRef = useRef(null);
  const scrollToInformasiRef = useRef(null);

  const handleScrollToAmbilAntrian = () => {
    scrollToAmbilAntrianRef.current.scrollIntoView({ behavior: 'smooth' });
  }

  const handleScrollToInformasi = () => {
    scrollToInformasiRef.current.scrollIntoView({ behavior: 'smooth' });
  }

  const confirmAmbilAntrian = (id) => {
    confirm({
      title: 'Ambil Antrian',
      content: 'Apakah anda yakin ingin mengambil antrian?',
      onOk() {
        handleAmbilAntrian(id);
      },
      onCancel() {},
    });
  }

  const handleGetDataLayanan = () => {
    setIsLoading(true);
    axiosClient.get('/layanan/guest')
        .then(({ data }) => {
          setIsLoading(false);
          const usersWithKeys = data.data.map((item, index) => ({
            ...item,
            key: item.id || index, // Menggunakan id jika tersedia, atau index sebagai alternatif
          }));
          setLayanan(usersWithKeys);
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

  const handleAmbilAntrian = (id) => {
    setIsLoading(true);
    axiosClient.get(`/layanan/guest/ambil/${id}`)
  }

  useEffect(() => {
    handleGetDataLayanan();
  }, [])

  return (
    <>
      <Spin spinning={isLoading}>
    <div className='landing-page'>
      {contextHolder}
      <Flex className="badge" vertical>
        <Flex className="badge-text" justify="center" vertical>
          <h1>Antrian Loket Pelayanan</h1>
          <h1>Kantor Pelayanan Utama Bea dan Cukai Tipe B Batam</h1>
        </Flex>
        <Flex className="badge-button" align="center" justify="space-around">
          <Button className="button-badge" onClick={handleScrollToAmbilAntrian} >AMBIL ANTRIAN</Button>
          <Button className="button-badge-2" onClick={handleScrollToInformasi}>INFORMASI LOKET PELAYANAN</Button>
            <Link to="/landing/antrian">
              <Button className="button-badge">
                LIHAT ANTRIAN
              </Button>
            </Link>
        </Flex>
      </Flex>
      <Card bordered={false} className='card-antrian'>
        <h1 id='ambil-antrian' ref={scrollToAmbilAntrianRef}>Ambil Antrian</h1>
        <div className="scrollable-container">
        {layanan.map((layanan, id) => (
            <Button type="primary" key={id} className='loket-button' onClick={ () => confirmAmbilAntrian(layanan.id)}>
              {layanan.nama_layanan}
            </Button>
          ))}
        </div>
      </Card>
      <Card bordered={false} className='card-informasi'>
        <div className="scrollable-container" ref={scrollToInformasiRef}>
          {layanan.map((layanan, id) => (
            <Card className="informasi-card" key={id} bordered={false} title={layanan.nama_layanan}>
              <ol>
              {layanan.jenis_layanan.map((jenis, index) => (
                <li key={index}>{jenis.nama_jenis_layanan}</li>
              ))}
              </ol>
            </Card>
          ))}
        </div>
      </Card>
    </div>
      </Spin>
    </>
  );
};

export default LandingPage;
