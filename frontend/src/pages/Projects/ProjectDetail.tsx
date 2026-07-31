import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card, Descriptions, Tag, Button, Space, Tabs, Table, Spin,
  Select, message, Popconfirm, Typography, Divider,
} from 'antd';
import {
  ArrowLeftOutlined, EditOutlined, DeleteOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

import { projectApi } from '../../api/projects';
import apiClient from '../../api/client';
import type { Project, ShoeSample, Participant, TestData, TestFile } from '../../types';
import { formatDate } from '../../utils/date';

const { Title } = Typography;

const STATUSES = ['待准备', '样品确认', '测试进行', '数据处理中', '报告整理', '完成', '归档'];
const statusColors: Record<string, string> = {
  '待准备': 'default', '样品确认': 'blue', '测试进行': 'processing',
  '数据处理中': 'orange', '报告整理': 'purple', '完成': 'success', '归档': 'default',
};

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [samples, setSamples] = useState<ShoeSample[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [testData, setTestData] = useState<TestData[]>([]);
  const [files, setFiles] = useState<TestFile[]>([]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const pid = parseInt(id);

    Promise.all([
      projectApi.get(pid),
      apiClient.get<{ items: ShoeSample[] }>('/samples/', { params: { limit: 200 } }),
      apiClient.get<{ items: Participant[] }>('/participants/', { params: { limit: 200 } }),
      apiClient.get<{ items: TestData[] }>('/test-data/', { params: { project_id: pid, limit: 200 } }),
      apiClient.get<{ items: TestFile[] }>('/files/', { params: { project_id: pid, limit: 200 } }),
    ])
      .then(([pRes, sRes, partRes, tdRes, fRes]) => {
        setProject(pRes.data);
        setSamples(sRes.data.items);
        setParticipants(partRes.data.items);
        setTestData(tdRes.data.items);
        setFiles(fRes.data.items);
      })
      .catch(() => message.error('加载项目详情失败'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusChange = async (status: string) => {
    if (!project) return;
    try {
      const res = await projectApi.updateStatus(project.id, status);
      setProject(res.data);
      message.success('状态已更新');
    } catch { message.error('更新状态失败'); }
  };

  const handleDelete = async () => {
    if (!project) return;
    try {
      await projectApi.delete(project.id);
      message.success('已删除');
      navigate('/projects');
    } catch { message.error('删除失败'); }
  };

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '80px auto' }} />;
  if (!project) return <Card><Title level={4}>项目未找到</Title></Card>;

  const tabItems = [
    {
      key: 'samples', label: `样品 (${samples.length})`,
      children: (
        <Table dataSource={samples} rowKey="id" size="small"
          columns={[
            { title: '样品编号', dataIndex: 'sample_no', key: 'sample_no' },
            { title: '品牌', dataIndex: 'brand', key: 'brand' },
            { title: '鞋款', dataIndex: 'shoe_name', key: 'shoe_name', ellipsis: true },
            { title: '鞋类型', dataIndex: 'shoe_type', key: 'shoe_type' },
            { title: '鞋号', dataIndex: 'shoe_size', key: 'shoe_size' },
            { title: '跟高(mm)', dataIndex: 'heel_height_mm', key: 'heel_height_mm', render: (v: number) => v ? `${v}mm` : '-' },
            { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <Tag>{s}</Tag> },
          ]}
        />
      ),
    },
    {
      key: 'participants', label: `受试者 (${participants.length})`,
      children: (
        <Table dataSource={participants} rowKey="id" size="small"
          columns={[
            { title: '编号', dataIndex: 'participant_no', key: 'no' },
            { title: '性别', dataIndex: 'gender', key: 'gender', width: 60 },
            { title: '年龄', dataIndex: 'age', key: 'age', width: 60 },
            { title: '身高(cm)', dataIndex: 'height_cm', key: 'height', width: 90 },
            { title: '体重(kg)', dataIndex: 'weight_kg', key: 'weight', width: 90 },
            { title: '鞋码', dataIndex: 'shoe_size', key: 'shoe_size', width: 60 },
          ]}
          pagination={false}
        />
      ),
    },
    {
      key: 'testdata', label: `测试数据 (${testData.length})`,
      children: (
        <Table dataSource={testData} rowKey="id" size="small"
          columns={[
            { title: '数据编号', dataIndex: 'data_no', key: 'data_no' },
            { title: '测试类型', dataIndex: 'test_type', key: 'test_type', render: (t: string) => <Tag color="purple">{t}</Tag> },
            { title: '测试日期', dataIndex: 'test_date', key: 'test_date', render: (d: string) => d || '-' },
            { title: '设备', dataIndex: 'device_name', key: 'device', ellipsis: true },
            { title: '动作', dataIndex: 'test_action', key: 'action' },
          ]}
        />
      ),
    },
    {
      key: 'files', label: `文件 (${files.length})`,
      children: (
        <Table dataSource={files} rowKey="id" size="small"
          columns={[
            { title: '文件名', dataIndex: 'file_name', key: 'file_name', ellipsis: true },
            { title: '类型', dataIndex: 'file_type', key: 'file_type', render: (t: string) => <Tag>{t}</Tag> },
            { title: '大小', dataIndex: 'file_size_bytes', key: 'size', render: (b: number) => b ? `${(b/1024).toFixed(1)}KB` : '-' },
            { title: '上传人员', dataIndex: 'uploader', key: 'uploader' },
            { title: '上传时间', dataIndex: 'upload_time', key: 'time', render: (t: string) => t ? formatDate(t) : '-' },
          ]}
        />
      ),
    },
  ];

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/projects')}>返回</Button>
          <Title level={4} style={{ margin: 0 }}>{project.project_no} - {project.project_name}</Title>
          <Tag color={statusColors[project.status]}>{project.status}</Tag>
        </Space>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <Descriptions column={3} size="small" bordered>
          <Descriptions.Item label="品牌">{project.brand_name || '-'}</Descriptions.Item>
          <Descriptions.Item label="鞋款名称">{project.shoe_name || '-'}</Descriptions.Item>
          <Descriptions.Item label="鞋类型">{project.shoe_type || '-'}</Descriptions.Item>
          <Descriptions.Item label="鞋跟类型">{project.heel_type || '-'}</Descriptions.Item>
          <Descriptions.Item label="跟高">{project.heel_height_mm ? `${project.heel_height_mm}mm` : '-'}</Descriptions.Item>
          <Descriptions.Item label="鞋号">{project.shoe_size || '-'}</Descriptions.Item>
          <Descriptions.Item label="测试负责人">{project.responsible_person || '-'}</Descriptions.Item>
          <Descriptions.Item label="测试目的" span={2}>{project.test_purpose || '-'}</Descriptions.Item>
          <Descriptions.Item label="测试设备">
            {Array.isArray(project.test_equipment) ? project.test_equipment.map((e: string) => <Tag key={e}>{e}</Tag>) : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="测试事件">
            {Array.isArray(project.test_events) ? project.test_events.map((e: string) => <Tag key={e}>{e}</Tag>) : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="测试环境">
            {Array.isArray(project.test_environment) ? project.test_environment.map((e: string) => <Tag key={e}>{e}</Tag>) : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">{formatDate(project.created_at)}</Descriptions.Item>
          <Descriptions.Item label="更新时间">{formatDate(project.updated_at)}</Descriptions.Item>
          <Descriptions.Item label="备注">{project.notes || '-'}</Descriptions.Item>
        </Descriptions>

        <Divider />

        <Space>
          <span>项目状态：</span>
          <Select value={project.status} onChange={handleStatusChange} style={{ width: 130 }}>
            {STATUSES.map(s => <Select.Option key={s} value={s}>{s}</Select.Option>)}
          </Select>
          <Popconfirm title="确定删除此项目?" onConfirm={handleDelete}>
            <Button danger icon={<DeleteOutlined />}>删除项目</Button>
          </Popconfirm>
        </Space>
      </Card>

      <Card>
        <Tabs items={tabItems} />
      </Card>
    </div>
  );
};

export default ProjectDetail;
