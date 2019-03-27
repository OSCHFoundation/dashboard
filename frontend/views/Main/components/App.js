import React from 'react';
import Panel from 'muicss/lib/react/panel';
import Button from 'muicss/lib/react/button';
import {EventEmitter} from 'fbemitter';
import axios from 'axios';
import {Server} from 'stellar-sdk';
import {Config} from 'stellar-sdk';
import AppBar from '../../../components/AppBar';
import NetworkStatus from './NetworkStatus';
import ShowAccount from './ShowAccount';
import Nodes from './Nodes';
import LedgerCloseChart from './LedgerCloseChart';
import RecentOperations from './RecentOperations';
import TransactionsChart from './TransactionsChart';
import {LIVE_NEW_LEDGER, TEST_NEW_LEDGER} from '../events';

const horizonLive = "http://coast.myoschain.com";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.chrome57 = navigator.userAgent.toLowerCase().indexOf('chrome/57') > -1;
    this.emitter = new EventEmitter();
    this.sleepDetector();
    // forceTheme is our way to celebrate May, 4th.
    var forceTheme = false;
    var may4 = false;

    var now = new Date();
    var d = now.getDate();
    var m = now.getMonth()+1;
    var y = now.getFullYear();
    if (d == 4 && m == 5) {
      forceTheme = true;
      may4 = true;
    }

    // TLJ
    if (d == 9 && m == 12 && y == 2017) {
      forceTheme = true;
    }
    // For testing
    if (localStorage.getItem('forceTheme') != null) {
      forceTheme = true;
      may4 = true;
    }
    this.state = {forceTheme, may4};
  }
  componentDidMount() {
    Config.setAllowHttp(true);
    this.streamLedgers(horizonLive, LIVE_NEW_LEDGER);
    //this.streamLedgers(horizonTest, TEST_NEW_LEDGER);
  }
  reloadOnConnection() {
    return axios.get('https://s3-us-west-1.amazonaws.com/stellar-heartbeat/index.html', {timeout: 5*1000})
      .then(() => location.reload())
      .catch(() => setTimeout(this.reloadOnConnection.bind(this), 1000));
  }
  sleepDetector() {
    if (!this.lastTime) {
      this.lastTime = new Date();
    }

    let currentTime = new Date();
    if (currentTime - this.lastTime > 10*60*1000) {
      this.setState({sleeping: true});
      this.reloadOnConnection();
      return;
    }

    this.lastTime = new Date();
    setTimeout(this.sleepDetector.bind(this), 5000);
  }
  streamLedgers(horizonURL, eventName) {
    // Get last ledger
    var _this = this;
    axios.get(`${horizonURL}/ledgers?order=desc&limit=1`)
      .then(response => {
        let lastLedger = response.data._embedded.records[0];
        new Server(horizonURL).ledgers().cursor(lastLedger.paging_token)
          .stream({
            onmessage: function ledger(ledger1){
                _this.emitter.emit(eventName, ledger1);
            } 
          });
      });
  }

  turnOffForceTheme() {
    this.setState({forceTheme: false});
    return false;
  }

  render() {
    return (
      <div id="test" className={this.state.forceTheme ? "force" : null}>
        
        {this.chrome57 ? 
          <Panel>
            <div className="mui--text-subhead mui--text-dark-secondary">
              You are using Chrome 57. There is a <a href="https://bugs.chromium.org/p/chromium/issues/detail?id=707544" target="_blank">known bug</a> that
              makes the Dashboard app consume extensive amounts of memory. Please switch to any other browser or wait for a fix by a Chromium team.
            </div>
          </Panel>
          :
          null
        }
        {this.state.sleeping ?
          <Panel>
            <div className="mui--text-subhead mui--text-accent">System sleep detected. Waiting for internet connection...</div>
          </Panel>
          :
          null
        }
        {this.state.forceTheme && this.state.may4 ?
          <h1 className="may4">May the 4<sup>th</sup> be with you!</h1>
          :
          null
        }
        <div id="main" className="mui-container-fluid">
            <section>
                <h1>Open Source Chain Dashboard</h1>
                <div className="row">
                  <div className="mui-col-md-8">
                    <NetworkStatus
                      network="Live network"
                      horizonURL={horizonLive}
                      newLedgerEventName={LIVE_NEW_LEDGER}
                      emitter={this.emitter}
                    />
                    <LedgerCloseChart
                      network="Live network"
                      horizonURL={horizonLive}
                      limit="200"
                      newLedgerEventName={LIVE_NEW_LEDGER}
                      emitter={this.emitter}
                      />
                    <TransactionsChart
                      network="Live network"
                      horizonURL={horizonLive}
                      limit="200"
                      newLedgerEventName={LIVE_NEW_LEDGER}
                      emitter={this.emitter}
                      />
                  </div>
                  <div className="mui-col-md-4">
                    <ShowAccount
                      network="Live network"
                      horizonURL={horizonLive}
                      newLedgerEventName={LIVE_NEW_LEDGER}
                      emitter={this.emitter}
                    />
                    <RecentOperations
                        limit="25"
                        label="Live network"
                        horizonURL={horizonLive}
                        emitter={this.emitter}
                    />
                  </div>
                  
                </div>
            </section>
            <section>
                <h1>Featured live network nodes</h1>
                <Nodes />
            </section>
        </div>
      </div>
    );
  }
}