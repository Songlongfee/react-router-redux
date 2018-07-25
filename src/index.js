import React from "react";
import { render } from "react-dom";
import "antd/dist/antd.css";
import "./index.css";
import { LocaleProvider } from "antd";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import "moment/locale/zh-cn";
import { Provider } from 'react-redux';
import store from './store/index';
import registerServiceWorker from "./registerServiceWorker";
import App from './pages/index';

render(
  <Provider store={store}>
    <LocaleProvider locale={zh_CN}>
      <App />
    </LocaleProvider>
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
