import React, { useState, useEffect } from "react";
import {
  Card, Select, Button, Table, Spin, Tabs, Tag, Row, Col, Typography, Space, Statistic, Divider, Empty,
} from "antd";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, Legend,
  LineChart, Line, ResponsiveContainer,
} from "recharts";
import apiClient from '../../api/client';
import type { Project } from "../../types";

const { Title, Text } = Typography;
const { Option } = Select;

const METRICS = [
  { label: "Peak Pressure (heel)", path: "peak_pressure.heel", type: "??????", unit: "kPa" },
  { label: "Peak Pressure (metatarsal)", path: "peak_pressure.metatarsal", type: "??????", unit: "kPa" },
  { label: "Contact Area", path: "contact_area.total", type: "??????", unit: "cm2" },
  { label: "Forefoot Pressure Ratio", path: "forefoot_pressure_ratio", type: "??????", unit: "" },
  { label: "Vertical GRF Peak", path: "vgrf_peak", type: "??????", unit: "BW" },
  { label: "Loading Rate", path: "loading_rate", type: "??????", unit: "N/s" },
  { label: "Ankle Dorsiflexion", path: "ankle_angle.dorsiflexion", type: "??????", unit: "deg" },
  { label: "Knee Flexion", path: "knee_angle.flexion", type: "??????", unit: "deg" },
  { label: "Step Length", path: "step_length.left_mm", type: "??????", unit: "mm" },
];

const COLORS = ["#1677ff", "#52c41a", "#fa8c16", "#eb2f96", "#722ed1", "#13c2c2"];

const AnalysisPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string>("peak_pressure.heel");
  const [metricInfo, setMetricInfo] = useState(METRICS[0]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("descriptive");

  useEffect(() => {
    apiClient.get("/projects/", { params: { limit: 200 } }).then(r => setProjects(r.data.items)).catch(() => {});
  }, []);

  const handleMetricChange = (path: string) => {
    setSelectedMetric(path);
    const info = METRICS.find(m => m.path === path) || METRICS[0];
    setMetricInfo(info);
  };

  const runAnalysis = async (type: string) => {
    if (!selectedProject) return;
    setLoading(true);
    try {
      const endpoint = type === "descriptive" ? "/analysis/descriptive" : "/analysis/shoe-comparison";
      const params = {
        project_id: selectedProject,
        metric_path: selectedMetric,
        metric_name: metricInfo.label,
        unit: metricInfo.unit,
      };
      const r = await apiClient.post(endpoint, null, { params });
      setResult(r.data);
    } catch { setResult(null); }
    finally { setLoading(false); }
  };

  const loadHistory = async (projectId: number) => {
    try {
      const r = await apiClient.get(`/analysis/history/${projectId}`);
      setHistory(r.data);
    } catch { setHistory([]); }
  };

  const formatChartData = (comparison: Record<string, any>) => {
    if (!comparison) return [];
    return Object.entries(comparison).map(([name, stats]: [string, any]) => ({
      name: name.length > 15 ? name.substring(0, 15) + "..." : name,
      Mean: stats.mean,
      Std: stats.std,
      Max: stats.max,
      Min: stats.min,
    }));
  };

  const renderDescriptive = () => {
    if (!result?.stats) return null;
    const { stats } = result;
    return (
      <div>
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}><Card><Statistic title="N" value={stats.n} /></Card></Col>
          <Col span={6}><Card><Statistic title="Mean" value={stats.mean} suffix={result.unit} precision={2} /></Card></Col>
          <Col span={6}><Card><Statistic title="SD" value={stats.std} suffix={result.unit} precision={2} /></Card></Col>
          <Col span={6}><Card><Statistic title="Median" value={stats.median} suffix={result.unit} precision={2} /></Card></Col>
        </Row>
        <Row gutter={16}>
          <Col span={6}><Card><Statistic title="Min" value={stats.min} suffix={result.unit} precision={2} /></Card></Col>
          <Col span={6}><Card><Statistic title="Max" value={stats.max} suffix={result.unit} precision={2} /></Card></Col>
          <Col span={12}><Card><Statistic title="Metric" value={result.metric_name} /></Card></Col>
        </Row>
      </div>
    );
  };

  const renderComparison = () => {
    if (!result?.comparison) return null;
    const data = formatChartData(result.comparison);
    return (
      <div>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-20} textAnchor="end" height={80} />
            <YAxis />
            <ReTooltip />
            <Legend />
            <Bar dataKey="Mean" fill="#1677ff" name="Mean" />
            <Bar dataKey="Std" fill="#52c41a" name="SD" />
          </BarChart>
        </ResponsiveContainer>
        <Table dataSource={data} rowKey="name" size="small" pagination={false} style={{ marginTop: 16 }}
          columns={[
            { title: "Group", dataIndex: "name", key: "name" },
            { title: "Mean", dataIndex: "Mean", key: "mean", render: (v: number) => v?.toFixed(2) },
            { title: "SD", dataIndex: "Std", key: "std", render: (v: number) => v?.toFixed(2) },
            { title: "Min", dataIndex: "Min", key: "min", render: (v: number) => v?.toFixed(2) },
            { title: "Max", dataIndex: "Max", key: "max", render: (v: number) => v?.toFixed(2) },
          ]}
        />
      </div>
    );
  };

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col span={6}>
            <Select placeholder="Select Project" style={{ width: "100%" }} value={selectedProject}
              onChange={(v) => { setSelectedProject(v); loadHistory(v); }}>
              {projects.map(p => <Option key={p.id} value={p.id}>{p.project_no} - {p.project_name}</Option>)}
            </Select>
          </Col>
          <Col span={6}>
            <Select placeholder="Select Metric" style={{ width: "100%" }} value={selectedMetric}
              onChange={handleMetricChange}>
              {METRICS.map(m => <Option key={m.path} value={m.path}>{m.label} ({m.unit})</Option>)}
            </Select>
          </Col>
          <Col>
            <Button type="primary" onClick={() => runAnalysis("descriptive")} loading={loading} style={{ marginRight: 8 }}>
              Descriptive Stats
            </Button>
            <Button onClick={() => runAnalysis("shoe-comparison")} loading={loading}>
              Shoe Comparison
            </Button>
          </Col>
        </Row>
        {selectedMetric && (
          <Text type="secondary" style={{ marginTop: 8, display: "block" }}>
            Path: {selectedMetric} | Type: {metricInfo.type} | Unit: {metricInfo.unit}
          </Text>
        )}
      </Card>

      {loading && <Spin size="large" style={{ display: "block", margin: "80px auto" }} />}

      {result && !loading && (
        <Card title={`${result.metric_name || ""} - ${metricInfo.type || ""}`} style={{ marginBottom: 16 }}>
          {result.stats && renderDescriptive()}
          {result.comparison && renderComparison()}
        </Card>
      )}

      {result && !loading && !result.stats && !result.comparison && (
        <Card><Empty description="No data available for this metric in the selected project" /></Card>
      )}

      {history.length > 0 && (
        <Card title="Analysis History">
          <Table dataSource={history} rowKey="id" size="small"
            columns={[
              { title: "Name", dataIndex: "analysis_name", key: "name" },
              { title: "Type", dataIndex: "analysis_type", key: "type", render: (t: string) => <Tag>{t}</Tag> },
              { title: "Created", dataIndex: "created_at", key: "created", render: (d: string) => d ? new Date(d).toLocaleString() : "-" },
            ]}
          />
        </Card>
      )}
    </div>
  );
};

export default AnalysisPage;
