import React, { useState, useEffect, useCallback } from 'react';
import {
  Card, Table, Button, Space, Tag, Modal, Select, Upload, message,
  Popconfirm, Tooltip, Row, Col, Typography, Image,
} from 'antd';
import { PlusOutlined, DeleteOutlined, DownloadOutlined, EyeOutlined, UploadOutlined, InboxOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import dayjs from 'dayjs';

import apiClient from '../../api/client';
import type { TestFile } from '../../types';
import { formatDate } from '../../utils/date';

const { Dragger } = Upload;
const { Text } = Typography;
const { Option } = Select;

const FILE_TYPES = ['图片', '视频', '压力图', '运动捕捉视频', 'Excel', 'CSV', 'MAT文件', 'PPT', 'PDF', '其他'];

const FilesPage: React.FC = () => {
  const [items, setItems] = useState<TestFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [uploadOpen, setUploadOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const params = { skip: (page - 1) * pageSize, limit: pageSize, ...filters };
      const res = await apiClient.get<{ items: TestFile[]; total: number }>('/files/', { params });
      setItems(res.data.items);
      setTotal(res.data.total);
    } catch { message.error('加载失败'); }
    finally { setLoading(false); }
  }, [page, pageSize, filters]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleDelete = async (id: number) => {
    try { await apiClient.delete(`/files/${id}`); message.success('已删除'); fetch(); }
    catch { message.error('删除失败'); }
  };

  const handleUpload = async () => {
    if (fileList.length === 0) { message.warning('请选择文件'); return; }
    setUploading(true);
    const formData = new FormData();
    fileList.forEach(f => {
      if (f.originFileObj) {
        formData.append('file', f.originFileObj);
        formData.append('project_no', 'temp');
        formData.append('file_type', '其他');
        formData.append('uploader', '当前用户');
      }
    });
    try {
      await apiClient.post('/files/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      message.success('上传成功');
      setUploadOpen(false);
      setFileList([]);
      fetch();
    } catch { message.error('上传失败'); }
    finally { setUploading(false); }
  };

  const handlePreview = (record: TestFile) => {
    const imgExts = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
    const ext = record.file_name.substring(record.file_name.lastIndexOf('.')).toLowerCase();
    if (imgExts.includes(ext)) {
      setPreviewUrl(`/storage/${record.storage_path}`);
      setPreviewOpen(true);
    } else {
      message.info('暂不支持预览此文件类型，请下载查看');
    }
  };

  const columns = [
    { title: '文件名', dataIndex: 'file_name', key: 'file_name', ellipsis: true, width: 300 },
    { title: '类型', dataIndex: 'file_type', key: 'file_type', width: 110, render: (t: string) => <Tag>{t}</Tag> },
    { title: '大小', dataIndex: 'file_size_bytes', key: 'size', width: 90,
      render: (b: number) => b ? b > 1048576 ? `${(b/1048576).toFixed(1)}MB` : `${(b/1024).toFixed(1)}KB` : '-' },
    { title: '上传人员', dataIndex: 'uploader', key: 'uploader', width: 100 },
    { title: '上传时间', dataIndex: 'upload_time', key: 'time', width: 160, render: (t: string) => t ? formatDate(t) : '-' },
    {
      title: '操作', key: 'action', width: 130, fixed: 'right',
      render: (_: unknown, record: TestFile) => (
        <Space>
          <Tooltip title="预览"><Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handlePreview(record)} /></Tooltip>
          <Tooltip title="下载">
            <Button type="link" size="small" icon={<DownloadOutlined />}
              onClick={() => window.open(`/api/files/${record.id}/download`, '_blank')} />
          </Tooltip>
          <Popconfirm title="确定删除?" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const uploadProps = {
    onRemove: (file: UploadFile) => {
      setFileList(prev => prev.filter(f => f.uid !== file.uid));
    },
    beforeUpload: (file: UploadFile) => {
      setFileList(prev => [...prev, file]);
      return false;
    },
    fileList,
    multiple: true,
  };

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Row align="middle">
          <Col flex="auto">
            <Space wrap>
              <Select placeholder="文件类型" style={{ width: 130 }} allowClear
                value={filters.file_type} onChange={(v) => { setFilters(f => ({ ...f, file_type: v })); setPage(1); }}>
                {FILE_TYPES.map(t => <Option key={t} value={t}>{t}</Option>)}
              </Select>
              <Select placeholder="项目" style={{ width: 130 }} allowClear
                value={filters.project_id} onChange={(v) => { setFilters(f => ({ ...f, project_id: v })); setPage(1); }}>
              </Select>
            </Space>
          </Col>
          <Col><Button type="primary" icon={<UploadOutlined />} onClick={() => setUploadOpen(true)}>上传文件</Button></Col>
        </Row>
      </Card>
      <Card>
        <Table dataSource={items} columns={columns} rowKey="id" loading={loading}
          pagination={{ current: page, pageSize, total, onChange: (p, ps) => { setPage(p); setPageSize(ps); }, showSizeChanger: true, showTotal: (t) => `共 ${t} 条` }}
          scroll={{ x: 1000 }} size="middle" />
      </Card>

      <Modal title="上传文件" open={uploadOpen}
        onOk={handleUpload} onCancel={() => { setUploadOpen(false); setFileList([]); }}
        confirmLoading={uploading}
        okText="开始上传">
        <Dragger {...uploadProps} style={{ marginBottom: 16 }}>
          <p className="ant-upload-drag-icon"><InboxOutlined /></p>
          <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
          <p className="ant-upload-hint">支持单文件或多文件上传</p>
        </Dragger>
      </Modal>

      <Image
        style={{ display: 'none' }}
        preview={{ visible: previewOpen, src: previewUrl, onVisibleChange: (v) => setPreviewOpen(v) }}
      />
    </div>
  );
};

export default FilesPage;
