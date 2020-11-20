import React, { useEffect, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import loadable from '@loadable/component';
import AppLayout from './pages/layout/AppLayout';
import Login from './pages/outside/login';
import { getToken, refreshToken } from './services/auth';
const NotFound = loadable(props => import(/* webpackChunkName: "NotFound" */ './pages/outside/NotFound'));
const TestPage = loadable(props => import(/* webpackChunkName: "test" */ './pages/outside/test'));

export default function App() {
  const history = useHistory();
  let [authProps, setAuthProps] = useState({ isReady: false, isLogined: false });

  useEffect(() => {
    // excute when component mount
    let accessToken: string = getToken();
    // accessToken => {
    setAuthProps({ isReady: true, isLogined: !!accessToken });
    // });
    // refreshToken().then(accessToken => {
    //   setAuthProps({ isReady: true, isLogined: !!accessToken });
    // });
  }, []);

  function onLogined(path: string) {
    setAuthProps({ isReady: true, isLogined: true });
    history.push(path);
  }
  return (
    <Switch>
      <Route exact strict path="/404">
        <NotFound />
      </Route>
      <Route exact strict path="/login">
        <Login onLogined={onLogined} />
      </Route>
      <Route exact strict path="/test">
        <TestPage />
      </Route>
      <Route path="/">
        <AppLayout authProps={authProps} />
      </Route>
    </Switch>
  );
}
