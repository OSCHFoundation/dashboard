import React from 'react'
import {Link} from 'react-router-dom'
import Input from 'muicss/lib/react/input';

const InputStyle = { marginLeft: '500px', width:  '400px', paddingLeft: '10px' };
export default class AppBar extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      searchTo: "/404",
      value: ""
    }
    this.changeHangle = this.changeHangle.bind(this);
  }
  changeHangle(event){
    this.setState({
      value: event.target.value,
      searchTo: `/accounts/${event.target.value}`
    });
  }
  render() {
    return <div>
      <div className="mui-appbar" >
        <div className="fl">
          <img  src="https://oschpublicchain.oss-cn-shanghai.aliyuncs.com/dashboard/logo.png" />
        </div>
        <Input className="fl" style={InputStyle} placeholder="请输入你要搜索的内容" value={this.state.value} onChange={this.changeHangle} />
        <Link to={this.state.searchTo} >搜索</Link>
        <div className="fr">
          <a href="https://www.myoschain.com/" >Community</a>
        </div>
      </div>
    </div>
  }
}
