import React from 'react';
import { Row, Col, Button, Flex } from 'antd';
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <>
      <Flex gap="middle" align="end" vertical>
        <Flex align="end" style={{ margin: '10px' }}>
          <Button className="button-login" type="primary">Login</Button>
        </Flex>
      </Flex>
      <Flex className="badge" vertical>
        <Flex className="badge-text" justify="center" vertical>
          <h1>Antrian Loket Pelayanan</h1>
          <h1>Kantor Pelayanan Utama Bea dan Cukai Tipe B Batam</h1>
        </Flex>
        <Flex className="badge-button" align="center" justify="space-around">
          <Button className="button-badge">AMBIL ANTRIAN</Button>
          <Button className="button-badge-2">INFORMASI LOKET PELAYANAN</Button>
          <Button className="button-badge">LIHAT ANTRIAN</Button>
        </Flex>
      </Flex>
    </>
  );
};

export default LandingPage;
