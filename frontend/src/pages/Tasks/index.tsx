import React, { useState, useEffect, useCallback } from 'react';
import {
  Card, Table, Button, Space, Tag, Modal, Form, Input, Select,
  DatePicker, InputNumber, message, Popconfirm, Tabs, Tooltip, Badge, Row, Col,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined,
  CheckCircleOutlined, ClockCircleOutlined,
  FieldTimeOutlined, ExclamationCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

import { taskApi, type TaskQuery } from '../../api/tasks';
import { projectApi } from '../../api/projects';
import type { Task } from '../../types';
import { formatDate } from '../../utils/date';

const { TextArea } = Input;
const { Option } = Select;

const TASK_TYPES = ['日常事务', '测试准备', '实验执行', '数据分析', '报告整理', '文献学习'];
const PRIORITIES = ['高', '中', '低'];
const STATUSES = ['未开始', '进行中', '完成', '延期'];

const statusColors: Record<string, string> = {
  '未开始': 'default',
  '进行中': 'processing',
  '完成': 'success',
  '延期': 'error',
};

const priorityColors: Record<string, string> = {
  '高': 'red',
  '中': 'orange',
  '低': 'green',
};

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState<TaskQuery>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form] = Form.useForm();
  const [projects, setProjects] = useState<{ id: number; project_no: string }[]>([]);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params: TaskQuery = { skip: (page - 1) * pageSize, limit: pageSize, ...filters };
      if (activeTab === 'today') {
        const res = await taskApi.getToday();
        setTasks(res.data);
        setTotal(res.data.length);
      } else if (activeTab === 'week') {
        const res = await taskApi.getWeek();
        setTasks(res.data.items);
        setTotal(res.data.items.length);
      } else {
        const res = await taskApi.list(params);
        setTasks(res.data.items);
        setTotal(res.data.total);
      }
    } catch { message.error('加载任务失败'); }
    finally { setLoading(false); }
  }, [page, pageSize, filters, activeTab]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  useEffect(() => {
    projectApi.list({ limit: 200 }).then(res => setProjects(res.data.items)).catch(() => {});
  }, []);

  const handleCreate = () => {
    setEditingTask(null);
    form.resetFields();
    form.setFieldsValue({ status: '未开始', priority: '中' });
    setModalOpen(true);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    form.setFieldsValue({
      ...task,
      due_time: task.due_time ? dayjs(task.due_time) : null,
      start_time: task.start_time ? dayjs(task.start_time) : null,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await taskApi.delete(id);
      message.success('已删除');
      fetchTasks();
    } catch { message.error('删除失败'); }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await taskApi.updateStatus(id, status);
      message.success('状态已更新');
      fetchTasks();
    } catch { message.error('更新失败'); }
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const payload = {
      ...values,
      user_id: 1,
      due_time: values.due_time?.toISOString(),
      start_time: values.start_time?.toISOString(),
      estimated_hours: values.estimated_hours || null,
      actual_hours: values.actual_hours || null,
    };

    try {
      if (editingTask) {
        await taskApi.update(editingTask.id, payload);
        message.success('任务已更新');
      } else {
        await taskApi.create(payload);
        message.success('任务已创建');
      }
      setModalOpen(false);
      fetchTasks();
    } catch { message.error('保存失败'); }
  };

  const columns: ColumnsType<Task> = [
    {
      title: '任务名称', dataIndex: 'title', key: 'title',
      render: (text: string, record) => (
        <span>
          {record.status === '进行中' && <Badge status="processing" style={{ marginRight: 8 }} />}
          {text}
        </span>
      ),
    },
    {
      title: '类型', dataIndex: 'task_type', key: 'task_type', width: 110,
      render: (t: string) => <Tag>{t}</Tag>,
    },
    {
      title: '优先级', dataIndex: 'priority', key: 'priority', width: 80,
      render: (p: string) => <Tag color={priorityColors[p]}>{p}</Tag>,
    },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 100,
      render: (s: string, record) => (
        <Select
          value={s}
          size="small"
          style={{ width: 85 }}
          onChange={(val) => handleStatusChange(record.id, val)}
          onClick={(e) => e.stopPropagation()}
        >
          {STATUSES.map(st => <Option key={st} value={st}>{st}</Option>)}
        </Select>
      ),
    },
    {
      title: '截止日期', dataIndex: 'due_time', key: 'due_time', width: 160,
      render: (d: string) => {
        if (!d) return '-';
        const isOverdue = dayjs(d).isBefore(dayjs()) && d;
        return (
          <span style={{ color: isOverdue ? '#ff4d4f' : undefined }}>
            <FieldTimeOutlined style={{ marginRight: 4 }} />
            {formatDate(d)}
          </span>
        );
      },
    },
    {
      title: '预计耗时(h)', dataIndex: 'estimated_hours', key: 'estimated_hours', width: 100,
      render: (v: number) => v != null ? `${v}h` : '-',
    },
    {
      title: '操作', key: 'action', width: 140, fixed: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title="编辑">
            <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Tooltip title="删除">
            <Popconfirm title="确定删除此任务?" onConfirm={() => handleDelete(record.id)}>
              <Button type="link" size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const tabItems = [
    { key: 'all', label: '全部任务' },
    { key: 'today', label: '今日任务' },
    { key: 'week', label: '周计划' },
  ];

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col flex="auto">
            <Space wrap>
              <Select
                placeholder="任务类型"
                style={{ width: 130 }}
                allowClear
                value={filters.task_type}
                onChange={(v) => { setFilters(f => ({ ...f, task_type: v })); setPage(1); }}
              >
                {TASK_TYPES.map(t => <Option key={t} value={t}>{t}</Option>)}
              </Select>
              <Select
                placeholder="优先级"
                style={{ width: 100 }}
                allowClear
                value={filters.priority}
                onChange={(v) => { setFilters(f => ({ ...f, priority: v })); setPage(1); }}
              >
                {PRIORITIES.map(p => <Option key={p} value={p}>{p}</Option>)}
              </Select>
              <Select
                placeholder="状态"
                style={{ width: 110 }}
                allowClear
                value={filters.status}
                onChange={(v) => { setFilters(f => ({ ...f, status: v })); setPage(1); }}
              >
                {STATUSES.map(s => <Option key={s} value={s}>{s}</Option>)}
              </Select>
            </Space>
          </Col>
          <Col>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              新建任务
            </Button>
          </Col>
        </Row>
      </Card>

      <Card>
        <Tabs activeKey={activeTab} onChange={(k) => { setActiveTab(k); setPage(1); }} items={tabItems} />
        <Table
          dataSource={tasks}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={activeTab === 'all' ? {
            current: page, pageSize, total,
            onChange: (p, ps) => { setPage(p); setPageSize(ps); },
            showSizeChanger: true, showTotal: (t) => `共 ${t} 条`,
          } : false}
          scroll={{ x: 900 }}
          size="middle"
        />
      </Card>

      <Modal
        title={editingTask ? '编辑任务' : '新建任务'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        width={640}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="任务名称" rules={[{ required: true, message: '请输入任务名称' }]}>
            <Input maxLength={256} placeholder="输入任务名称" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="task_type" label="任务类型" rules={[{ required: true }]}>
                <Select placeholder="选择类型">
                  {TASK_TYPES.map(t => <Option key={t} value={t}>{t}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="priority" label="优先级" rules={[{ required: true }]}>
                <Select>
                  {PRIORITIES.map(p => <Option key={p} value={p}>{p}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="status" label="状态">
                <Select>
                  {STATUSES.map(s => <Option key={s} value={s}>{s}</Option>)}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="due_time" label="截止时间">
                <DatePicker showTime style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="estimated_hours" label="预计耗时(小时)">
                <InputNumber min={0} step={0.5} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="start_time" label="开始时间">
                <DatePicker showTime style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="project_id" label="关联项目">
                <Select placeholder="可选" allowClear showSearch filterOption={(input, option) =>
                  (option?.label as string ?? '').toLowerCase().includes(input.toLowerCase())
                }>
                  {projects.map(p => (
                    <Option key={p.id} value={p.id} label={p.project_no}>
                      {p.project_no}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="任务描述">
            <TextArea rows={3} placeholder="描述任务内容" />
          </Form.Item>
          <Form.Item name="notes" label="备注">
            <TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TasksPage;
