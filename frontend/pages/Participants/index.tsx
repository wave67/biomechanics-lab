import React from 'react';
import { Card, Typography } from 'antd';

const Participants: React.FC = () => {
  return (
    <Card>
      <Typography.Title level={4}>\u53d7\u8bd5\u8005\u7ba1\u7406</Typography.Title>
      <Typography.Paragraph type="secondary">
        \u7ba1\u7406\u53d7\u8bd5\u8005\u4fe1\u606f\uff0c\u5305\u62ec\u57fa\u672c\u751f\u7406\u53c2\u6570\u548c\u53c2\u4e0e\u9879\u76ee\u8bb0\u5f55\u3002
      </Typography.Paragraph>
    </Card>
  );
};

export default Participants;