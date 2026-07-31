import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import {
  HomeOutlined,
  CheckSquareOutlined,
  ExperimentOutlined,
  SkinOutlined,
  TeamOutlined,
  DatabaseOutlined,
  FolderOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const menuItems = [
  { key: '/', icon: <HomeOutlined />, label: '首页工作台' },
  { key: '/tasks', icon: <CheckSquareOutlined />, label: 'Todo任务' },
  { key: '/projects', icon: <ExperimentOutlined />, label: '测试项目' },
  { key: '/samples', icon: <SkinOutlined />, label: '鞋样管理' },
  { key: '/participants', icon: <TeamOutlined />, label: '受试者管理' },
  { key: '/test-data', icon: <DatabaseOutlined />, label: '测试数据库' },
  { key: '/files', icon: <FolderOutlined />, label: '文件中心' },
];

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={200}
        style={{
          background: '#fff',
          borderRight: '1px solid #f0f0f0',
        }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Typography.Title level={5} style={{ margin: 0, color: '#1677ff' }}>
            生物力学测试工作台
          </Typography.Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography.Text type="secondary">
            高跟鞋生物力学测试研发工作台
          </Typography.Text>
        </Header>
        <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
