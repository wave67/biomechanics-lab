import React from 'react';
import { Card, Typography } from 'antd';

const Projects: React.FC = () => {
  return (
    <Card>
      <Typography.Title level={4}>\u6d4b\u8bd5\u9879\u76ee\u7ba1\u7406</Typography.Title>
      <Typography.Paragraph type="secondary">
        \u7ba1\u7406\u548c\u8ddf\u8e2a\u9ad8\u8ddf\u978b\u751f\u7269\u529b\u5b66\u6d4b\u8bd5\u9879\u76ee\u3002
      </Typography.Paragraph>
    </Card>
  );
};

export default Projects;