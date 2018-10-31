import React from 'react';
import Panel from 'muicss/lib/react/panel';
import axios from 'axios';
import round from 'lodash/round';
import {ago} from '../common/time';

// ledgersInAverageCalculation defines how many last ledgers should be
// considered when calculating average ledger length.
const ledgersInAverageCalculation = 200;
export default class NetworkStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      balances: [],
      sequence: 0,
      tPublic: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.findPublic = this.findPublic.bind(this);
  }
  handleChange(event){
    this.setState({tPublic: event.target.value});
  }
  findPublic(){
    window.location.href="/"+"?public="+this.state.tPublic;
  }
  getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
      return unescape(r[2]);
    }
    return null;
  }
  componentDidMount() {
    var _this = this;
    let publicId = this.getQueryString("public");
    if(publicId){
      this.setState({isPublic: true});
      this.setState({public: publicId});
      axios.get(`${this.props.horizonURL}/accounts/${publicId}`)
        .then(res => {
          console.log(res.data);
          for(let i in res.data.balances){
            if(res.data.balances[i].asset_type == 'native'){
              res.data.balances[i].asset_code = "osch"
            }
          }
          _this.setState({sequence: res.data.sequence});
          _this.setState({balances: res.data.balances});
        })
    }
    
  }
  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  render() {
    let statusClass;
    let statusText;
    function returnMet(){
      window.location.href="/";
    }

    const listBalance = this.state.balances.map((num)=>
      <tr key={num.asset_code}>
        <td>{num.asset_code}</td>
        <td>{num.balance}</td>                    
      </tr>
    )
    return (
      <div>
        {!this.state.isPublic ?
          <Panel>
            <div className="widget-name">please your account public </div>
            <div className="publicBox">
              <input type="text"  name="name" value={this.state.tPublic} onChange={this.handleChange} placeholder="PLEASE YOUR ACCOUNT PUBLIC" />
              <button onClick={this.findPublic}>Go</button>
            </div>  
          </Panel>
          :
          <Panel>
            <div className="widget-name">Address  <span className="greyPublic">{this.state.public}</span><button className="return" onClick={returnMet} >return</button></div>
            <div className="accountDetail">
              <table className="accountTa" >
                <thead>
                  <tr>
                    <th>Overview</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {listBalance}
                </tbody>
              </table>
            </div>  
          </Panel>
        }
      </div>
    );
  }
}
