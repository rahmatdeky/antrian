import React, { useState, useRef, useEffect } from 'react';
import { Card, Flex, Button } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import './LandingPageAntrian.css';


const LandingPageAntrian = () => {
  const [showMore, setShowMore] = useState(false);
  const MoreCardRef = useRef(null);

  const handleToggleShowMore = () => {
    setShowMore(!showMore);
  };

  useEffect(() => {
    if (showMore && MoreCardRef.current) {
      MoreCardRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showMore]);

  const dataAntrian = [
    { id: 1, loket: 'Loket 1', nomor: 'A 001', waktuPanggil: '2024/10/22 08:01:00' },
    { id: 2, loket: 'Loket 2', nomor: 'A 002', waktuPanggil: '2024/10/22 08:02:00' },
    { id: 3, loket: 'Loket 3', nomor: 'A 003', waktuPanggil: '2024/10/22 08:03:00' },
    { id: 4, loket: 'Loket 4', nomor: 'A 004', waktuPanggil: '2024/10/22 08:04:00' },
    { id: 5, loket: 'Frontdesk', nomor: 'F 010', waktuPanggil: '2024/10/22 08:05:00' },
    { id: 6, loket: 'Perbendaharaan', nomor: 'B 001', waktuPanggil: '2024/10/22 08:06:00' },
    { id: 7, loket: 'Pengambilan Dokumen', nomor: 'P 001', waktuPanggil: '2024/10/22 08:07:00' },
    { id: 8, loket: 'Client Coordinator', nomor: 'C 001', waktuPanggil: '2024/10/22 08:08:00' },
    { id: 9, loket: 'Manifest', nomor: 'M 001', waktuPanggil: '2024/10/22 08:09:00' },
    { id: 10, loket: 'Ekspor', nomor: 'E 001', waktuPanggil: '2024/10/22 08:09:10' },
  ];

  const sortedDataAntrian = [...dataAntrian].sort((a, b) => {
    return new Date(b.waktuPanggil) - new Date(a.waktuPanggil);
  });

  const card1And3 = sortedDataAntrian.slice(0, 1); // Data untuk card 1 & 3
  const card2To6 = sortedDataAntrian.slice(1, 5); // Data untuk card 2, 4, 5, 6
  const remainingCards = sortedDataAntrian.slice(5); // Data untuk additional cards

  return (
    <>
      <div className="grid-container">
        {/* Card 1 & 3 tampil secara statis */}
        <Card className="card" style={{ gridArea: 'one-three', border: '10px solid #E1C916'}} bodyStyle={{ padding: 0 }}>

        </Card>

        {/* Looping untuk card awal (2, 4, 5, 6) */}
        {card2To6.map((card, index) => (
          <Card title={`Card ${index + 2}`} key={card.id} className="card" style={{ gridArea: `area-${index + 2}`, minHeight: '24vh' }}>
            <h3>{card.loket}</h3>
            <p>Nomor Antrian: {card.nomor}</p>
            <p>Waktu Panggil: {card.waktuPanggil}</p>
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
          {remainingCards.map(card => (
            <Card title={`Card ${card.id}`} key={card.id} className="card" style={{ minHeight: '24vh' }}>
              <h3>{card.loket}</h3>
              <p>Nomor Antrian: {card.nomor}</p>
              <p>Waktu Panggil: {card.waktuPanggil}</p>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};

export default LandingPageAntrian;
