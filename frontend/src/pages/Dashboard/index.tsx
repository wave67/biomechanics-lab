import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Tag, List, Typography, Space, Spin } from 'antd';
import { CheckSquareOutlined, ExperimentOutlined, DatabaseOutlined, FolderOutlined, RightCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import apiClient from '../../api/client';

const { Text } = Typography;

const statusColors: Record<string, string> = {
  '未开始': 'default', '进行中': 'processing', '完成': 'success', '延期': 'error',
};
const priorityColors: Record<string, string> = { '高': 'red', '中': 'orange', '低': 'green' };

const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [todayTasks, setTodayTasks] = useState<any[]>([]);
  const [currentProjects, setCurrentProjects] = useState<any[]>([]);
  const [recentData, setRecentData] = useState<any[]>([]);
  const [recentFiles, setRecentFiles] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      apiClient.get('/tasks/today').catch(() => ({ data: [] })),
      apiClient.get('/projects/current').catch(() => ({ data: [] })),
      apiClient.get('/test-data/recent').catch(() => ({ data: [] })),
      apiClient.get('/files/recent').catch(() => ({ data: [] })),
    ])
      .then(([tasks, projects, data, files]) => {
        setTodayTasks(tasks.data);
        setCurrentProjects(projects.data);
        setRecentData(data.data);
        setRecentFiles(files.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '80px auto' }} />;

  return (
    <div>
      <Card title={<><CheckSquareOutlined style={{ marginRight: 8 }} />今日任务</>}
        extra={<a onClick={() => navigate('/tasks')}>查看全部 <RightCircleOutlined /></a>}
        style={{ marginBottom: 16 }}>
        {todayTasks.length === 0 ? <Text type="secondary">今日暂无任务</Text> : (
          <List size="small" dataSource={todayTasks} renderItem={(task: any) => (
            <List.Item><Space>
              <Tag color={priorityColors[task.priority]}>{task.priority}</Tag>
              <Tag color={statusColors[task.status]}>{task.status}</Tag>
              <Text>{task.title}</Text>
            </Space></List.Item>
          )} />
        )}
      </Card>

      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title={<><ExperimentOutlined style={{ marginRight: 8 }} />当前测试项目</>}
            extra={<a onClick={() => navigate('/projects')}>查看全部 <RightCircleOutlined /></a>}
            style={{ marginBottom: 16 }}>
            {currentProjects.length === 0 ? <Text type="secondary">暂无进行中的项目</Text> : (
              <List size="small" dataSource={currentProjects} renderItem={(p: any) => (
                <List.Item><Space direction="vertical" size={0} style={{ width: '100%' }}>
                  <Space><Tag color="blue">{p.project_no}</Tag><Text strong>{p.project_name}</Text></Space>
                  <Space style={{ marginTop: 4 }}><Text type="secondary" style={{ fontSize: 12 }}>{p.brand_name || '-'}</Text><Tag>{p.status}</Tag></Space>
                </Space></List.Item>
              )} />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title={<><DatabaseOutlined style={{ marginRight: 8 }} />近期实验</>}
            extra={<a onClick={() => navigate('/test-data')}>查看全部 <RightCircleOutlined /></a>}
            style={{ marginBottom: 16 }}>
            {recentData.length === 0 ? <Text type="secondary">暂无实验数据</Text> : (
              <List size="small" dataSource={recentData} renderItem={(d: any) => (
                <List.Item><Space direction="vertical" size={0} style={{ width: '100%' }}>
                  <Space><Tag color="purple">{d.test_type}</Tag><Text>{d.data_no}</Text></Space>
                  <Text type="secondary" style={{ fontSize: 12 }}>{d.test_date || '-'}{d.test_action ? ` | ${d.test_action}` : ''}</Text>
                </Space></List.Item>
              )} />
            )}
          </Card>
        </Col>
      </Row>

      <Card title={<><FolderOutlined style={{ marginRight: 8 }} />最近上传文件</>}
        extra={<a onClick={() => navigate('/files')}>查看全部 <RightCircleOutlined /></a>}
        style={{ marginBottom: 16 }}>
        {recentFiles.length === 0 ? <Text type="secondary">暂无文件</Text> : (
          <Table dataSource={recentFiles} columns={[
            { title: '文件名', dataIndex: 'file_name', key: 'file_name', ellipsis: true },
            { title: '类型', dataIndex: 'file_type', key: 'file_type', width: 100, render: (t: string) => <Tag>{t}</Tag> },
            { title: '大小', dataIndex: 'file_size_bytes', key: 'size', width: 90, render: (b: number) => b ? `${(b/1024).toFixed(1)}KB` : '-' },
            { title: '上传时间', dataIndex: 'upload_time', key: 'time', width: 150, render: (t: string) => t ? dayjs(t).format('MM-DD HH:mm') : '-' },
          ]} rowKey="id" size="small" pagination={false} />
        )}
      </Card>
    </div>
  );
};

export default DashboardPage;
