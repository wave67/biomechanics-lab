import React, { useState, useEffect, useCallback } from "react";
import { Card, Table, Button, Space, Tag, Modal, Form, Input, Select, message, Popconfirm, Row, Col } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import apiClient from "../../api/client";
import { formatDate } from "../../utils/date";

const { TextArea } = Input;
const { Option } = Select;
const TEST_TYPES = ["足底压力测试", "三维力台测试", "动态捕捉测试"];

const MetricsPage: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();

  const fetch = useCallback(async () => {
    setLoading(true);
    try { const r = await apiClient.get("/metrics/", { params: { skip: (page-1)*20, limit: 20 } }); setItems(r.data.items); setTotal(r.data.total); }
    catch { message.error("Failed"); } finally { setLoading(false); }
  }, [page]);
  useEffect(() => { fetch(); }, [fetch]);

  const openCreate = () => { setEditing(null); form.resetFields(); setModalOpen(true); };
  const openEdit = (item: any) => { setEditing(item); form.setFieldsValue(item); setModalOpen(true); };
  const handleDelete = async (id: number) => { try { await apiClient.delete(`/metrics/${id}`); message.success("Deleted"); fetch(); } catch { message.error("Failed"); } };
  const handleSubmit = async () => {
    const v = await form.validateFields();
    try {
      if (editing) { await apiClient.put(`/metrics/${editing.id}`, v); message.success("Updated"); }
      else { await apiClient.post("/metrics/", v); message.success("Created"); }
      setModalOpen(false); fetch();
    } catch { message.error("Failed"); }
  };

  const columns = [
    { title: "Metric No", dataIndex: "metric_no", key: "no", width: 110, render: (t: string) => <Tag color="geekblue">{t}</Tag> },
    { title: "Name (EN)", dataIndex: "metric_name", key: "name" },
    { title: "Name (CN)", dataIndex: "metric_name_cn", key: "cn", width: 130 },
    { title: "Unit", dataIndex: "unit", key: "unit", width: 80 },
    { title: "Test Type", dataIndex: "test_type", key: "type", width: 120, render: (t: string) => <Tag>{t}</Tag> },
    { title: "Created", dataIndex: "created_at", key: "created", width: 150, render: (d: string) => formatDate(d) },
    { title: "", key: "action", width: 80, render: (_: any, r: any) => (
      <Space><Button type="link" size="small" icon={<EditOutlined />} onClick={() => openEdit(r)} />
      <Popconfirm title="Delete?" onConfirm={() => handleDelete(r.id)}><Button type="link" size="small" danger icon={<DeleteOutlined />} /></Popconfirm></Space>
    )},
  ];

  return (
    <div>
      <Card style={{ marginBottom: 16 }}><Row><Col flex="auto" /><Col><Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>New Metric</Button></Col></Row></Card>
      <Card><Table dataSource={items} columns={columns} rowKey="id" loading={loading} pagination={{ current: page, pageSize: 20, total, onChange: (p) => setPage(p), showTotal: (t) => `Total ${t}` }} /></Card>

      <Modal title={editing ? "Edit Metric" : "New Metric"} open={modalOpen} onOk={handleSubmit} onCancel={() => setModalOpen(false)} width={600}>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={8}><Form.Item name="metric_no" label="Metric No" rules={[{ required: true }]}><Input placeholder="PR-001" /></Form.Item></Col>
            <Col span={8}><Form.Item name="metric_name" label="Name (EN)" rules={[{ required: true }]}><Input placeholder="peak pressure" /></Form.Item></Col>
            <Col span={8}><Form.Item name="unit" label="Unit"><Input placeholder="kPa" /></Form.Item></Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}><Form.Item name="metric_name_cn" label="Name (CN)"><Input placeholder="峰值压力" /></Form.Item></Col>
            <Col span={12}><Form.Item name="test_type" label="Test Type" rules={[{ required: true }]}><Select>{TEST_TYPES.map(t => <Option key={t} value={t}>{t}</Option>)}</Select></Form.Item></Col>
          </Row>
          <Form.Item name="description" label="Description"><TextArea rows={2} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default MetricsPage;
