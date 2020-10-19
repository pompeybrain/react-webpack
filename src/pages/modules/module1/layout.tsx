import { Layout, Menu, Breadcrumb, Button } from 'antd';
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from '@ant-design/icons';
import React from 'react';
import { Link, Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import loadable from '@loadable/component';
const User = loadable((props) => import('./user/user'));

const { SubMenu } = Menu;
const { Content, Sider } = Layout;
const M1Layout = () => {
  let { path, url } = useRouteMatch();

  return (
    <Layout>
      <Sider width={200} className="site-layout-background">
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{ height: '100%', borderRight: 0 }}
        >
          <SubMenu key="sub1" icon={<UserOutlined />} title="subnav 1">
            <Menu.Item key="1">option1</Menu.Item>
            <Menu.Item key="2">option2</Menu.Item>
            <Menu.Item key="3">option3</Menu.Item>
            <Menu.Item key="4">option4</Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" icon={<LaptopOutlined />} title="subnav 2">
            <Menu.Item key="5">option5</Menu.Item>
            <Menu.Item key="6">option6</Menu.Item>
            <Menu.Item key="7">option7</Menu.Item>
            <Menu.Item key="8">option8</Menu.Item>
          </SubMenu>
          <SubMenu key="sub3" icon={<NotificationOutlined />} title="subnav 3">
            <Menu.Item key="9">option9</Menu.Item>
            <Menu.Item key="10">option10</Menu.Item>
            <Menu.Item key="11">option11</Menu.Item>
            <Menu.Item key="12">option12</Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
      <Layout style={{ padding: '0 24px 24px' }}>
        {/* <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb> */}
        <Content className="site-layout-background">
          <Switch>
            <Route path={`${path}/user`}>
              <User />
            </Route>
            <Route exact strict path={`${path}`}>
              <div>
                <span>{path} </span>
                <hr />
                module1 home
                <hr />
                <span>{url} </span>
                <Link to={`${path}/user`}>user</Link>
                <Button type="primary">
                  <Link to="/login">Login</Link>
                </Button>
                <Link to="/usersss">404</Link>
              </div>
            </Route>
            <Route path={`${path}/*`}>
              <Redirect to="/404" />
            </Route>
          </Switch>
        </Content>
      </Layout>
    </Layout>
  );
};

export default M1Layout;
