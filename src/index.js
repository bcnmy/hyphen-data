import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from 'react-redux'
import store from './redux/store'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

ReactDOM.render(
  <Provider store={store}>
    <Router>
        <Switch>
            <Route path="/">
                <App />
            </Route>
        </Switch>
    </Router>
  </Provider>,
  document.getElementById("root")
);
