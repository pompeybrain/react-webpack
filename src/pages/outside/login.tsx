import { setToken } from '@/services/auth';
import { postEncodedForm } from '@/utils/request';
import { Button, Checkbox, Form, Input } from 'antd';
import * as React from 'react';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './login.less';

interface LoginedData {
  token: string;
}

// interface LoginedData {
//   accessToken: string;
//   refreshToken: string;
// }

function loginedProcess({ token }: LoginedData) {
  setToken(token);
  // setToken(accessToken, refreshToken);
}

export default function login({ onLogined }: { onLogined: any }) {
  const onFinish = (values: any) => {
    postEncodedForm(`agent/login`, values).then(async data => {
      loginedProcess(data);
      onLogined(`/resource/org`);
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="login-page">
      <Form
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item name="username" rules={[{ required: true, message: 'Please input your Username!' }]}>
          <Input autoFocus prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: 'Please input your Password!' }]}>
          <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Password" />
        </Form.Item>
        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
        <Form.Item>
          <Button className="login-btn" type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
