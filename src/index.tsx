import React from 'react';
import ReactDOM from 'react-dom';
import '@/assets/styles/index.less';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import locale from 'antd/es/locale/zh_CN';
import { ConfigProvider } from 'antd';

ReactDOM.render(
  <BrowserRouter>
    <ConfigProvider locale={locale}>
      <App />
    </ConfigProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
