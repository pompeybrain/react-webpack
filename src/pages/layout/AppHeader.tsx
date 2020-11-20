import React from 'react';
import { Avatar, Dropdown, Layout, Menu } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import { VideoCameraOutlined, UserOutlined, DownOutlined } from '@ant-design/icons';
import { destroyTokens } from '@/services/auth';
const { Header } = Layout;

export default function AppHeader() {
  const appName = '管理平台';
  const userName = '用户名';
  const history = useHistory();
  const userInfoMenu = (
    <Menu onClick={handleUserInfoMenuClick}>
      <Menu.Item key="updatepassword">
        <Link to="/">修改密码</Link>
      </Menu.Item>
      <Menu.Item key="setting">
        <Link to="/setting">设置</Link>
      </Menu.Item>
      <Menu.Item key="logout">注销</Menu.Item>
    </Menu>
  );

  function handleUserInfoMenuClick({ key }: any) {
    if (key === 'logout') {
      destroyTokens();
      history.push('/login');
    }
  }

  return (
    <Header className="app-header">
      <a className="app-logo" href="/" target="_blank" title={appName} rel="noopener noreferrer">
        <div className="logo-icon"></div>
        <span>{appName}</span>
      </a>
      <Menu className="header-menu" mode="horizontal" defaultSelectedKeys={['m1']}>
        <Menu.Item key="module1">
          <Link to="/module1">模块1</Link>
        </Menu.Item>
        <Menu.Item key="module2">
          <Link to="/module2">模块2</Link>
        </Menu.Item>
      </Menu>
      <div className="header-right">
        <Dropdown overlay={userInfoMenu}>
          <div className="user-info">
            <Avatar size={24} icon={<UserOutlined />} />
            <span className="user-name">{userName}</span>
            <DownOutlined />
          </div>
        </Dropdown>
      </div>
    </Header>
  );
}
