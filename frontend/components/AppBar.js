import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Input, Row, Col } from "antd";
const Search = Input.Search;
const InputStyle = {
  marginTop: "18px",
  marginBottom: "18px",
  paddingLeft: "10px",
  marginLeft: "10px"
};

class AppBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTo: "/404",
      value: ""
    };
    this.changeHangle = this.changeHangle.bind(this);
  }
  changeHangle(event) {
    this.setState({
      value: event.target.value,
      searchTo: `/account/${event.target.value}`
    });
  }
  render() {
    return (
      <div>
        <div className="mui-appbar">
          <Row>
            <Col md={2} xs={4} >
              <Link to="/" className="fl">
                <img src="https://oschpublicchain.oss-cn-shanghai.aliyuncs.com/dashboard/logo.png" />
              </Link>
            </Col>
            <Col md={6} xs={24} >
              <Search
                className="fl"
                style={InputStyle}
                placeholder="input your public"
                onSearch={value => this.props.history.push("/account/" + value)}
                enterButton
              />
            </Col>
            <Col md={2} xs={0} offset={13} >
              <div className="fr">
                <a href="https://www.myoschain.com/">Community</a>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
export default withRouter(AppBar);
