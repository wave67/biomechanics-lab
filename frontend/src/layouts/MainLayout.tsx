import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import {
  HomeOutlined, CheckSquareOutlined, ExperimentOutlined,
  SkinOutlined, TeamOutlined, FolderOutlined,
  BookOutlined, ToolOutlined, DashboardOutlined,
  FundOutlined, FileTextOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const menuItems = [
  { key: '/', icon: <HomeOutlined />, label: '首页工作台' },
  { key: '/tasks', icon: <CheckSquareOutlined />, label: 'Todo任务' },
  { key: '/projects', icon: <ExperimentOutlined />, label: '测试项目' },
  { key: '/metrics', icon: <DashboardOutlined />, label: '指标库' },
  { key: '/analysis', icon: <FundOutlined />, label: '分析模块' },
  { key: '/protocols', icon: <BookOutlined />, label: '测试方案库' },
  { key: '/samples', icon: <SkinOutlined />, label: '鞋样管理' },
  { key: '/participants', icon: <TeamOutlined />, label: '受试者管理' },
  { key: '/equipment', icon: <ToolOutlined />, label: '设备管理' },
  { key: '/reports', icon: <FileTextOutlined />, label: '报告中心' },
  { key: '/files', icon: <FolderOutlined />, label: '文件中心' },
  { key: '/backup', icon: <SaveOutlined />, label: '数据备份' },
];

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}>
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #f0f0f0', padding: '0 12px' }}>
          <Typography.Title level={5} style={{ margin: 0, color: '#1677ff', fontSize: 13, textAlign: 'center' }}>
            生物力学实验分析平台
          </Typography.Title>
        </div>
        <Menu mode="inline" selectedKeys={['/' + location.pathname.split('/')[1]]}
          items={menuItems} onClick={({ key }) => navigate(key)} style={{ borderRight: 0 }} />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
          <Typography.Text type="secondary">高跟鞋人体生物力学实验管理与分析平台</Typography.Text>
        </Header>
        <Content style={{ padding: 24, margin: 0, minHeight: 280, overflow: 'auto' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;


