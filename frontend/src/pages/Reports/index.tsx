import React, { useState, useEffect, useCallback } from "react";
import { Card, Table, Button, Space, Tag, Select, Modal, Input, message, Popconfirm, Row, Col, Typography } from "antd";
import { PlusOutlined, FileTextOutlined, DeleteOutlined, DownloadOutlined } from "@ant-design/icons";
import apiClient from '../../api/client';
import { formatDate } from "../../utils/date";

const { Option } = Select;
const { Text } = Typography;

const ReportsPage: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [reportType, setReportType] = useState("PPTX");
  const [selectedAnalyses, setSelectedAnalyses] = useState<number[]>([]);

  const fetch = useCallback(async () => {
    setLoading(true);
    try { const r = await apiClient.get("/reports/", { params: selectedProject ? { project_id: selectedProject } : {} }); setItems(r.data); }
    catch { message.error("Failed"); } finally { setLoading(false); }
  }, [selectedProject]);

  useEffect(() => { fetch(); }, [fetch]);
  useEffect(() => { apiClient.get("/projects/", { params: { limit: 200 } }).then(r => setProjects(r.data.items)).catch(() => {}); }, []);

  const loadAnalyses = (pid: number) => {
    apiClient.get(`/analysis/history/${pid}`).then(r => setAnalyses(r.data)).catch(() => setAnalyses([]));
  };

  const handleCreate = () => { setName(""); setReportType("PPTX"); setSelectedAnalyses([]); setModalOpen(true); };
  const handleGenerate = async (rid: number) => {
    try {
      const r = await apiClient.post(`/reports/${rid}/generate`);
      message.success("Report generated!");
      fetch();
    } catch { message.error("Failed"); }
  };
  const handleDelete = async (id: number) => { try { await apiClient.delete(`/reports/${id}`); message.success("Deleted"); fetch(); } catch { message.error("Failed"); } };
  const handleSubmit = async () => {
    if (!selectedProject || !name) { message.warning("Please fill all fields"); return; }
    try {
      await apiClient.post("/reports/", { project_id: selectedProject, report_name: name, report_type: reportType, analysis_ids: selectedAnalyses });
      message.success("Report created"); setModalOpen(false); fetch();
    } catch { message.error("Failed"); }
  };

    const columns = [
    { title: "报告名称", dataIndex: "report_name", key: "name" },
    { title: "格式", dataIndex: "report_type", key: "type", width: 70, render: (t: string) => <Tag>{t}</Tag> },
    { title: "状态", dataIndex: "status", key: "status", width: 80, render: (s: string) => <Tag color={s === "Generated" ? "green" : "default"}>{s}</Tag> },
    { title: "创建时间", dataIndex: "created_at", key: "created", width: 160, render: (d: string) => formatDate(d) },
    { title: "", key: "action", width: 200, render: (_: any, r: any) => (
      <Space>
        <Button type="primary" size="small" icon={<FileTextOutlined />} onClick={() => handleGenerate(r.id)} disabled={r.status === "Generated"}>生成</Button>
        {r.file_id && (
          <Button size="small" icon={<DownloadOutlined />} onClick={() => window.open(`/api/files/${r.file_id}/download`, "_blank")}>下载</Button>
        )}
        <Popconfirm title="确定删除?" onConfirm={() => handleDelete(r.id)}><Button size="small" danger icon={<DeleteOutlined />} /></Popconfirm>
      </Space>
    )},
  ];

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col span={6}>
            <Select placeholder="Filter by Project" style={{ width: "100%" }} allowClear value={selectedProject}
              onChange={(v) => { setSelectedProject(v); if (v) loadAnalyses(v); }}>
              {projects.map(p => <Option key={p.id} value={p.id}>{p.project_no}</Option>)}
            </Select>
          </Col>
          <Col flex="auto" />
          <Col><Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>New Report</Button></Col>
        </Row>
      </Card>
      <Card><Table dataSource={items} columns={columns} rowKey="id" loading={loading} /></Card>

      <Modal title="New Report" open={modalOpen} onOk={handleSubmit} onCancel={() => setModalOpen(false)} width={500}>
        <p>Project: <strong>{projects.find(p => p.id === selectedProject)?.project_no || "Select a project first"}</strong></p>
        <p><Input placeholder="Report name" value={name} onChange={e => setName(e.target.value)} /></p>
        <p>
          <Select value={reportType} onChange={setReportType} style={{ width: 120 }}>
            <Option value="PPTX">PPTX</Option><Option value="PDF">PDF</Option>
          </Select>
        </p>
        {analyses.length > 0 && (
          <div>
            <Text strong>Include analyses:</Text>
            <Select mode="multiple" style={{ width: "100%", marginTop: 8 }} value={selectedAnalyses} onChange={setSelectedAnalyses}>
              {analyses.map((a: any) => <Option key={a.id} value={a.id}>{a.analysis_name}</Option>)}
            </Select>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ReportsPage;
