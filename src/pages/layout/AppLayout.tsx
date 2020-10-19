import { Layout, Menu } from 'antd';
import React from 'react';
import { Link, Redirect, Route, Switch } from 'react-router-dom';
import Home from '../home/home';
import M1Layout from '../modules/module1/layout';

const { Header } = Layout;
const AppLayout = () => {
  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
        <Menu mode="horizontal" defaultSelectedKeys={['m1']}>
          <Menu.Item key="module1">
            <Link to="/m1">module1</Link>
          </Menu.Item>
          <Menu.Item key="module2">
            <Link to="/m2">module2</Link>
          </Menu.Item>
          <Menu.Item key="3">module 3</Menu.Item>
        </Menu>
      </Header>
      <Layout>
        <Switch>
          <Route exact strict path="/">
            <Home />
          </Route>
          <Route path="/m1">
            <M1Layout />
          </Route>
          <Route path="*">
            <Redirect to="/404" />
          </Route>
        </Switch>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
