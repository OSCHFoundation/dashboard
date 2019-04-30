import React, { Component } from "react";
import Panel from "muicss/lib/react/panel";
import { Server } from "osch-sdk";
import { Table, Divider, Tag, Statistic } from "antd";
import "antd/dist/antd.css";
import zhCN from "antd/lib/locale-provider/zh_CN";
import axios from "axios";

const columns = [
  {
    title: "交易时间",
    dataIndex: "created_at",
    key: "created_at",
    width: 150
  },
  {
    title: "交易金额",
    dataIndex: "amount",
    key: "amount",
    width: 100
  },
  {
    title: "交易号",
    dataIndex: "transaction_hash",
    key: "transaction_hash",
    width: 100,
    render: text => <a href={"http://coast.oschain.io/transactions/"+text} >{text}</a>
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
    this.accountId  = this.props.match.params.accountId;

    const server = new Server("http://coast.myoschain.com");
    server.loadAccount(this.accountId).then(res => {
      const balances = res.balances; 
      balances.map((item)=>{
        console.log(item);
        if(item.asset_type === "native"){
          item.asset_code = "OSCH";
        }
        item.asset_code = item.asset_code.toUpperCase();
        return item;
      })
      this.setState({
        balances
      })
    });
    server
      .operations()
      .forAccount(this.accountId)
      .call()
      .then((page) => {
        let operations = page.records;
        operations = operations.filter(item => {
          item.created_at = item.created_at.substr(5, 11);
          if (item.type === "payment") {
            if (item.asset_code) {
              item.amount = parseInt(item.amount) + " " + item.asset_code;
            } else {
              item.amount = parseInt(item.amount) + " OSCH";
            }
            if(item.from === this.accountId){
              item.amount = "+ "+item.amount;
            }else{
              item.amount = "- "+item.amount;
            }
            return true;
          }
          if (item.type == "create_account"){
            item.amount = parseInt(item.starting_balance)+ " OSCH";
            item.from = item.source_account;
            item.to = item.account;
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
      console.log(item);
      return (
        <Statistic className="fl" key={item.asset_code} title={"Account Balance "+item.asset_code} value={item.balance} precision={2} />
      )
    })
    return (
      <Panel>
        <div>
          <p>public: {this.accountId}</p>
          <div className="balanceBox">{BalancesArr}</div> 
          <Table columns={columns} dataSource={operations} width="400" />,
        </div>
      </Panel>
    );
  }
}
