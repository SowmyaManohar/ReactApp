import React, { Component } from "react";
import routes from '../routes'
import logger from "../services/logService";

import httpService from "../services/httpService";
import jwtDecode from 'jwt-decode';
import { setCurrentUser, logoutUser } from "../actions/authActions"

import { Provider } from 'react-redux';
import { BrowserRouter as Router, HashRouter } from 'react-router-dom';
import configureStore from '../store';
import { PersistGate } from 'redux-persist/integration/react';
import Loading from './common/Loading'

import config from "../config.json";
import "../App.css";

const { persistor, store } = configureStore();
const tokenKey = config.tokenKey;
// Require re-login 2 days before the token expires on server side
// Avoid failure due to token expiration when user is working
const TOKEN_LIFETIME_BUFFER = 86400 * 2;
let ApiEndpointURL = "http://hgnrestdev.azurewebsites.net/api"

// Check for token
if (localStorage.getItem(tokenKey)) {
  // Decode token and get user info and exp
  const decoded = jwtDecode(localStorage.getItem(tokenKey));
  // Check for expired token
  const currentTime = Date.now() / 1000;
  const expiryTime = new Date(decoded.expiryTimestamp).getTime() / 1000;
  console.log(currentTime, expiryTime);
  if (expiryTime - TOKEN_LIFETIME_BUFFER < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
  }
  else {
    // Set auth token header auth
    httpService.setjwt(localStorage.getItem(tokenKey));
    // Set user and isAuthenticated
    store.dispatch(setCurrentUser(decoded));
  }
}

class App extends Component {
  state = {};

  // confirmAlert(e) {
  //   e.preventDefault();
  //   return e.returnValue = "Are you sure you want to leave?\nPlease don't forget to log your time!";
  // }

  componentDidMount() {
    fetch('/config.json')
      .then(response => response.json())
      .then((data) => {
        ApiEndpointURL = data.restapi;
      });
  }

  // componentWillUnmount() {
  //   window.removeEventListener('beforeunload', this.confirmAlert);
  // }

  componentDidCatch(error, errorInfo) {
    logger.logError(error);
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={<Loading />} persistor={persistor}>
          <HashRouter>
            {routes}
          </HashRouter>
        </PersistGate>
      </Provider>
    );
  }
}

export { ApiEndpointURL };
export default App;
