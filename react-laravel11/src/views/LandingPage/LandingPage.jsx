import React from 'react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button, Flex, Card, FloatButton, Spin, message, Modal } from 'antd';
import { useEffect, useState } from 'react';
import axiosClient from '../../axios-client';
import Pusher from 'pusher-js';
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

  const handleAmbilAntrian = async (id) => {
    setIsLoading(true);
    try {
        const response = await axiosClient.get(`/layanan/guest/ambil/${id}`, {
            responseType: 'blob', // Mengatur respons sebagai Blob untuk PDF

        });
        
        // Membuat URL untuk Blob dan membuka jendela baru untuk menampilkan PDF
        const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        
        // Membuka PDF dalam tab/jendela baru
        window.open(pdfUrl, '_blank');

        setIsLoading(false);
        
    } catch (error) {
        console.error("Error fetching PDF:", error);
        messageApi.open({
            type: 'error',
            content: 'Terjadi kesalahan saat mengambil antrian.',
        })
        setIsLoading(false);
    }

    // axiosClient.get(`/layanan/guest/ambil/${id}`)
  };

  useEffect(() => {
    handleGetDataLayanan();
    const pusher = new Pusher('3noeceoo4vqaomp92yg0', {
      cluster: 'ap1',
      enabledTransports: ['ws'],    // Menggunakan WebSocket sebagai transport
      forceTLS: false,              // Menonaktifkan TLS
      wsHost: '127.0.0.1',          // WebSocket host lokal
      wsPort: 8080
    });

    const channel = pusher.subscribe('layanan-channel');

    channel.bind('layanan-event', function(data) {
      handleGetDataLayanan();
    });
  }, [])

  // useEffect(() => {
  //   handleGetDataLayanan();
  //   const pusher = new Pusher('6d50297c33411d7978b2', {
  //     cluster: 'ap1'
  //   });
  //   // Subscribe to the channel
  //   const channel = pusher.subscribe('layanan-channel');
  //   // Bind the event and alert the data when received
  //   channel.bind('layanan-event', function(data) {
  //     handleGetDataLayanan();
  //   });
  //   // Cleanup function to unsubscribe from channel when component unmounts
  //   return () => {
  //       channel.unbind_all();
  //       channel.unsubscribe();
  //   };
  // }, [])

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
