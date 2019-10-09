import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import HttpService from '../services/http-service';
import Role from '../role/role';


import hunter  from './imgs/hunter.jpg';
import seer  from './imgs/seer.jpg';
import werewolf  from './imgs/werewolf.jpg';
import villager  from './imgs/villager.jpg';



const http = new HttpService();


class App extends Component {

  constructor(props){
    super(props);

    this.state = {roles: []};

    //Bind functions
    this.loadData = this.loadData.bind(this);
    this.roleList = this.roleList.bind(this);


    this.loadData();
  }

  loadData = () => {
    var self = this;
    //Scope

    http.getRoles().then(data => {
      self.setState({roles: data})
    }, err => {

    });
  }

  roleList = () => {
    const list = this.state.roles.map((role) =>
      <div className="col-sm-4" key={role._id}>
        <Role name={role.userRole} imgUrl={role.imgUrl}></Role>
      </div>
    );

    return (list);
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>欢迎来到</h2>
          <h2>Hampshire College</h2>
          <h2>狼人杀官方APP</h2>
        </div>

        <div className="container App-main">
          <h3>选择你的角色</h3>
          <div className="row">
            {this.roleList()}
          </div>
        </div>
      </div>


    );
  }
}

export default App;


///work
