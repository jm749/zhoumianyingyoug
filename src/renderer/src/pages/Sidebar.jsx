import { Layout, Menu } from 'antd'
import { DashboardOutlined, ProjectOutlined, CheckSquareOutlined } from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'

const { Sider } = Layout

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '工作台首页'
    },
    {
      key: '/projects',
      icon: <ProjectOutlined />,
      label: '项目管理'
    },
    {
      key: '/tasks',
      icon: <CheckSquareOutlined />,
      label: '任务管理'
    }
  ]

  const siderStyle = {
    background: '#ffffff',
    boxShadow: '2px 0 12px rgba(0, 0, 0, 0.06)',
    height: '100vh',
    position: 'sticky',
    top: 0
  }

  return (
    <Sider width={220} style={siderStyle}>
      <div style={{
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        fontWeight: 700,
        color: '#1f2937',
        borderBottom: '1px solid #e5e7eb'
      }}>
        USY Studio
      </div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        style={{ borderRight: 0 }}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  )
}

export default Sidebar
