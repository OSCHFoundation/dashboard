import React from 'react';
import Button from 'muicss/lib/react/button';


export default class AppBar extends React.Component {
  render() {
    return <div>
      <div className="mui-appbar">
        <div className="left">
          <img  src="https://oschpublicchain.oss-cn-shanghai.aliyuncs.com/dashboard/logo.png" />
        </div>
      </div>
    </div>
  }
}
