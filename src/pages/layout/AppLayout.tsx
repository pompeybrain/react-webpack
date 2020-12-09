import { Layout, Spin } from 'antd';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Home from '../home/Home';
import AppHeader from './AppHeader';

interface authProps {
  isReady: boolean;
  isLogined: boolean;
}

export default function AppLayout({ authProps: { isReady, isLogined } }: { authProps: authProps }) {
  let layout = (
    <Layout className="app-layout">
      <AppHeader></AppHeader>
      <Layout>
        <Switch>
          <Route exact strict path="/">
            <Home />
          </Route>
          <Route path="*">
            <Redirect to="/404" />
          </Route>
        </Switch>
      </Layout>
    </Layout>
  );

  console.log('render applayout');

  if (isReady) {
    return isLogined ? layout : <Redirect to="/login" />;
  } else {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          margin: 'auto',
          paddingTop: 50,
          textAlign: 'center',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }
}
