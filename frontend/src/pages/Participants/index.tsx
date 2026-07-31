import React, { useState, useEffect, useCallback } from 'react';
import {
  Card, Table, Button, Space, Tag, Modal, Form, Input, Select,
  InputNumber, message, Popconfirm, Tooltip, Row, Col, Descriptions, Tabs, Empty,
} from 'antd';
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

import apiClient from '../../api/client';
import type { Participant, Project } from '../../types';
import { formatDate } from '../../utils/date';

const { TextArea } = Input;
const { Option } = Select;

const ParticipantsPage: React.FC = () => {
  const [items, setItems] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<Participant | null>(null);
  const [detailProjects, setDetailProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Participant | null>(null);
  const [form] = Form.useForm();

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const params = { skip: (page - 1) * pageSize, limit: pageSize, ...filters };
      const res = await apiClient.get<{ items: Participant[]; total: number }>('/participants/', { params });
      setItems(res.data.items);
      setTotal(res.data.total);
    } catch { message.error('加载失败'); }
    finally { setLoading(false); }
  }, [page, pageSize, filters]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleCreate = () => { setEditing(null); form.resetFields(); setModalOpen(true); };
  const handleEdit = (item: Participant) => {
    setEditing(item); form.setFieldsValue(item); setModalOpen(true);
  };
  const handleDelete = async (id: number) => {
    try { await apiClient.delete(`/participants/${id}`); message.success('已删除'); fetch(); }
    catch { message.error('删除失败'); }
  };
  const handleSubmit = async () => {
    const values = await form.validateFields();
    try {
      if (editing) { await apiClient.put(`/participants/${editing.id}`, values); message.success('已更新'); }
      else { await apiClient.post('/participants/', values); message.success('已创建'); }
      setModalOpen(false); fetch();
    } catch { message.error('保存失败'); }
  };
  const showDetail = async (item: Participant) => {
    setDetailItem(item); setDetailOpen(true);
    try {
      const res = await apiClient.get<{ items: Project[] }>('/projects/', { params: { limit: 200 } });
      setDetailProjects(res.data.items);
    } catch {}
  };

  const columns = [
    { title: '编号', dataIndex: 'participant_no', key: 'no', width: 130, render: (t: string) => <Tag color="blue">{t}</Tag> },
    { title: '性别', dataIndex: 'gender', key: 'gender', width: 60 },
    { title: '年龄', dataIndex: 'age', key: 'age', width: 60 },
    { title: '身高(cm)', dataIndex: 'height_cm', key: 'height', width: 90 },
    { title: '体重(kg)', dataIndex: 'weight_kg', key: 'weight', width: 90 },
    { title: '鞋码', dataIndex: 'shoe_size', key: 'shoe_size', width: 60 },
    { title: '创建时间', dataIndex: 'created_at', key: 'created_at', width: 160, render: (d: string) => formatDate(d) },
    { title: '操作', key: 'action', width: 130, fixed: 'right' as const,
      render: (_: unknown, record: Participant) => (
        <Space>
          <Tooltip title="详情"><Button type="link" size="small" icon={<EyeOutlined />} onClick={() => showDetail(record)} /></Tooltip>
          <Tooltip title="编辑"><Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} /></Tooltip>
          <Popconfirm title="确定删除?" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Row align="middle">
          <Col flex="auto">
            <Space>
              <Select placeholder="性别" style={{ width: 100 }} allowClear
                value={filters.gender} onChange={(v) => { setFilters(f => ({ ...f, gender: v })); setPage(1); }}>
                <Option value="男">男</Option><Option value="女">女</Option>
              </Select>
            </Space>
          </Col>
          <Col><Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>新增受试者</Button></Col>
        </Row>
      </Card>
      <Card>
        <Table dataSource={items} columns={columns} rowKey="id" loading={loading}
          pagination={{ current: page, pageSize, total, onChange: (p, ps) => { setPage(p); setPageSize(ps); }, showSizeChanger: true, showTotal: (t) => `共 ${t} 条` }}
          scroll={{ x: 900 }} size="middle" />
      </Card>

      <Modal title={editing ? '编辑受试者' : '新增受试者'} open={modalOpen}
        onOk={handleSubmit} onCancel={() => setModalOpen(false)} width={640}>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="participant_no" label="受试者编号" rules={[{ required: true }]}>
                <Input placeholder="如 P-2026-001" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="gender" label="性别"><Select allowClear><Option value="男">男</Option><Option value="女">女</Option></Select></Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="age" label="年龄"><InputNumber min={18} max={80} style={{ width: '100%' }} /></Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="height_cm" label="身高(cm)"><InputNumber min={140} max={200} step={0.1} style={{ width: '100%' }} /></Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="weight_kg" label="体重(kg)"><InputNumber min={35} max={120} step={0.1} style={{ width: '100%' }} /></Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="shoe_size" label="鞋码"><InputNumber min={33} max={46} style={{ width: '100%' }} /></Form.Item>
            </Col>
          </Row>
          <Form.Item name="foot_type_info" label="足型信息"><TextArea rows={2} /></Form.Item>
          <Form.Item name="exercise_habits" label="运动习惯"><TextArea rows={2} /></Form.Item>
          <Form.Item name="notes" label="备注"><TextArea rows={2} /></Form.Item>
        </Form>
      </Modal>

      <Modal title={detailItem ? `受试者 ${detailItem.participant_no}` : ''}
        open={detailOpen} onCancel={() => setDetailOpen(false)} footer={null} width={600}>
        {detailItem && (
          <>
            <Descriptions size="small" column={3} bordered style={{ marginBottom: 16 }}>
              <Descriptions.Item label="性别">{detailItem.gender || '-'}</Descriptions.Item>
              <Descriptions.Item label="年龄">{detailItem.age ?? '-'}</Descriptions.Item>
              <Descriptions.Item label="身高">{detailItem.height_cm ? `${detailItem.height_cm}cm` : '-'}</Descriptions.Item>
              <Descriptions.Item label="体重">{detailItem.weight_kg ? `${detailItem.weight_kg}kg` : '-'}</Descriptions.Item>
              <Descriptions.Item label="鞋码">{detailItem.shoe_size || '-'}</Descriptions.Item>
              <Descriptions.Item label="足型">{detailItem.foot_type_info || '-'}</Descriptions.Item>
            </Descriptions>
            <Descriptions title="参与项目" size="small" column={1}>
              {detailProjects.length === 0 ? <Descriptions.Item><Empty description="暂无参与项目" /></Descriptions.Item> :
                detailProjects.slice(0, 5).map(p => (
                  <Descriptions.Item key={p.id} label={p.project_no}>{p.project_name}</Descriptions.Item>
                ))
              }
            </Descriptions>
          </>
        )}
      </Modal>
    </div>
  );
};

export default ParticipantsPage;
