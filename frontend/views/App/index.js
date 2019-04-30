import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import AppBar from '../../components/AppBar'
import Main from '../Main'
import Accounts from '../Accounts'
import { Config, Network} from "osch-sdk";
Config.setAllowHttp(true);
Network.use(new StellarSdk.Network("osch public network")); 

export default class App extends Component {
  render() {
    return (
      <div id="id">
        <AppBar />
        <Switch>
          <Route exact path='/' component={Main} />
          <Route path='/account/:accountId' component={Accounts} />
        </Switch>
      </div>
    )
  }
}
