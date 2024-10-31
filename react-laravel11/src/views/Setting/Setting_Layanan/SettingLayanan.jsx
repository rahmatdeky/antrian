import React from 'react'
import { Divider, Row, Col, Button, Table, Space, Modal, Form, Input, Flex, Card, Spin, message, List } from 'antd';
import { useState, useEffect } from 'react';
import { EditOutlined, DeleteOutlined, SendOutlined } from '@ant-design/icons';
import axiosClient from '../../../axios-client';

const { confirm } = Modal;
const SettingLayanan = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTambahLayanan, setIsLoadingTambahLayanan] = useState(false);
  const [isLoadingEditLayanan, setIsLoadingEditLayanan] = useState(false);
  const [isLoadingAddJenisLayanan, setIsLoadingAddJenisLayanan] = useState(false);
  const [dataLayanan, setDataLayanan] = useState([]);
  const [dataJenisLayanan, setDataJenisLayanan] = useState({});
  const [modalAddLayanan, setModalAddLayanan] = useState(false);
  const [modalAddJenisLayanan, setModalAddJenisLayanan] = useState(false);
  const [modalEditLayanan, setModalEditLayanan] = useState(false);
  const [formAddLayanan] = Form.useForm();
  const [formAddJenisLayanan] = Form.useForm();
  const [formEditLayanan] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const tabelLayanan = [
    {
      title: 'No',
      width: '5%',
      render: (_, record, index) => index + 1
    },
    {
      title: 'Nama Layanan',
      dataIndex: 'nama_layanan',
      key: 'layanan',
    },
    {
      title: 'Kode Antrian',
      dataIndex: 'kode_antrian',
      key: 'kode_antrian',
    },
    {
      title: 'aksi',
      key: 'aksi',
      width: '20%',
      render: (_, record) => (
        <>
        <Space size="large">
        <Button type='primary' icon={<EditOutlined />} onClick={() => showModalEditLayanan(record)}></Button>
        <Button color='danger' variant='outlined' icon={<DeleteOutlined />} onClick={() => confirmDeleteLayanan(record.id)}></Button>
        </Space>
        </>
      )
    }
  ]

  const showModalAddLayanan = () => {
    setModalAddLayanan(true);
  }

  const closeModalAddLayanan = () => {
    setModalAddLayanan(false);
    formAddLayanan.resetFields();
  }

  const showModalEditLayanan = (values) => {
    formEditLayanan.setFieldsValue({
      nama_layanan: values.nama_layanan,
      kode_antrian: values.kode_antrian,
      id: values.id
    });
    handleGetDataJenisLayanan(values.id);
    setModalEditLayanan(true);
  }

  const closeModalEditLayanan = () => {
    setModalEditLayanan(false);
  }

  const showModalAddJenisLayanan = (id) => {
    setModalAddJenisLayanan(true);
  }

  const closeModalAddJenisLayanan = () => {
    setModalAddJenisLayanan(false);
    formAddJenisLayanan.resetFields();
  }

  const confirmTambahLayanan = (values) => {
    confirm({
      title: 'Konfirmasi',
      content: 'Apakah anda yakin ingin menambahkan layanan ini?',
      onOk() {
        handleAddLayanan(values);
      },
      onCancel() {
      }
    })
  }

  const confirmEditLayanan = (values) => {
    confirm({
      title: 'Konfirmasi',
      content: 'Apakah anda yakin ingin mengubah layanan ini?',
      onOk() {
        handleEditLayanan(values);
      },
      onCancel() {
      }
    })
  }

  const confirmTambahJenisLayanan = (values) => {
    confirm({
      title: 'Konfirmasi',
      content: 'Apakah anda yakin ingin menambahkan jenis layanan ini?',
      onOk() {
        handleAddJenisLayanan(values);
      },
      onCancel() {
      }
    })
  }

  const confirmDeleteLayanan = (id) => {
    confirm({
      title: 'Konfirmasi',
      content: 'Apakah anda yakin ingin menghapus layanan ini dan jenis layanannya?',
      onOk() {
        handleDeleteLayanan(id);
      },
      onCancel() {
      }
    })
  }

  const handleAddLayanan = (values) => {
    setIsLoadingTambahLayanan(true);
    axiosClient.post('/layanan/add', values)
        .then(({ data }) => {
          setIsLoadingTambahLayanan(false);
          messageApi.open({
            type: data.status,
            content: data.message,
          })
          handleGetDataLayanan();
          closeModalAddLayanan();
        })
        .catch(err => {
          const response = err.response;
          if (response) {
            setIsLoadingTambahLayanan(false);
            messageApi.open({
              type: response.data.status,
              content: response.data.message,
            })
          }
        });
  }

  const handleEditLayanan = (values) => {
    setIsLoadingEditLayanan(true);
    axiosClient.put('/layanan/edit', values)
        .then(({ data }) => {
          setIsLoadingEditLayanan(false);
          messageApi.open({
            type: data.status,
            content: data.message,
          })
          handleGetDataLayanan();
          closeModalEditLayanan();
        })
        .catch(err => {
          const response = err.response;
          if (response) {
            setIsLoadingEditLayanan(false);
            messageApi.open({
              type: response.data.status,
              content: response.data.message,
            })
          }
        })
  }

  const handleAddJenisLayanan = (values) => {
    const payload = {
      id_layanan: formEditLayanan.getFieldValue('id'),
      nama_jenis_layanan: values.jenis_pelayanan
    }
    setIsLoadingAddJenisLayanan(true);
    axiosClient.post('/layanan/jenis/add', payload)
        .then(({ data }) => {
          setIsLoadingAddJenisLayanan(false);
          messageApi.open({
            type: data.status,
            content: data.message,
          })
          handleGetDataJenisLayanan(payload.id_layanan);
          closeModalAddJenisLayanan();
        })
        .catch(err => {
          const response = err.response;
          if (response) {
            setIsLoadingAddJenisLayanan(false);
            messageApi.open({
              type: response.data.status,
              content: response.data.message,
            })
          }
        })
  }

  const handleGetDataLayanan = () => {
    setIsLoading(true);
    axiosClient.get('/layanan')
      .then(({ data }) => {
        setIsLoading(false);
        const usersWithKeys = data.data.map((item, index) => ({
          ...item,
          key: item.id || index, // Menggunakan id jika tersedia, atau index sebagai alternatif
        }));
        setDataLayanan(usersWithKeys);
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

  const handleGetDataJenisLayanan = (id) => {
    setIsLoadingAddJenisLayanan(true);
    axiosClient.get(`/layanan/jenis/${id}`)
      .then(({ data }) => {
        setIsLoadingAddJenisLayanan(false);
        const layananData = data.data.map((item, index) => ({
          ...item,
          key: item.id || index,
        }));
        setDataJenisLayanan(prevData => ({
          ...prevData,
          [id]: layananData // Menyimpan data berdasarkan id_layanan
        }));
        setDataJenisLayanan(usersWithKeys);
      })
      .catch( err => {
        const response = err.response;
        if (response) {
          setIsLoadingAddJenisLayanan(false);
          messageApi.open({
            type: response.data.status,
            content: response.data.message,
          })
        }
      })
  }

  const handleDeleteLayanan = (id) => {
    setIsLoading(true);
    axiosClient.delete(`/layanan/delete/${id}`)
      .then(({ data }) => {
        setIsLoading(false);
        messageApi.open({
          type: data.status,
          content: data.message,
        })
        handleGetDataLayanan();
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

  useEffect(() => {
    handleGetDataLayanan();
  }, [])

  return (
    <>
      {contextHolder}
      <h1>Setting Layanan</h1>
      <Divider />
      <Row>
        <Col span={24}>
          <Button type="primary" size="large" style={{ float: 'right' }} onClick={showModalAddLayanan}>Tambah Layanan</Button>
        </Col>
      </Row>
      <Table
      style={{ marginTop: 20 }}
      columns={tabelLayanan}
      dataSource={dataLayanan}
      loading={isLoading}
      scroll={{ x: 'max-content' }} />
      <Modal
        title="Tambah Layanan"
        open={modalAddLayanan}
        onCancel={closeModalAddLayanan}
        footer={[
            <Button type='default' key="cancel" onClick={closeModalAddLayanan}>Batal</Button>,
            <Button type="primary" key="submit" loading={isLoadingTambahLayanan} icon={<SendOutlined />} onClick={() => formAddLayanan.submit()}>Simpan</Button>
        ]}>
        <Divider />
        <Form
          form={formAddLayanan}
          layout='vertical'
          colon={false}
          onFinish={confirmTambahLayanan}>
            <Form.Item
            label="Nama Layanan"
            name="layanan"
            rules={[
              {
                required: true,
                message: 'Layanan harus diisi!'
              }
            ]}>
              <Input />
            </Form.Item>
            <Form.Item
            label="Kode Antrian"
            name="kode_antrian"
            rules={[
              {
                required: true,
                message: 'Kode Antrian harus diisi!'
              },
              {
                max: 1,
                message: 'Kode Antrian tidak boleh lebih dari 1 karakter'
              },
              {
                pattern: /(?=.*[A-Z])/,
                message: 'Kode Antrian harus huruf kapital'
              }
            ]}>
              <Input />
            </Form.Item>
            <Form.Item style={{ display: "none" }}>
              <Button htmlType='submit' />
            </Form.Item>
          </Form>
      </Modal>
      <Modal
      title="Edit Layanan"
      open={modalEditLayanan}
      onCancel={closeModalEditLayanan}
      footer={false}
      >
        <Divider />
        <Form
        form={formEditLayanan}
        layout='vertical'
        colon={false}
        onFinish={confirmEditLayanan}
        >
          <Form.Item
          label="Nama Layanan"
          name="nama_layanan"
          rules={[
            {
              required: true,
              message: 'Layanan harus diisi!'
            }
          ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
          label="Kode Antrian"
          name="kode_antrian"
          rules={[
            {
              required: true,
              message: 'Kode Antrian harus diisi!'
            },
            {
              max: 1,
              message: 'Kode Antrian tidak boleh lebih dari 1 karakter'
            },
            {
              pattern: /(?=.*[A-Z])/,
              message: 'Kode Antrian harus huruf kapital'
            }
          ]}>
            <Input />
          </Form.Item>
          <Form.Item name="id">
            <Flex justify='space-between'>
              <Button variant="solid" color="default" onClick={showModalAddJenisLayanan}>Tambah</Button>
              <Button type="primary" loading={isLoadingEditLayanan} icon={<SendOutlined />} onClick={() => formEditLayanan.submit()}>Simpan</Button>
            </Flex>
          </Form.Item>
          <Form.Item>
            <Card bodyStyle={{ padding: 10  }} loading={isLoadingAddJenisLayanan}>
            <List 
                dataSource={dataJenisLayanan[formEditLayanan.getFieldValue('id')] || []} 
                renderItem={(item, index) => (
                    <List.Item>
                        {index + 1}. {item.nama_jenis_layanan}
                    </List.Item>
                )}
            />
            </Card>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
      title="Tambah Jenis Pelayanan"
      open={modalAddJenisLayanan}
      onCancel={closeModalAddJenisLayanan}
      footer={[
        <Button type='default' key="cancel" onClick={closeModalAddJenisLayanan}>Batal</Button>,
        <Button type="primary" key="submit" onClick={() => formAddJenisLayanan.submit()} icon={<SendOutlined />} loading={isLoadingAddJenisLayanan}>Simpan</Button>
      ]}
      >
        <Form
        form={formAddJenisLayanan}
        layout='vertical'
        colon={false}
        onFinish={confirmTambahJenisLayanan}>
          <Form.Item
          label="Nama Jenis Pelayanan"
          name="jenis_pelayanan"
          rules={[
            {
              required: true,
              message: 'Jenis Pelayanan harus diisi!'
            }
          ]}
          >
            <Input />
          </Form.Item>
          <Form.Item style={{ display: "none" }}>
            <Button htmlType='submit' />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default SettingLayanan;
