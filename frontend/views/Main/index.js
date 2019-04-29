import React from "react";
import Panel from "muicss/lib/react/panel";
import { EventEmitter } from "fbemitter";
import axios from "axios";
import { Server, Config } from "osch-sdk";
import NetworkStatus from "./components/NetworkStatus";
import OldNetstatus from "./components/OldNetstatus";
import ShowAccount from "./components/ShowAccount";
import Nodes from "./components/Nodes";
import LedgerCloseChart from "./components/LedgerCloseChart";
import RecentOperations from "./components/RecentOperations";
import TransactionsChart from "./components/TransactionsChart";

import { LIVE_NEW_LEDGER, TEST_NEW_LEDGER } from "../../events";

const horizonLive = "http://coast.myoschain.com";
const horizonTest = "http://tcoast.myoschain.com";
export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.emitter = new EventEmitter();
    this.sleepDetector();
    this.state = {};
  }
  componentDidMount() {
    Config.setAllowHttp(true);
    this.streamLedgers(horizonLive, LIVE_NEW_LEDGER);
    //this.streamLedgers(horizonTest, TEST_NEW_LEDGER);
  }
  reloadOnConnection() {
    return axios
      .get(horizonLive, {
        timeout: 5 * 1000
      })
      .then(() => location.reload())
      .catch(() => setTimeout(this.reloadOnConnection.bind(this), 1000));
  }
  sleepDetector() {
    if (!this.lastTime) {
      this.lastTime = new Date();
    }
    let currentTime = new Date();
    if (currentTime - this.lastTime > 10 * 60 * 1000) {
      this.setState({ sleeping: true });
      this.reloadOnConnection();
      return;
    }
    this.lastTime = new Date();
    setTimeout(this.sleepDetector.bind(this), 5000);
  }
  streamLedgers(horizonURL, eventName) {
    // Get last ledger
    var _this = this;
    axios.get(`${horizonURL}/ledgers?order=desc&limit=1`).then(response => {
      let lastLedger = response.data._embedded.records[0];
      new Server(horizonURL)
        .ledgers()
        .cursor(lastLedger.paging_token)
        .stream({
          onmessage: function ledger(ledger1) {
            _this.emitter.emit(eventName, ledger1);
          }
        });
    });
  }

  render() {
    return (
      <div id="main">
        {this.state.sleeping ? (
          <Panel>
            <div className="mui--text-subhead mui--text-accent">
              System sleep detected. Waiting for internet connection...
            </div>
          </Panel>
        ) : null}
        <div id="main" className="mui-container-fluid">
          <section>
            <h1>Open Source Chain Dashboard</h1>
            <div className="row clear">
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
          <section>
            <h1>Test network status</h1>
            <div className="mui-col-md-8">
            
              <OldNetstatus
                network="Test network"
                horizonURL={horizonTest}
                newLedgerEventName={TEST_NEW_LEDGER}
                emitter={this.emitter}
              />
             
              <LedgerCloseChart
                network="Test network"
                horizonURL={horizonTest}
                limit="100"
                newLedgerEventName={TEST_NEW_LEDGER}
                emitter={this.emitter}
              />
              <TransactionsChart
                network="Test network"
                horizonURL={horizonTest}
                limit="100"
                newLedgerEventName={TEST_NEW_LEDGER}
                emitter={this.emitter}
              />
            </div>
            <div className="mui-col-md-4">
              <RecentOperations
                limit="25"
                label="Test network"
                horizonURL={horizonTest}
                emitter={this.emitter}
              />
            </div>
          </section>
        </div>
      </div>
    );
  }
}
