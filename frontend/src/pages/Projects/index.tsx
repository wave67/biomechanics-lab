import React, { useState, useEffect, useCallback } from 'react';
import {
  Card, Table, Button, Space, Tag, Modal, Form, Input, Select,
  InputNumber, message, Popconfirm, Tooltip, Row, Col, Typography,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

import { projectApi } from '../../api/projects';
import type { Project } from '../../types';
import { formatDate } from '../../utils/date';

const { TextArea } = Input;
const { Option } = Select;

const SHOE_TYPES = ['高跟鞋', '超高跟鞋', '粗跟鞋', '细跟鞋', '坡跟鞋', '平底鞋', '其他'];
const HEEL_TYPES = ['细跟', '粗跟', '方跟', '坡跟'];
const STATUSES = ['待准备', '样品确认', '测试进行', '数据处理中', '报告整理', '完成', '归档'];
const EQUIPMENT_OPTIONS = ['足底压力系统', '三维力台', '动态捕捉系统'];
const EVENT_OPTIONS = ['静态站立', '平地行走', '跑步', '上下楼梯', '转身', '特定动作'];
const ENV_OPTIONS = ['实验室', '跑台', '地面条件'];

const statusColors: Record<string, string> = {
  '待准备': 'default', '样品确认': 'blue', '测试进行': 'processing',
  '数据处理中': 'orange', '报告整理': 'purple', '完成': 'success', '归档': 'default',
};

const ProjectsListPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form] = Form.useForm();

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { skip: (page - 1) * pageSize, limit: pageSize, ...filters };
      const res = await projectApi.list(params as any);
      setProjects(res.data.items);
      setTotal(res.data.total);
    } catch { message.error('加载项目列表失败'); }
    finally { setLoading(false); }
  }, [page, pageSize, filters]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const handleCreate = () => {
    setEditingProject(null);
    form.resetFields();
    form.setFieldsValue({ status: '待准备' });
    setModalOpen(true);
  };

  const handleEdit = (p: Project) => {
    setEditingProject(p);
    form.setFieldsValue({
      ...p,
      test_equipment: p.test_equipment || [],
      test_events: p.test_events || [],
      test_environment: p.test_environment || {},
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try { await projectApi.delete(id); message.success('已删除'); fetchProjects(); }
    catch { message.error('删除失败'); }
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    try {
      if (editingProject) {
        await projectApi.update(editingProject.id, values);
        message.success('项目已更新');
      } else {
        await projectApi.create(values);
        message.success('项目已创建');
      }
      setModalOpen(false);
      fetchProjects();
    } catch { message.error('保存失败'); }
  };

  const columns = [
    {
      title: '项目编号', dataIndex: 'project_no', key: 'project_no', width: 130,
      render: (t: string) => <Tag color="blue">{t}</Tag>,
    },
    { title: '项目名称', dataIndex: 'project_name', key: 'project_name', ellipsis: true },
    { title: '品牌', dataIndex: 'brand_name', key: 'brand_name', width: 120 },
    { title: '鞋款', dataIndex: 'shoe_name', key: 'shoe_name', width: 150, ellipsis: true },
    {
      title: '鞋类型', dataIndex: 'shoe_type', key: 'shoe_type', width: 100,
      render: (t: string) => t ? <Tag>{t}</Tag> : '-',
    },
    {
      title: '跟高(mm)', dataIndex: 'heel_height_mm', key: 'heel_height_mm', width: 90,
      render: (v: number) => v != null ? `${v}mm` : '-',
    },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 110,
      render: (s: string) => <Tag color={statusColors[s]}>{s}</Tag>,
    },
    { title: '负责人', dataIndex: 'responsible_person', key: 'responsible_person', width: 90 },
    {
      title: '创建时间', dataIndex: 'created_at', key: 'created_at', width: 160,
      render: (d: string) => formatDate(d),
    },
    {
      title: '操作', key: 'action', width: 130, fixed: 'right',
      render: (_: unknown, record: Project) => (
        <Space>
          <Tooltip title="详情">
            <Button type="link" size="small" icon={<EyeOutlined />}
              onClick={() => window.open(`/projects?id=${record.id}`, '_self')} />
          </Tooltip>
          <Tooltip title="编辑">
            <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Popconfirm title="确定删除?" onConfirm={() => handleDelete(record.id)}>
            <Tooltip title="删除">
              <Button type="link" size="small" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col flex="auto">
            <Space wrap>
              <Select placeholder="状态" style={{ width: 120 }} allowClear
                value={filters.status} onChange={(v) => { setFilters(f => ({ ...f, status: v })); setPage(1); }}>
                {STATUSES.map(s => <Option key={s} value={s}>{s}</Option>)}
              </Select>
              <Select placeholder="品牌" style={{ width: 130 }} allowClear
                value={filters.brand_name} onChange={(v) => { setFilters(f => ({ ...f, brand_name: v })); setPage(1); }}>
                {/* Brand options could be dynamically loaded */}
              </Select>
              <Select placeholder="负责人" style={{ width: 110 }} allowClear
                value={filters.responsible_person}
                onChange={(v) => { setFilters(f => ({ ...f, responsible_person: v })); setPage(1); }}>
              </Select>
            </Space>
          </Col>
          <Col>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>新建项目</Button>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table dataSource={projects} columns={columns} rowKey="id" loading={loading}
          pagination={{ current: page, pageSize, total, onChange: (p, ps) => { setPage(p); setPageSize(ps); },
            showSizeChanger: true, showTotal: (t) => `共 ${t} 条` }}
          scroll={{ x: 1200 }} size="middle"
        />
      </Card>

      <Modal title={editingProject ? '编辑项目' : '新建项目'} open={modalOpen}
        onOk={handleSubmit} onCancel={() => setModalOpen(false)} width={720} confirmLoading={loading}>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="project_no" label="项目编号" rules={[{ required: true, message: '请输入编号' }]}>
                <Input placeholder="如 HP-2026-001" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="project_name" label="项目名称" rules={[{ required: true, message: '请输入名称' }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="brand_name" label="品牌"><Input /></Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="shoe_name" label="鞋款名称"><Input /></Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="status" label="项目状态"><Select>{STATUSES.map(s => <Option key={s} value={s}>{s}</Option>)}</Select></Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="shoe_type" label="鞋类型">
                <Select allowClear>{SHOE_TYPES.map(t => <Option key={t} value={t}>{t}</Option>)}</Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="heel_type" label="鞋跟类型">
                <Select allowClear>{HEEL_TYPES.map(t => <Option key={t} value={t}>{t}</Option>)}</Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="heel_height_mm" label="跟高(mm)"><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="shoe_size" label="鞋号"><InputNumber min={30} max={45} style={{ width: '100%' }} /></Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="responsible_person" label="测试负责人"><Input /></Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="test_equipment" label="测试设备">
                <Select mode="multiple" placeholder="选择设备">{EQUIPMENT_OPTIONS.map(e => <Option key={e} value={e}>{e}</Option>)}</Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="test_events" label="测试事件">
                <Select mode="multiple" placeholder="选择事件">{EVENT_OPTIONS.map(e => <Option key={e} value={e}>{e}</Option>)}</Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="test_environment" label="测试环境">
                <Select mode="multiple" placeholder="选择环境">{ENV_OPTIONS.map(e => <Option key={e} value={e}>{e}</Option>)}</Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="test_purpose" label="测试目的"><TextArea rows={2} /></Form.Item>
          <Form.Item name="notes" label="备注"><TextArea rows={2} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectsListPage;
