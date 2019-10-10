import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import HttpService from '../services/http-service';
import Role from '../role/role';





const http = new HttpService();
var roleEmpty = true;
//var roleName = "nobody";
var userID = -1;
var result = "nope";
var target = -1;
var roleFind = false;
class App extends Component {

  constructor(props){
    super(props);

    this.state = {roles: []};

    //Bind functions
    this.loadData = this.loadData.bind(this);
    this.roleList = this.roleList.bind(this);
    this.onButtonSelect = this.onButtonSelect.bind(this);
    this.loadSideData = this.loadSideData.bind(this);
    this.onButtonFind = this.onButtonFind.bind(this);

    this.loadData();
  }

  onButtonSelect = () =>{
      var e = document.getElementById("userID");
      userID = e.options[e.selectedIndex].text;
      roleEmpty = false;
      this.forceUpdate();

  }

  onButtonFind = () => {
      var e = document.getElementById("toFindID");
      var toFindID = e.options[e.selectedIndex].text;
      console.log(toFindID);
      this.loadSideData(toFindID);


  }

  loadData = () => {
    var self = this;
    //Scope

    http.getRoles().then(data => {
      self.setState({roles: data})
    }, err => {

    });
  }

  // Find the userSide for seer
  loadSideData = ( targetID ) => {
    target = targetID;
    var self = this;
    http.findPlayerSide(targetID).then(data => {
      console.log("first call stack is "+ data.userSide);
      result = data.userSide;
      target = targetID;
      roleFind = true;
      self.forceUpdate();
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
          <h3>选择你的编号</h3>
            <div className="form-group">
              <label for="exampleFormControlSelect1">Example select</label>
              <select className="form-control" id="userID">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </select>
              <a onClick={() => this.onButtonSelect()} className="btn btn-primary">select number</a>
            </div>
          <h3>选择你的角色</h3>
          <div className="row">
            {roleEmpty ? this.roleList() : (

              <div className="form-group">
                <label for="exampleFormControlSelect1">Example select</label>
                <select className="form-control" id="toFindID">
                  <option>9</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>8</option>
                </select>
                <a onClick={() => this.onButtonFind()} className="btn btn-primary">查验这名玩家</a>
                {roleFind ? (<p>{target}号玩家的身份是{ result }</p>)
                          : (<p>Not yet</p>)}
              </div>
            )}

          </div>

        </div>
      </div>


    );
  }
}

export default App;


///work
