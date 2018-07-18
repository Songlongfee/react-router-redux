import React from "react";
import { render } from "react-dom";
import "antd/dist/antd.css";
import "./index.css";
import { LocaleProvider } from "antd";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import "moment/locale/zh-cn";
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';
import store from './store/index';
import * as roleListAction from './actions/roleListAction';
import registerServiceWorker from "./registerServiceWorker";
import App from './pages/index';

function mapStateToProps(state) {
	return { state }
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(roleListAction, dispatch)
	}
}

const Apps = connect(mapStateToProps, mapDispatchToProps)(App)

render(
  <Provider store={store}>
    <LocaleProvider locale={zh_CN}>
      <Apps />
    </LocaleProvider>
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
