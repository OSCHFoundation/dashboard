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
      tPublic: "",
      public: "",
      sPublic: "",
      tableData: []
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
      let start = publicId.substr(0,7)+"..."+publicId.substr(45,publicId.length);
      this.setState({sPublic: start});
      axios.get(`${this.props.horizonURL}/accounts/${publicId}`)
        .then(res => {
          for(let i in res.data.balances){
            res.data.balances[i].balance = parseInt(res.data.balances[i].balance); 
            if(res.data.balances[i].asset_type == 'native'){
              res.data.balances[i].asset_code = "osch"
            }
          }
          _this.setState({sequence: res.data.sequence});
          _this.setState({balances: res.data.balances});
        })
      StellarSdk.Config.setAllowHttp(true);
      StellarSdk.Network.use(new StellarSdk.Network("osch public network")); 
      let server = new StellarSdk.Server('http://coast.oschain.io');
      server.transactions()
        .forAccount(publicId)
        .call()
        .then(function (page) {
            for(var i=0; i<page.records.length; i++){
              page.records[i].operations().then(function(res){
                res.records[0].created_at =  res.records[0].created_at.substr(5,11);
                if(res.records[0].type === "payment" ){
                  if(res.records[0].asset_code){
                    res.records[0].amount = parseInt(res.records[0].amount) + " "+res.records[0].asset_code;
                  }else{
                    res.records[0].amount = parseInt(res.records[0].amount) + " OSCH";
                  }
                  if(res.records[0].from == publicId){
                    var ob = {
                      time: res.records[0].created_at,
                      operation: res.records[0].transaction_hash, 
                      num: "-"+res.records[0].amount,
                      type: res.records[0].type,
                      to: res.records[0].to,
                      key:  res.records[0].transaction_hash
                    };    
                    let limitArr = _this.state.tableData;
                    limitArr.push(ob);
                    _this.setState({tableData: limitArr});
                  }else{
                    var ob = {
                      time: res.records[0].created_at,
                      operation: res.records[0].transaction_hash, 
                      num: "+"+res.records[0].amount,
                      type: res.records[0].type,
                      to: res.records[0].to,
                      key: res.records[0].transaction_hash
                    };
                    let limitArr = _this.state.tableData;
                    limitArr.push(ob);
                    _this.setState({tableData: limitArr});   
                  }
                }else if(res.records[0].type=="create_account"){
                  res.records[0].starting_balance = parseInt(res.records[0].starting_balance);
                  var ob = {
                    time: res.records[0].created_at,
                    operation: res.records[0].transaction_hash, 
                    num: "+"+res.records[0].starting_balance+" OSCH",
                    type: res.records[0].type,
                    to: res.records[0].to,
                    key: res.records[0].transaction_hash
                  };            
                  let limitArr = _this.state.tableData;
                  limitArr.push(ob);
                  _this.setState({tableData: limitArr});
                }else{
                           
                }
              })
            }
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
        <td>{num.asset_code.toLocaleUpperCase()}</td>
        <td>{num.balance}</td>                    
      </tr>
    )
    let hitoryData = this.state.tableData.map((item)=>
      <tr key={item.key} >                
        <td>{item.time}</td>
        <td>{item.type}</td>
        <td>{item.num}</td>
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
            <div className="widget-name">Address  <span className="greyPublic">{this.state.sPublic}</span><button className="return" onClick={returnMet} >return</button></div>
            <div className="accountDetail">
              <table className="accountTa" >
                <thead>
                  <tr>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {listBalance}
                </tbody>
              </table>
              <h3>Recent transaction history</h3>
              <table className="historyTable">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Type</th>
                    <th>Num</th>
                  </tr>
                </thead>
                <tbody>
                  {hitoryData}
                </tbody>
              </table>
            </div>  
          </Panel>
        }
      </div>
    );
  }
}
