import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import AppBar from '../../components/AppBar'
import Main from '../Main'
import Accounts from '../Accounts'

export default class App extends Component {
  render() {
    return (
      <div id="id">
        <AppBar />
        <Switch>
          <Route exact path='/' component={Main} />
          <Route path='/accounts/:accountId' component={Accounts} />
        </Switch>
      </div>
    )
  }
}
