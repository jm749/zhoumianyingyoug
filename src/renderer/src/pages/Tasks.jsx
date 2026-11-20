import { Card, Button, Modal, Form, Input, Checkbox, Space, message, Typography, Table } from 'antd'
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'

const Tasks = () => {
  const [taskList, setTaskList] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [form] = Form.useForm()
  const [editItem, setEditItem] = useState(null)

  const load = async () => {
    const data = await window.api.loadData()
    if (data) setTaskList(data.tasks || [])
  }
  const save = async (list) => {
    const fullData = {
      projects: (await window.api.loadData())?.projects || [],
      tasks: list
    }
    await window.api.saveData(fullData)
    message.success('任务保存成功')
    load()
  }

  useEffect(() => {
    load()
  }, [])

  const submitForm = async () => {
    const val = await form.validateFields()
    if (editItem) {
      const newList = taskList.map(t => t.id === editItem.id ? { ...editItem, ...val } : t)
      await save(newList)
    } else {
      const newTask = { id: Date.now(), ...val, finish: false }
      const newList = [...taskList, newTask]
      await save(newList)
    }
    setOpenModal(false)
    form.resetFields()
    setEditItem(null)
  }

  const toggleFinish = async (record) => {
    const newList = taskList.map(t => t.id === record.id ? { ...t, finish: !t.finish } : t)
    await save(newList)
  }

  const handleDelete = (record) => {
    Modal.confirm({
      title: '删除任务',
      content: `确定删除任务【${record.name}】？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const newList = taskList.filter(t => t.id !== record.id)
        await save(newList)
      }
    })
  }

  const openAdd = () => {
    setEditItem(null)
    form.resetFields()
    setOpenModal(true)
  }
  const openEdit = (item) => {
    setEditItem(item)
    form.setFieldsValue(item)
    setOpenModal(true)
  }

  const pageStyle = {
    padding: '28px',
    background: '#f7f8fa',
    minHeight: '100vh'
  }
  const cardStyle = {
    borderRadius: '12px',
    boxShadow: '0 2px 16px rgba(0, 0, 0, 0.05)',
    border: 'none'
  }

  const columns = [
    {
      title: '完成状态',
      render: (_, record) => (
        <Checkbox checked={record.finish} onChange={() => toggleFinish(record)}>
          {record.finish ? '已完成' : '待完成'}
        </Checkbox>
      )
    },
    { title: '任务名称', dataIndex: 'name', key: 'name' },
    { title: '任务说明', dataIndex: 'desc', key: 'desc', render: (v) => v || '-' },
    {
      title: '操作',
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>编辑</Button>
          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>删除</Button>
        </Space>
      )
    }
  ]

  return (
    <div style={pageStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <Typography.Title level={3} style={{ color: '#1f2937', margin: 0 }}>任务管理</Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>新建任务</Button>
      </div>

      <Card style={cardStyle}>
        <Table
          columns={columns}
          dataSource={taskList}
          rowKey="id"
          pagination={{ pageSize: 8 }}
        />
      </Card>

      <Modal
        open={openModal}
        title={editItem ? '编辑任务' : '新建任务'}
        onCancel={() => setOpenModal(false)}
        onOk={submitForm}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="任务名称" rules={[{ required: true, message: '任务名称为必填项' }]}>
            <Input placeholder="输入任务名称" />
          </Form.Item>
          <Form.Item name="desc" label="任务描述">
            <Input placeholder="填写任务详情说明" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
export default Tasks
