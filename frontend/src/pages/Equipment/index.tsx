import React, { useState, useEffect, useCallback } from 'react';
import { Card, Table, Button, Space, Tag, Modal, Form, Input, Select, InputNumber, message, Popconfirm, Tooltip, Row, Col, Descriptions } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import apiClient from '../../api/client';
import { formatDate } from '../../utils/date';

const { TextArea } = Input;
const { Option } = Select;
const STATUSES = ["正常", "维护", "校准", "停用"];

const EquipmentPage: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();

  const fetch = useCallback(async () => {
    setLoading(true);
    try { const r = await apiClient.get("/equipment/", { params: { skip: (page-1)*20, limit: 20 } }); setItems(r.data.items); setTotal(r.data.total); }
    catch { message.error("Failed"); } finally { setLoading(false); }
  }, [page]);

  useEffect(() => { fetch(); }, [fetch]);

  const openCreate = () => { setEditing(null); form.resetFields(); form.setFieldsValue({ status: "正常" }); setModalOpen(true); };
  const openEdit = (item: any) => { setEditing(item); form.setFieldsValue(item); setModalOpen(true); };
  const handleDelete = async (id: number) => { try { await apiClient.delete(`/equipment/${id}`); message.success("Deleted"); fetch(); } catch { message.error("Failed"); } };
  const handleSubmit = async () => {
    const v = await form.validateFields();
    try {
      if (editing) { await apiClient.put(`/equipment/${editing.id}`, v); message.success("Updated"); }
      else { await apiClient.post("/equipment/", v); message.success("Created"); }
      setModalOpen(false); fetch();
    } catch { message.error("Failed"); }
  };

  const columns = [
    { title: "Eq No", dataIndex: "equipment_no", key: "no", width: 100, render: (t: string) => <Tag color="cyan">{t || "-"}</Tag> },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Brand", dataIndex: "brand", key: "brand", width: 120 },
    { title: "Model", dataIndex: "model", key: "model", width: 120 },
    { title: "Sampling(Hz)", dataIndex: "sampling_frequency", key: "freq", width: 100, render: (f: number) => f ? `${f}Hz` : "-" },
    { title: "Status", dataIndex: "status", key: "status", width: 80, render: (s: string) => <Tag>{s}</Tag> },
    { title: "Updated", dataIndex: "updated_at", key: "updated", width: 160, render: (d: string) => formatDate(d) },
    { title: "操作", key: "action", width: 100, render: (_: any, r: any) => (
      <Space><Button type="link" size="small" icon={<EditOutlined />} onClick={() => openEdit(r)} />
      <Popconfirm title="Delete?" onConfirm={() => handleDelete(r.id)}><Button type="link" size="small" danger icon={<DeleteOutlined />} /></Popconfirm></Space>
    )},
  ];

  return (
    <div>
      <Card style={{ marginBottom: 16 }}><Row align="middle"><Col flex="auto" /><Col><Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>New Equipment</Button></Col></Row></Card>
      <Card><Table dataSource={items} columns={columns} rowKey="id" loading={loading} pagination={{ current: page, pageSize: 20, total, onChange: (p) => setPage(p), showTotal: (t) => `Total ${t}` }} /></Card>

      <Modal title={editing ? "Edit Equipment" : "New Equipment"} open={modalOpen} onOk={handleSubmit} onCancel={() => setModalOpen(false)} width={600}>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}><Form.Item name="name" label="Name" rules={[{ required: true }]}><Input placeholder="Equipment name" /></Form.Item></Col>
            <Col span={12}><Form.Item name="equipment_no" label="Equipment No"><Input placeholder="EQ-001" /></Form.Item></Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}><Form.Item name="brand" label="Brand"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="model" label="Model"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="sampling_frequency" label="Sampling Freq(Hz)"><InputNumber min={1} style={{ width: "100%" }} /></Form.Item></Col>
          </Row>
          <Form.Item name="status" label="Status"><Select>{STATUSES.map(s => <Option key={s} value={s}>{s}</Option>)}</Select></Form.Item>
          <Form.Item name="notes" label="Notes"><TextArea rows={2} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EquipmentPage;
