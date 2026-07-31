import React from 'react';
import { Card, Typography } from 'antd';

const Tasks: React.FC = () => {
  return (
    <Card>
      <Typography.Title level={4}>Todo\u4efb\u52a1\u7ba1\u7406</Typography.Title>
      <Typography.Paragraph type="secondary">
        \u7ba1\u7406\u6bcf\u5929\u7684\u7814\u53d1\u4efb\u52a1\uff1a\u521b\u5efa\u3001\u7f16\u8f91\u3001\u8ddf\u8e2a\u4efb\u52a1\u8fdb\u5ea6\u3002
      </Typography.Paragraph>
    </Card>
  );
};

export default Tasks;