import React from 'react';
import './App.less';
import { Route, Switch } from 'react-router-dom';
import AppLayout from './pages/layout/AppLayout';
import NotFound from './pages/outside/NotFound';
import Login from './pages/outside/login';

const App = () => {
  return (
    <Switch>
      <Route exact strict path="/404">
        <NotFound />
      </Route>
      <Route exact strict path="/login">
        <Login />
      </Route>
      <Route path="/">
        <AppLayout />
      </Route>
    </Switch>
  );
};

export default App;
