import React, { Component } from 'react';
import './role.css';

import HttpService from '../services/http-service';

let http = new HttpService();
var roleEmpty = true;
var userID = -1;
class Role extends Component {

  constructor(props) {
      super(props);

      this.createPlayerButton = this.createPlayerButton.bind(this);
  }

  createPlayerButton = () => {
      var e = document.getElementById("userID");
      userID = e.options[e.selectedIndex].text;
      var self = this;
      http.createPlayer(userID, this.props).then(data =>{
        roleEmpty = false;
        self.forceUpdate();
      }, err =>{

      });

  }

  render() {
    if (roleEmpty) {
      return (
        <div className="card role">
          <img className="card-img-top" src={this.props.imgUrl} alt="role"></img>
          <div className="card-block">
            <a onClick={() => this.createPlayerButton()} className="btn btn-primary">Confirm</a>
          </div>
        </div>
      );
    } else {
      return (
        <div className="card role">
          <img className="card-img-top" src={this.props.imgUrl} alt="role"></img>
          <div className="card-block">
            <p>你的角色为{this.props.userRole}，号码为{userID}。确认后请点击进入黑夜来隐藏你的身份。</p>
          </div>
        </div>
      );
    }

  }
}

export default Role;
