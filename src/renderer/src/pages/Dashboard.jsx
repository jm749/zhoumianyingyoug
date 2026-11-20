import { Card, Row, Col, Statistic, List, Tag, Progress } from 'antd'
import { FolderOpenOutlined, CheckCircleOutlined, ClockCircleOutlined, FileTextOutlined } from '@ant-design/icons'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useEffect, useState } from 'react'

const Dashboard = () => {
  const [projectList, setProjectList] = useState([])
  const [taskList, setTaskList] = useState([])

  const loadData = async () => {
    const res = await window.api.loadData()
    if (res) {
      setProjectList(res.projects || [])
      setTaskList(res.tasks || [])
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const finishTaskCount = taskList.filter(item => item.finish).length
  const chartData = [
    { name: '周一', value: 2 },
    { name: '周二', value: 4 },
    { name: '周三', value: 3 },
    { name: '周四', value: 7 },
    { name: '周五', value: 5 },
  ]

  const containerStyle = {
    padding: '28px',
    background: '#f7f8fa',
    minHeight: '100vh'
  }
  const cardStyle = {
    borderRadius: '12px',
    boxShadow: '0 2px 16px rgba(0, 0, 0, 0.05)',
    border: 'none'
  }

  return (
    <div style={containerStyle}>
      <h2 style={{ color: '#1f2937', marginBottom: 28, fontWeight: 600 }}>工作台首页</h2>
      <Row gutter={[20, 20]}>
        <Col span={6}>
          <Card style={cardStyle}>
            <Statistic
              title={<span style={{ color: '#6b7280' }}>项目总数</span>}
              value={projectList.length}
              prefix={<FolderOpenOutlined style={{ color: '#2563eb' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={cardStyle}>
            <Statistic
              title={<span style={{ color: '#6b7280' }}>全部任务</span>}
              value={taskList.length}
              prefix={<FileTextOutlined style={{ color: '#8b5cf6' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={cardStyle}>
            <Statistic
              title={<span style={{ color: '#6b7280' }}>已完成任务</span>}
              value={finishTaskCount}
              prefix={<CheckCircleOutlined style={{ color: '#10b981' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={cardStyle}>
            <Statistic
              title={<span style={{ color: '#6b7280' }}>待完成</span>}
              value={taskList.length - finishTaskCount}
              prefix={<ClockCircleOutlined style={{ color: '#f59e0b' }} />}
            />
          </Card>
        </Col>

        <Col span={14}>
          <Card style={cardStyle} title="本周任务统计">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={10}>
          <Card style={cardStyle} title="最近任务">
            <List
              dataSource={taskList.slice(-5)}
              renderItem={item => (
                <List.Item style={{ borderColor: '#f0f0f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <span style={{ color: '#374151' }}>{item.name}</span>
                    <Tag color={item.finish ? 'green' : 'gold'}>
                      {item.finish ? '已完成' : '进行中'}
                    </Tag>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col span={24}>
          <Card style={cardStyle} title="整体任务完成进度">
            <Progress
              percent={taskList.length ? Math.round((finishTaskCount / taskList.length) * 100) : 0}
              strokeColor="#2563eb"
              size="large"
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
export default Dashboard
