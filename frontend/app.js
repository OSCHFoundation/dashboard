import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, HashRouter } from 'react-router-dom'
import App from './views/App';

require('./index.html');
require('./scss/index.scss');

ReactDOM.render(
  <HashRouter>
    <App></App>
  </HashRouter>,
  document.getElementById('app')
);
