import React, { useState, useRef, useEffect } from 'react';
import { Card, Flex, Button, Row, Col } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import './LandingPageAntrian.css';
import Pusher from 'pusher-js';
import axiosClient from '../../../axios-client';


const LandingPageAntrian = () => {
  const [showMore, setShowMore] = useState(false);
  const [dataAntrian, setDataAntrian] = useState([]);
  const MoreCardRef = useRef(null);
  const [voiceQueue, setVoiceQueue] = useState([]);
  const isSpeaking = useRef(false);

  const handleToggleShowMore = () => {
    setShowMore(!showMore);
  };

  useEffect(() => {
    if (showMore && MoreCardRef.current) {
      MoreCardRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showMore]);

  const sortedDataAntrian = [...dataAntrian].sort((a, b) => {
    return new Date(b.waktu_panggil) - new Date(a.waktu_panggil);
  });

  const card1And3 = sortedDataAntrian.slice(0, 1); // Data untuk card 1 & 3
  const card2To6 = sortedDataAntrian.slice(1, 5); // Data untuk card 2, 4, 5, 6
  const remainingCards = sortedDataAntrian.slice(5); // Data untuk additional cards

  const handleGetDataAntrian = async (callback) => {
    try {
      const response = await axiosClient.get('/antrian/guest');
      setDataAntrian(Object.values(response.data.data)); // Ubah objek ke array
      if (callback) callback(); // Panggil callback setelah data diperbarui
    } catch (error) {
      console.error('Error fetching data antrian:', error);
    }
  };

  const playNextInQueue = () => {
    if (isSpeaking.current || voiceQueue.length === 0) return;

    isSpeaking.current = true; // Tandai bahwa saat ini sedang berbicara
    const message = voiceQueue[0]; // Ambil pesan pertama dalam antrian

    if (window.responsiveVoice) {
      window.responsiveVoice.speak(message, 'Indonesian Female', {
        onend: () => {
          isSpeaking.current = false; // Tandai bahwa pesan telah selesai dibacakan
          setVoiceQueue((prevQueue) => prevQueue.slice(1)); // Hapus pesan pertama dari antrian
        },
      });
    } else {
      console.log('responsiveVoice not supported');
      isSpeaking.current = false;
      setVoiceQueue((prevQueue) => prevQueue.slice(1));
    }
  };

  // const testSpeech = (nomorAntrian, loket) => {
  //   if (window.responsiveVoice) {
  //     window.responsiveVoice.speak('Nomor Antrian F 001 ke loket frontdesk', 'Indonesian Female');
  //   } else {
  //     console.log('responsiveVoice not supported');
  //   }
  // }

useEffect(() => {
  handleGetDataAntrian();
  const pusher = new Pusher('3noeceoo4vqaomp92yg0', {
    cluster: 'ap1',
    enabledTransports: ['ws'],    // Menggunakan WebSocket sebagai transport
    forceTLS: false,              // Menonaktifkan TLS
    wsHost: '127.0.0.1',          // WebSocket host lokal
    wsPort: 8080
  });

  const channel = pusher.subscribe('panggil-antrian-channel');

  channel.bind('panggil-antrian-event', function(data) {
    handleGetDataAntrian();
    // alert(JSON.stringify(data));

    // Mengambil nomor antrian dan loket dari data
    const nomorAntrian = data.message.nomor_antrian;
    const loket = data.message.loket;

    // Membuat pesan suara
    const message = `Nomor antrian ${nomorAntrian} ke loket ${loket}`;

    setVoiceQueue((prevQueue) => [...prevQueue, message]);
    // if (window.responsiveVoice) {
    //   window.responsiveVoice.speak(message, 'Indonesian Female');
    // } else {
    //   console.log('responsiveVoice not supported');
    // }

    return () => {
      channel.unbind('panggil-antrian-event');
      pusher.unsubscribe('panggil-antrian-channel');
      pusher.disconnect();
    };
  });
}, [])

useEffect(() => {
  // Play suara dari antrian jika ada pesan baru
  if (voiceQueue.length > 0) {
    playNextInQueue();
  }
}, [voiceQueue]); // Hanya dipanggil jika voiceQueue berubah

  return (
    <>
      <div className="grid-container">
      {/* <Button onClick={testSpeech}>test</Button> */}
        {/* Card 1 & 3 tampil secara statis */}
        {card1And3.map((item, index) => (
        <Card key={index} className="card card1-3" style={{ gridArea: 'one-three'}} bodyStyle={{ padding: 0 }}>
          <Row justify='center'>
            <Col className='col-loket-dipanggil-1' span={24}>
              <Card className='card-loket-dipanggil' bordered={false} bodyStyle={{ padding: 10 }}>
                <h1 className='h1-loket-dipanggil'> { item.loket.nama_loket ? item.loket.nama_loket : 'N/A' } </h1>
              </Card>
            </Col>
          </Row>
          <Row justify='center'>
            <Col className='col-loket-dipanggil' span={24}>
              <Row>
                <Col span={24}>
                  <Card className="card-waktu-dipanggil" bordered={false} bodyStyle={{ padding: 0 }}>
                    <h1 className='h1-waktu-dipanggil'> { item.waktu_panggil ? item.waktu_panggil : 'N/A' } </h1>
                  </Card>
                </Col>
                <Col span={24}>
                  <h1 className='h1-dilayani-oleh'>Dilayani Oleh</h1>
                  <h1 className='h1-petugas-dipanggil'> { item.pegawai ? item.pegawai.nama : 'N/A' } </h1>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row justify='center' align='middle'>
            <Col className="col-loket-dipanggil" span={24}>
              <h1 className="nomor-loket-dipanggil">{ item.nomor_antrian ? item.nomor_antrian : 'N/A' }</h1>
            </Col>
          </Row>
        </Card>
        ))}

        {/* Looping untuk card awal (2, 4, 5, 6) */}
        {card2To6.map((item, index) => (
          <Card key={index} className="card card2-6" style={{ gridArea: `area-${index + 2}`}} bodyStyle={{ padding: 0 }}>
            <Row>
              <Col span={12} className='col-card2-6'>
                <Row >
                  <Col span={24}>
                    <Card className="card-loket-card2-6" bordered={false} bodyStyle={{ padding: '10px' }}>
                      <h1 className="h1-loket-card2-6">{ item.loket.nama_loket ? item.loket.nama_loket : 'N/A' }</h1>
                    </Card>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <h1 className='h1-nomor-card2-6'> {item.nomor_antrian ? item.nomor_antrian : 'N/A' } </h1>
                  </Col>
                </Row>
              </Col>
              <Col span={12} className="col2-card2-6">
                <Row justify="center" align="bottom">
                  <Col lg={18} xl={18} sm={18} md={18} xs={18}>
                    <Card className="card-waktu-card2-6" bordered={false} bodyStyle={{ padding: '10px' }}>
                      <h3 className="h3-waktu-card2-6"> {item.waktu_panggil ? item.waktu_panggil : 'N/A'} </h3>
                    </Card>
                  </Col>
                </Row>
                <Row align="bottom" style={{ marginTop: '10px'}}>
                  <Col span={24}>
                    <h2 className='h2-dilayani-oleh-card2-6'>Dilayani Oleh</h2>
                    <h2 className='h2-petugas-oleh-card2-6'> { item.pegawai ? item.pegawai.nama : 'N/A' } </h2>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        ))}
      </div>

      {/* Tombol Selengkapnya */}
      <div ref={MoreCardRef}>
        <Flex align="center" vertical>
          <Button type="link" className="toggle-button" onClick={handleToggleShowMore}>
            <Flex align="center" vertical justify='center'>
            {showMore ? <p style={{ color: "#FFFFFF", fontSize: "16px", fontWeight: "bold" }}>TUTUP</p> : <p style={{ color: "#FFFFFF", fontSize: "16px", fontWeight: "bold" }}>SELENGKAPNYA</p>}
            {showMore ? <UpOutlined style={{ color: "#FFFFFF", fontSize: "18px" }} /> : <DownOutlined style={{ color: "#FFFFFF", fontSize: "18px" }} />}
            </Flex>
          </Button>
        </Flex>
      </div>

      {/* Card tambahan jika "Selengkapnya" diklik */}
      {showMore && (
        <div className="more-cards">
          {remainingCards.map((item, index) => (
            <Card key={index} className="card" style={{ minHeight: '24vh', border: '1px solid #7DBAF2' }} bodyStyle={{ padding: 0 }}>
              <Row>
                <Col span={12} className='col-card2-6'>
                  <Row >
                    <Col span={24}>
                      <Card className="card-loket-card2-6" bordered={false} bodyStyle={{ padding: '10px' }}>
                        <h1 className="h1-loket-card2-6">{ item.loket.nama_loket ? item.loket.nama_loket : 'N/A' }</h1>
                      </Card>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <h1 className='h1-nomor-card2-6'> {item.nomor_antrian ? item.nomor_antrian : 'N/A' } </h1>
                    </Col>
                  </Row>
                </Col>
                <Col span={12} className="col2-card2-6">
                  <Row justify="center" align="bottom">
                    <Col lg={18} xl={18} sm={18} md={18} xs={18}>
                      <Card className="card-waktu-card2-6" bordered={false} bodyStyle={{ padding: '10px' }}>
                        <h3 className="h3-waktu-card2-6"> {item.waktu_panggil ? item.waktu_panggil : 'N/A'} </h3>
                      </Card>
                    </Col>
                  </Row>
                  <Row align="bottom" style={{ marginTop: '10px'}}>
                    <Col span={24}>
                      <h2 className='h2-dilayani-oleh-card2-6'>Dilayani Oleh</h2>
                      <h2 className='h2-petugas-oleh-card2-6'> { item.pegawai ? item.pegawai.nama : 'N/A' } </h2>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};

export default LandingPageAntrian;
