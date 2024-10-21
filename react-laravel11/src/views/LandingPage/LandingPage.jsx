import React from 'react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button, Flex, Card, FloatButton } from 'antd';
import "./LandingPage.css";

const LandingPage = () => {
const buttons = ['Tombol 1', 'Tombol 2', 'Tombol 3', 'Tombol 4', 'Tombol 5', 'Tombol 5', 'Tombol 5', 'Tombol 5', 'Tombol 5', 'Tombol 5'];
const cardInformation = [
  {
    'namaLoket' : 'Loket 1',
    'layanan' : [
      'Layanan 1',
      'Layanan 2',
      'Layanan 3',
      'Layanan 4',
      'Layanan 5',
    ]
  },
  {
    'namaLoket' : 'Loket 2',
    'layanan' : [
      'Layanan 1',
      'Layanan 2',
      'Layanan 3',
      'Layanan 4',
      'Layanan 5',
    ]
  },
  {
    'namaLoket' : 'Loket 3',
    'layanan' : [
      'Layanan 1',
      'Layanan 2',
      'Layanan 3',
      'Layanan 4',
      'Layanan 5',
    ]
  },
  {
    'namaLoket' : 'Loket 4',
    'layanan' : [
      'Layanan 1',
      'Layanan 2',
      'Layanan 3',
      'Layanan 4',
      'Layanan 5',
    ]
  },
  {
    'namaLoket' : 'Loket 5',
    'layanan' : [
      'Layanan 1',
      'Layanan 2',
      'Layanan 3',
      'Layanan 4',
      'Layanan 5',
    ]
  },
  {
    'namaLoket' : 'Loket 6',
    'layanan' : [
      'Layanan 1',
      'Layanan 2',
      'Layanan 3',
      'Layanan 4',
      'Layanan 5',
    ]
  }
];
const scrollToAmbilAntrianRef = useRef(null);
const scrollToInformasiRef = useRef(null);

const handleScrollToAmbilAntrian = () => {
  scrollToAmbilAntrianRef.current.scrollIntoView({ behavior: 'smooth' });
}

const handleScrollToInformasi = () => {
  scrollToInformasiRef.current.scrollIntoView({ behavior: 'smooth' });
}

  return (
    <>
    <div className='landing-page'>
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
        {buttons.map((buttonLabel, index) => (
            <Button type="primary" key={index} className='loket-button'>
              {buttonLabel}
            </Button>
          ))}
        </div>
      </Card>
      <Card bordered={false} className='card-informasi'>
        <div className="scrollable-container" ref={scrollToInformasiRef}>
          {cardInformation.map((card, index) => (
            <Card className="informasi-card" key={index} bordered={false} title={card.namaLoket}>
              <ol>
              {card.layanan.map((layanan, index) => (
                <li key={index}>{layanan}</li>
              ))}
              </ol>
              <Button className='button-ambil-antrian-informasi' block>Ambil Nomor Antrian</Button>
            </Card>
          ))}
        </div>
      </Card>
    </div>
    </>
  );
};

export default LandingPage;
