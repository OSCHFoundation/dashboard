import React, { Component } from "react";
import Panel from "muicss/lib/react/panel";
import { Server, StrKey } from "osch-sdk";
import { Table, Divider, Tag, Statistic, message } from "antd";
import "antd/dist/antd.css";
import zhCN from "antd/lib/locale-provider/zh_CN";
import axios from "axios";
import "./style.css";
const columns = [
  {
    title: "交易时间",
    dataIndex: "created_at",
    key: "created_at",
    width: 120
  },{
    title: "账户",
    dataIndex: "account",
    key: "account",
    width: 500,
    render: text => <a href={"http://coast.oschain.io/accounts/"+text} >{text}</a>
  },
  {
    title: "交易金额",
    dataIndex: "amount",
    key: "amount",
    width: 115
  },
  {
    title: "交易号",
    dataIndex: "id",
    key: "id",
    render: text => <a href={" http://coast.oschain.io/operations/"+text} >{text}</a>
  }
];
export default class Accounts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      operations: [],
      balances: []
    };
    this.accountId;
  }
  componentDidMount() {
    this.accountId  = this.props.match.params.accountId.trim();
    if(!StrKey.isValidEd25519PublicKey(this.accountId)){
      message.error("你的公钥格式有错");
      setTimeout(() => {
        location="/";
      }, 2000);
    }
    const server = new Server("http://coast.myoschain.com");
    server.loadAccount(this.accountId).then(res => {
      let { balances } = res;
      for(let i in balances){
        if(balances[i].asset_type === "native"){
          balances[i].asset_code = "OSCH";
          let c = balances[i];
          balances[i] = balances[0];
          balances[0] = c;
        }
        balances[i].asset_code = balances[i].asset_code.toUpperCase();
      } 
      
      this.setState({
        balances
      })
    });
    server
      .operations()
      .forAccount(this.accountId)
      .limit(100)
      .order("desc")
      .call()
      .then((page) => {
        let operations = page.records;
        operations = operations.filter(item => {
          item.created_at = item.created_at.substr(5, 11);
          if (item.type === "payment") {
            if (item.asset_code) {
              item.amount = parseInt(item.amount) + " " + item.asset_code.toUpperCase();
            } else {
              item.amount = parseInt(item.amount) + " OSCH";
            }
            if(item.from === this.accountId){
              item.amount = "-"+item.amount;
              item.account = item.to;
            }else{
              item.amount = "+"+item.amount;
              item.account = item.from;
            }
            return true;
          }
          if (item.type == "create_account"){
            item.amount = parseInt(item.starting_balance) + " OSCH";
            item.from = item.source_account;
            item.to = item.account;
            if(item.from === this.accountId){
              item.amount = "+ "+item.amount;
              item.account = item.to;
            }else{
              item.amount = "- "+item.amount;
              item.account = item.from;
            }
            return true;
          }
          return false;
        });
        this.setState({
          operations
        })
      });
  }
  render() {
    const {operations, balances} = this.state;
    const BalancesArr =  balances.map((item)=>{
      item.balance = parseFloat(item.balance).toFixed(2);
      return (
        <div key={item.asset_code}>
          <p>{"Your Balance "+item.asset_code}</p>
          <h4>{item.balance}</h4> 
        </div>
      )
    })
    return (
      <Panel id="accountBody">
          <p>Your public key:</p>
          <h4>{this.accountId}</h4>
          <div className="balanceBox">{BalancesArr}</div> 
          <Table columns={columns} dataSource={operations} pagination={false} />,
      </Panel>
    );
  }
}
