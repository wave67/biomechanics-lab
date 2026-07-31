import React from 'react';
import { Card, Typography } from 'antd';

const TestData: React.FC = () => {
  return (
    <Card>
      <Typography.Title level={4}>\u6d4b\u8bd5\u6570\u636e\u5e93</Typography.Title>
      <Typography.Paragraph type="secondary">
        \u7ba1\u7406\u548c\u67e5\u8be2\u751f\u7269\u529b\u5b66\u6d4b\u8bd5\u6570\u636e\u3002
      </Typography.Paragraph>
    </Card>
  );
};

export default TestData;