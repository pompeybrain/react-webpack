import React from 'react';
import './App.less';
import { Route, Switch } from 'react-router-dom';
import loadable from '@loadable/component';
import AppLayout from './pages/layout/AppLayout';
import Login from './pages/outside/login';
const NotFound = loadable((props) => import('./pages/outside/NotFound'));
const TestPage = loadable((props) => import('./pages/outside/test'));

const App = () => {
  return (
    <Switch>
      <Route exact strict path="/404">
        <NotFound />
      </Route>
      <Route exact strict path="/login">
        <Login />
      </Route>
      <Route exact strict path="/test">
        <TestPage />
      </Route>
      <Route path="/">
        <AppLayout />
      </Route>
    </Switch>
  );
};

export default App;
