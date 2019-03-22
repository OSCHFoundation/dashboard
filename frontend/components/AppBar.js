import React from 'react';
import Button from 'muicss/lib/react/button';


export default class AppBar extends React.Component {
  render() {
    return <div>
      <div className="mui-appbar">
        <div className="fl">
          <img  src="https://oschpublicchain.oss-cn-shanghai.aliyuncs.com/dashboard/logo.png" />
        </div>
        <div className="fr">
          <a href="https://www.myoschain.com/">Community</a>
        </div>
      </div>
    </div>
  }
}
