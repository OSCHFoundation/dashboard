import React from 'react';
import Button from 'muicss/lib/react/button';

export default class AppBar extends React.Component {
  render() {
    return <div>
      <div className="mui-appbar">
        <div className="left">
          <div className="back"><a href="http://www.myoschain.com">&laquo; myoschain.com</a></div>
          <div className="mui--text-headline">Open Source Chain Dashboard</div>
        </div>
        <div className="icons">
          <div className="icon">
          </div>
          {
            this.props.forceTheme
            ?
            <div className="icon">
              <a href="#" onClick={this.props.turnOffForceTheme}>
                <i className="material-icons">star_border</i><br />
                Turn off the Force theme
              </a>
            </div>
            :
            null
          }
        </div>
      </div>
    </div>
  }
}
