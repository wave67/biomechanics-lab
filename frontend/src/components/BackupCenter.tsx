import React, { useState } from 'react';
import { Card, Button, Upload, message, Typography, Space, Tag } from 'antd';
import { DownloadOutlined, UploadOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { backupStore } from '../api/client';

const { Text, Paragraph } = Typography;

const BackupCenter: React.FC = () => {
  const [importing, setImporting] = useState(false);

  const handleExport = () => {
    const json = backupStore.exportAll();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `biomechanics-lab-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    message.success('备份已导出');
  };

  const handleImport = async (file: File) => {
    setImporting(true);
    try {
      const text = await file.text();
      const ok = backupStore.importAll(text);
      if (ok) message.success('数据已导入，请刷新页面');
      else message.error('备份文件格式无效');
    } catch {
      message.error('导入失败');
    } finally {
      setImporting(false);
    }
    return false;
  };

  return (
    <Card title="数据备份与恢复">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Paragraph>
          <Tag color="blue"><InfoCircleOutlined /> 数据存储位置</Tag>
          所有数据保存在当前浏览器的 localStorage 中，关闭浏览器或电脑后数据仍然存在。换设备或清缓存前请先导出备份。
        </Paragraph>
        <Space>
          <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}>导出全部数据</Button>
          <Upload beforeUpload={handleImport} showUploadList={false} accept=".json">
            <Button icon={<UploadOutlined />} loading={importing}>导入备份</Button>
          </Upload>
        </Space>
        <Text type="secondary">
          导出文件包含：任务、项目、样品、受试者、设备、指标、测试数据、分析记录、报告等全部内容。
        </Text>
      </Space>
    </Card>
  );
};

export default BackupCenter;
