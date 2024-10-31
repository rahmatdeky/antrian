import React from 'react'
import { Divider, Row, Col, Button, Table, Modal, Form, Input, Select, message, Space } from 'antd'
import { useState, useEffect } from 'react'
import { SendOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import axiosClient from '../../../axios-client'

const { confirm } = Modal
const SettingLoket = () => {
  const [modalAddLoket, setModalAddLoket] = useState(false);
  const [modalEditLoket, setModalEditLoket] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingLayanan, setIsLoadingLayanan] = useState(false);
  const [isLoadingAddLoket, setIsLoadingAddLoket] = useState(false);
  const [isLoadingEditLoket, setIsLoadingEditLoket] = useState(false);
  const [dataLayanan, setDataLayanan] = useState([]);
  const [dataLoket, setDataLoket] = useState([]);
  const [formAddLoket] = Form.useForm();
  const [formEditLoket] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const selectDataLayanan = dataLayanan.map((layanan) => ({
    value: layanan.id,
    label: layanan.nama_layanan
  }))

  const tabelDataLoket = [
    {
      title: 'No',
      width: '5%',
      render: (_, record, index) => index + 1
    },
    {
      title: 'Loket',
      dataIndex: 'nama_loket',
      key: 'loket',
    },
    {
      title: 'Layanan',
      dataIndex: ['layanan', 'nama_layanan'],
      key: 'layanan',
    },
    {
      title: 'Aksi',
      key: 'aksi',
      width: '20%',
      render: (_, record) => (
        <>
          <Space size="large">
            <Button type='primary' icon={<EditOutlined />} onClick={() => showModalEditLoket(record)}></Button>
            <Button color='danger' variant='outlined' icon={<DeleteOutlined />} onClick={() => confirmDeleteLoket(record.id)}></Button>
          </Space>
        </>
      ),
    }
  ]

  const showModalAddLoket = () => {
    setModalAddLoket(true);
    getDataLayanan();
  }

  const showModalEditLoket = (record) => {
    setModalEditLoket(true);
    getDataLayanan();
    formEditLoket.setFieldsValue(record);
  }

  const closeModalAddLoket = () => {
    setModalAddLoket(false);
    formAddLoket.resetFields();
  }

  const closeModalEditLoket = () => {
    setModalEditLoket(false);
    formEditLoket.resetFields();
  }


  const confirmAddLoket = (values) => {
    confirm({
      title: 'Konfirmasi',
      content: 'Apakah anda yakin ingin menambahkan loket ini?',
      onOk() {
        handleAddLoket(values);
      },
      onCancel() {
      }
    })
  }

  const confirmDeleteLoket = (id) => {
    confirm({
      title: 'Konfirmasi',
      content: 'Apakah anda yakin ingin menghapus loket ini?',
      onOk() {
        handleDeleteLoket(id);
      },
      onCancel() {
      }
    })
  }

  const confirmEditLoket = (values) => {
    confirm({
      title: 'Konfirmasi',
      content: 'Apakah anda yakin ingin mengubah loket ini?',
      onOk() {
        handleEditLoket(values);
      },
      onCancel() {
      }
    })
  }

  const handleAddLoket = (values) => {
    setIsLoadingAddLoket(true);
    axiosClient.post('/loket/add', values)
      .then(({ data }) => {
        setIsLoadingAddLoket(false);
        messageApi.open({
          type: data.status,
          content: data.message,
        })
        handleGetDataLoket();
        closeModalAddLoket();
      })
      .catch(err => {
        const response = err.response;
        if (response) {
          setIsLoadingAddLoket(false);
          messageApi.open({
            type: response.data.status,
            content: response.data.message,
          })
        }
      })
  }

  const getDataLayanan = () => {
    setIsLoadingLayanan(true);
    axiosClient.get('/layanan')
      .then(({ data }) => {
        setIsLoadingLayanan(false);
        const usersWithKeys = data.data.map((item, index) => ({
          ...item,
          key: item.id || index, // Menggunakan id jika tersedia, atau index sebagai alternatif
        }));
        setDataLayanan(usersWithKeys);
      })
      .catch( err => {
        const response = err.response;
        if (response) {
          setIsLoadingLayanan(false);
          messageApi.open({
            type: response.data.status,
            content: response.data.message,
          })
        }
      })
  }

  const handleGetDataLoket = () => {
    setIsLoading(true);
    axiosClient.get('/loket')
        .then(({ data }) => {
          setIsLoading(false);
          const usersWithKeys = data.data.map((item, index) => ({
            ...item,
            key: item.id || index, // Menggunakan id jika tersedia, atau index sebagai alternatif
          }));
          setDataLoket(usersWithKeys);
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

  const handleDeleteLoket = (id) => {
    setIsLoading(true);
    axiosClient.delete(`/loket/delete/${id}`)
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
          setIsLoading(false);
          messageApi.open({
            type: response.data.status,
            content: response.data.message,
          })
        }
      })
  }

  const handleEditLoket = (values) => {
    setIsLoadingEditLoket(true);
    const payload = {
      id: formEditLoket.getFieldValue('id'),
      nama_loket: values.nama_loket,
      id_layanan: values.id_layanan
    }
    axiosClient.put('/loket/edit', payload)
        .then(({ data }) => {
          setIsLoadingEditLoket(false);
          messageApi.open({
            type: data.status,
            content: data.message,
          })
          handleGetDataLoket();
          closeModalEditLoket();
        })
        .catch(err => {
          const response = err.response;
          if (response) {
            setIsLoadingEditLoket(false);
            messageApi.open({
              type: response.data.status,
              content: response.data.message,
            })
        }})
  }

  useEffect(() => {
    handleGetDataLoket();
  }, [])

  return (
    <>
      {contextHolder}
      <h1>Setting Loket</h1>
      <Divider />
      <Row>
        <Col span={24}>
          <Button onClick={showModalAddLoket} size='large' style={{float: 'right'}} type="primary">Tambah Loket</Button>
        </Col>
      </Row>
      <Table
        style={{marginTop: 20}}
        scroll={{ x: 'max-content' }}
        loading={isLoading}
        columns={tabelDataLoket}
        dataSource={dataLoket}
      />
      <Modal
        title="Tambah Loket"
        open={modalAddLoket}
        onCancel={closeModalAddLoket}
        footer={[
          <Button type="default" key="cancel" onClick={closeModalAddLoket}>Batal</Button>,
          <Button type="primary" key="submit" icon={  <SendOutlined />} onClick={() => formAddLoket.submit()} loading={isLoadingAddLoket}>Simpan</Button>
        ]}
      >
        <Divider />
        <Form
          form={formAddLoket}
          layout='vertical'
          colon={false}
          onFinish={confirmAddLoket}
        >
          <Form.Item
            label="Nama Loket"
            name="nama_loket"
            rules={[
              {
                required: true,
                message: 'Masukkan Nama Loket!'
              }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Layanan"
            name="id_layanan"
            rules={[
              {
                required: true,
                message: 'Pilih Layanan!'
              }
            ]}
          >
            <Select options={selectDataLayanan} loading={isLoadingLayanan} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Edit Loket"
        open={modalEditLoket}
        onCancel={closeModalEditLoket}
        footer={[
          <Button type="default" key="cancel" onClick={closeModalEditLoket}>Batal</Button>,
          <Button type="primary" key="submit" icon={  <SendOutlined />} onClick={() => formEditLoket.submit()} loading={isLoadingEditLoket}>Simpan</Button>
        ]}
      >
        <Divider />
        <Form
          form={formEditLoket}
          layout='vertical'
          colon={false}
          onFinish={confirmEditLoket}
        >
          <Form.Item
            label="Nama Loket"
            name="nama_loket"
            rules={[
              {
                required: true,
                message: 'Masukkan Nama Loket!'
              }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Layanan"
            name="id_layanan"
            rules={[
              {
                required: true,
                message: 'Pilih Layanan!'
              }
            ]}
          >
            <Select options={selectDataLayanan} loading={isLoadingLayanan} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default SettingLoket
