import React from 'react';
import { Card, Typography } from 'antd';

const Files: React.FC = () => {
  return (
    <Card>
      <Typography.Title level={4}>\u6587\u4ef6\u4e2d\u5fc3</Typography.Title>
      <Typography.Paragraph type="secondary">
        \u7ba1\u7406\u6d4b\u8bd5\u76f8\u5173\u6587\u4ef6\u7684\u4e0a\u4f20\u3001\u4e0b\u8f7d\u548c\u5f52\u6863\u3002
      </Typography.Paragraph>
    </Card>
  );
};

export default Files;