import React, { useState, useEffect, useCallback } from 'react';
import { Card, Table, Button, Space, Tag, Modal, Form, Input, Select, Switch, message, Popconfirm, Tooltip, Row, Col, Descriptions } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import apiClient from '../../api/client';
import { formatDate } from '../../utils/date';

const { TextArea } = Input;
const { Option } = Select;

const ProtocolsPage: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();

  const fetch = useCallback(async () => {
    setLoading(true);
    try { const r = await apiClient.get("/protocols/", { params: { skip: (page-1)*20, limit: 20 } }); setItems(r.data.items); setTotal(r.data.total); }
    catch { message.error("Failed"); } finally { setLoading(false); }
  }, [page]);

  useEffect(() => { fetch(); }, [fetch]);

  const openCreate = () => { setEditing(null); form.resetFields(); form.setFieldsValue({ version: "1.0", is_active: true }); setModalOpen(true); };
  const openEdit = (item: any) => { setEditing(item); form.setFieldsValue(item); setModalOpen(true); };
  const handleDelete = async (id: number) => { try { await apiClient.delete(`/protocols/${id}`); message.success("Deleted"); fetch(); } catch { message.error("Failed"); } };
  const handleSubmit = async () => {
    const v = await form.validateFields();
    try {
      if (editing) { await apiClient.put(`/protocols/${editing.id}`, v); message.success("Updated"); }
      else { await apiClient.post("/protocols/", v); message.success("Created"); }
      setModalOpen(false); fetch();
    } catch { message.error("Failed"); }
  };

  const columns = [
    { title: "Protocol No", dataIndex: "protocol_no", key: "no", width: 120, render: (t: string) => <Tag color="geekblue">{t || "-"}</Tag> },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Version", dataIndex: "version", key: "ver", width: 80 },
    { title: "Active", dataIndex: "is_active", key: "active", width: 70, render: (b: boolean) => b ? <Tag color="green">Yes</Tag> : <Tag>No</Tag> },
    { title: "Updated", dataIndex: "updated_at", key: "updated", width: 160, render: (d: string) => formatDate(d) },
    { title: "操作", key: "action", width: 100, render: (_: any, r: any) => (
      <Space><Button type="link" size="small" icon={<EditOutlined />} onClick={() => openEdit(r)} />
      <Popconfirm title="Delete?" onConfirm={() => handleDelete(r.id)}><Button type="link" size="small" danger icon={<DeleteOutlined />} /></Popconfirm></Space>
    )},
  ];

  return (
    <div>
      <Card style={{ marginBottom: 16 }}><Row align="middle"><Col flex="auto" /><Col><Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>New Protocol</Button></Col></Row></Card>
      <Card><Table dataSource={items} columns={columns} rowKey="id" loading={loading} pagination={{ current: page, pageSize: 20, total, onChange: (p) => setPage(p), showTotal: (t) => `Total ${t}` }} /></Card>

      <Modal title={editing ? "Edit Protocol" : "New Protocol"} open={modalOpen} onOk={handleSubmit} onCancel={() => setModalOpen(false)} width={640}>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}><Form.Item name="name" label="Name" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={6}><Form.Item name="protocol_no" label="Protocol No"><Input placeholder="P-001" /></Form.Item></Col>
            <Col span={6}><Form.Item name="version" label="Version"><Input /></Form.Item></Col>
          </Row>
          <Form.Item name="test_purpose" label="Test Purpose"><TextArea rows={2} /></Form.Item>
          <Form.Item name="is_active" label="Active" valuePropName="checked"><Switch /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProtocolsPage;
