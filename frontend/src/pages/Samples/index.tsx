import React, { useState, useEffect, useCallback } from 'react';
import {
  Card, Table, Button, Space, Tag, Modal, Form, Input, Select,
  InputNumber, DatePicker, message, Popconfirm, Tooltip, Row, Col, Descriptions, Tabs, Divider, Empty,
} from 'antd';
import {
  PlusOutlined, EyeOutlined, DeleteOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

import apiClient from '../../api/client';
import type { ShoeSample, SampleTransaction, TestData } from '../../types';
import { formatDate } from '../../utils/date';

const { Option } = Select;
const { TextArea } = Input;

const SHOE_TYPES = ['高跟鞋', '超高跟鞋', '粗跟鞋', '细跟鞋', '坡跟鞋', '平底鞋', '其他'];
const SAMPLE_STATUSES = ['库存', '测试中', '归还', '损耗', '报废'];
const TXN_TYPES = ['入库', '领用', '测试', '归还', '报废'];

const statusColors: Record<string, string> = {
  '库存': 'green', '测试中': 'processing', '归还': 'blue', '损耗': 'orange', '报废': 'default',
};

const SamplesPage: React.FC = () => {
  const [samples, setSamples] = useState<ShoeSample[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailSample, setDetailSample] = useState<ShoeSample | null>(null);
  const [detailTxns, setDetailTxns] = useState<SampleTransaction[]>([]);
  const [detailTestData, setDetailTestData] = useState<TestData[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [editingSample, setEditingSample] = useState<ShoeSample | null>(null);
  const [form] = Form.useForm();
  const [txnForm] = Form.useForm();
  const [txnModalOpen, setTxnModalOpen] = useState(false);

  const fetchSamples = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { skip: (page - 1) * pageSize, limit: pageSize, ...filters };
      const res = await apiClient.get<{ items: ShoeSample[]; total: number }>('/samples/', { params });
      setSamples(res.data.items);
      setTotal(res.data.total);
    } catch { message.error('加载样品列表失败'); }
    finally { setLoading(false); }
  }, [page, pageSize, filters]);

  useEffect(() => { fetchSamples(); }, [fetchSamples]);

  const handleCreate = () => {
    setEditingSample(null);
    form.resetFields();
    form.setFieldsValue({ status: '库存', quantity: 1 });
    setModalOpen(true);
  };

  const handleEdit = (s: ShoeSample) => {
    setEditingSample(s);
    form.setFieldsValue({ ...s, storage_date: s.storage_date ? dayjs(s.storage_date) : null });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try { await apiClient.delete(`/samples/${id}`); message.success('已删除'); fetchSamples(); }
    catch { message.error('删除失败'); }
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const payload = {
      ...values,
      storage_date: values.storage_date?.format('YYYY-MM-DD'),
    };
    try {
      if (editingSample) {
        await apiClient.put(`/samples/${editingSample.id}`, payload);
        message.success('样品已更新');
      } else {
        await apiClient.post('/samples/', payload);
        message.success('样品已入库');
      }
      setModalOpen(false);
      fetchSamples();
    } catch { message.error('保存失败'); }
  };

  const showDetail = async (sample: ShoeSample) => {
    setDetailSample(sample);
    setDetailOpen(true);
    setDetailLoading(true);
    try {
      const [txnRes, tdRes] = await Promise.all([
        apiClient.get<SampleTransaction[]>(`/samples/${sample.id}/transactions`),
        apiClient.get<{ items: TestData[] }>('/test-data/', { params: { limit: 50 } }),
      ]);
      setDetailTxns(txnRes.data);
      setDetailTestData(tdRes.data.items.filter(td => td.sample_id === sample.id));
    } catch { message.error('加载详情失败'); }
    finally { setDetailLoading(false); }
  };

  const handleAddTransaction = async () => {
    if (!detailSample) return;
    const values = await txnForm.validateFields();
    try {
      await apiClient.post(`/samples/${detailSample.id}/transactions`, {
        ...values,
        operation_date: values.operation_date?.format('YYYY-MM-DD') || dayjs().format('YYYY-MM-DD'),
      });
      message.success('操作已记录');
      setTxnModalOpen(false);
      txnForm.resetFields();
      showDetail(detailSample);
    } catch { message.error('操作失败'); }
  };

  const columns = [
    { title: '样品编号', dataIndex: 'sample_no', key: 'sample_no', width: 130,
      render: (t: string) => <Tag color="blue">{t}</Tag> },
    { title: '品牌', dataIndex: 'brand', key: 'brand', width: 110 },
    { title: '鞋款', dataIndex: 'shoe_name', key: 'shoe_name', ellipsis: true },
    { title: '类型', dataIndex: 'shoe_type', key: 'shoe_type', width: 90, render: (t: string) => <Tag>{t}</Tag> },
    { title: '鞋号', dataIndex: 'shoe_size', key: 'shoe_size', width: 60 },
    { title: '跟高(mm)', dataIndex: 'heel_height_mm', key: 'heel', width: 80, render: (v: number) => v ? `${v}mm` : '-' },
    { title: '数量', dataIndex: 'quantity', key: 'quantity', width: 60 },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 80,
      render: (s: string) => <Tag color={statusColors[s]}>{s}</Tag>,
    },
    { title: '入库日期', dataIndex: 'storage_date', key: 'date', width: 100,
      render: (d: string) => d || '-' },
    {
      title: '操作', key: 'action', width: 130, fixed: 'right' as const,
      render: (_: unknown, record: ShoeSample) => (
        <Space>
          <Tooltip title="详情"><Button type="link" size="small" icon={<EyeOutlined />} onClick={() => showDetail(record)} /></Tooltip>
          <Tooltip title="编辑"><Button type="link" size="small" onClick={() => handleEdit(record)}>编辑</Button></Tooltip>
          <Popconfirm title="确定删除?" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const detailTabItems = detailSample ? [
    {
      key: 'txns', label: `库存流水 (${detailTxns.length})`,
      children: (
        <div>
          <Button type="primary" size="small" style={{ marginBottom: 12 }}
            onClick={() => { txnForm.resetFields(); setTxnModalOpen(true); }}>
            新增操作
          </Button>
          {detailTxns.length === 0 ? <Empty description="暂无流水记录" /> :
            <Table dataSource={detailTxns} rowKey="id" size="small" pagination={false}
              columns={[
                { title: '操作类型', dataIndex: 'operation_type', key: 'type', width: 100,
                  render: (t: string) => <Tag>{t}</Tag> },
                { title: '操作人员', dataIndex: 'operator', key: 'operator', width: 100 },
                { title: '操作日期', dataIndex: 'operation_date', key: 'date', width: 100 },
                { title: '备注', dataIndex: 'notes', key: 'notes', ellipsis: true },
                { title: '记录时间', dataIndex: 'created_at', key: 'created_at', width: 160,
                  render: (d: string) => formatDate(d) },
              ]}
            />
          }
        </div>
      ),
    },
    {
      key: 'testdata', label: `关联测试 (${detailTestData.length})`,
      children: detailTestData.length === 0 ? <Empty description="暂无关联测试" /> :
        <Table dataSource={detailTestData} rowKey="id" size="small"
          columns={[
            { title: '数据编号', dataIndex: 'data_no', key: 'no' },
            { title: '测试类型', dataIndex: 'test_type', key: 'type', render: (t: string) => <Tag color="purple">{t}</Tag> },
            { title: '测试日期', dataIndex: 'test_date', key: 'date' },
            { title: '设备', dataIndex: 'device_name', key: 'device' },
          ]}
        />
    },
  ] : [];

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col flex="auto">
            <Space wrap>
              <Select placeholder="状态" style={{ width: 110 }} allowClear
                value={filters.status} onChange={(v) => { setFilters(f => ({ ...f, status: v })); setPage(1); }}>
                {SAMPLE_STATUSES.map(s => <Option key={s} value={s}>{s}</Option>)}
              </Select>
              <Select placeholder="品牌" style={{ width: 130 }} allowClear
                value={filters.brand} onChange={(v) => { setFilters(f => ({ ...f, brand: v })); setPage(1); }}>
              </Select>
              <Select placeholder="类型" style={{ width: 110 }} allowClear
                value={filters.shoe_type} onChange={(v) => { setFilters(f => ({ ...f, shoe_type: v })); setPage(1); }}>
                {SHOE_TYPES.map(t => <Option key={t} value={t}>{t}</Option>)}
              </Select>
            </Space>
          </Col>
          <Col>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>样品入库</Button>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table dataSource={samples} columns={columns} rowKey="id" loading={loading}
          pagination={{ current: page, pageSize, total, onChange: (p, ps) => { setPage(p); setPageSize(ps); },
            showSizeChanger: true, showTotal: (t) => `共 ${t} 条` }}
          scroll={{ x: 1100 }} size="middle"
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal title={editingSample ? '编辑样品' : '样品入库'} open={modalOpen}
        onOk={handleSubmit} onCancel={() => setModalOpen(false)} width={640}>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="sample_no" label="样品编号" rules={[{ required: true }]}>
                <Input placeholder="如 SH-2026-001" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="brand" label="品牌"><Input /></Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="shoe_name" label="鞋款名称"><Input /></Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="shoe_type" label="鞋类型">
                <Select>{SHOE_TYPES.map(t => <Option key={t} value={t}>{t}</Option>)}</Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="shoe_size" label="鞋号"><InputNumber style={{ width: '100%' }} /></Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="size_label" label="尺码标签"><Input /></Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="heel_height_mm" label="跟高(mm)"><InputNumber style={{ width: '100%' }} /></Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="quantity" label="数量"><InputNumber min={1} style={{ width: '100%' }} /></Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="heel_structure" label="鞋跟结构"><Input /></Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="color" label="颜色"><Input /></Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="source" label="来源"><Input placeholder="品牌方/采购/其他" /></Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="storage_date" label="入库日期"><DatePicker style={{ width: '100%' }} /></Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="状态">
                <Select>{SAMPLE_STATUSES.map(s => <Option key={s} value={s}>{s}</Option>)}</Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="material_info" label="材料信息"><TextArea rows={2} /></Form.Item>
        </Form>
      </Modal>

      {/* Detail Drawer Modal */}
      <Modal title={detailSample ? `${detailSample.sample_no} - ${detailSample.brand} ${detailSample.shoe_name}` : ''}
        open={detailOpen} onCancel={() => setDetailOpen(false)} footer={null} width={800}>
        {detailSample && (
          <>
            <Descriptions size="small" column={3} bordered style={{ marginBottom: 16 }}>
              <Descriptions.Item label="品牌">{detailSample.brand || '-'}</Descriptions.Item>
              <Descriptions.Item label="鞋款">{detailSample.shoe_name || '-'}</Descriptions.Item>
              <Descriptions.Item label="类型">{detailSample.shoe_type || '-'}</Descriptions.Item>
              <Descriptions.Item label="鞋号">{detailSample.shoe_size || '-'}</Descriptions.Item>
              <Descriptions.Item label="跟高">{detailSample.heel_height_mm ? `${detailSample.heel_height_mm}mm` : '-'}</Descriptions.Item>
              <Descriptions.Item label="状态"><Tag color={statusColors[detailSample.status]}>{detailSample.status}</Tag></Descriptions.Item>
              <Descriptions.Item label="颜色">{detailSample.color || '-'}</Descriptions.Item>
              <Descriptions.Item label="数量">{detailSample.quantity}</Descriptions.Item>
              <Descriptions.Item label="入库日期">{detailSample.storage_date || '-'}</Descriptions.Item>
            </Descriptions>
            <Tabs items={detailTabItems} />
          </>
        )}
      </Modal>

      {/* Transaction Modal */}
      <Modal title="新增操作记录" open={txnModalOpen}
        onOk={handleAddTransaction} onCancel={() => setTxnModalOpen(false)} width={480}>
        <Form form={txnForm} layout="vertical">
          <Form.Item name="operation_type" label="操作类型" rules={[{ required: true }]}>
            <Select>{TXN_TYPES.map(t => <Option key={t} value={t}>{t}</Option>)}</Select>
          </Form.Item>
          <Form.Item name="operator" label="操作人员"><Input /></Form.Item>
          <Form.Item name="operation_date" label="操作日期"><DatePicker style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="notes" label="备注"><TextArea rows={2} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SamplesPage;
