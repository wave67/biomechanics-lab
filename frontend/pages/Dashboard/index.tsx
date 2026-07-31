import React from 'react';
import { Card, Typography } from 'antd';

const Dashboard: React.FC = () => {
  return (
    <Card>
      <Typography.Title level={4}>\u9996\u9875\u5de5\u4f5c\u53f0</Typography.Title>
      <Typography.Paragraph type="secondary">
        \u6b22\u8fce\u4f7f\u7528\u9ad8\u8ddf\u978b\u751f\u7269\u529b\u5b66\u6d4b\u8bd5\u7814\u53d1\u5de5\u4f5c\u53f0\u3002
      </Typography.Paragraph>
    </Card>
  );
};

export default Dashboard;