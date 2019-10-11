import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import HttpService from '../services/http-service';
import Role from '../role/role';





const http = new HttpService();
var roleEmpty = true;

//var roleName = "nobody";
var userID = -1;
var userRole = "nope";
var result = "abilityResult";
var ability;
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
    this.onButtonGuard = this.onButtonGuard.bind(this);
    this.onButtonKill = this.onButtonKill.bind(this);
    this.onButtonRevive = this.onButtonRevive.bind(this);
    this.enterNight = this.enterNight.bind(this);
    this.NightVision = this.NightVision.bind(this);
    this.onButtonConfirmUser = this.onButtonConfirmUser.bind(this);
    this.abilityBasedOnRole = this.abilityBasedOnRole.bind(this);

    this.loadData();
  }

  abilityBasedOnRole = ( playerRole ) => {
    switch (playerRole) {
      case "seer":
        return(

          <div className="form-group">
            <select className="form-control" id="toFindID">
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
              <option>6</option>
              <option>7</option>
              <option>8</option>
              <option>9</option>
              <option>10</option>
              <option>11</option>
              <option>12</option>
            </select>
            <a onClick={() => this.onButtonFind()} className="btn btn-primary">查验这名玩家</a>
            <p>被你查验的对象身份是 </p>
          </div>

        );
        break;

      case "werewolf":
        return(
          <div className="form-group">
            <select className="form-control" id="toKillID">
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
              <option>6</option>
              <option>7</option>
              <option>8</option>
              <option>9</option>
              <option>10</option>
              <option>11</option>
              <option>12</option>
            </select>
            <a onClick={() => this.onButtonKill()} className="btn btn-primary">击杀这名玩家</a>

          </div>

        );

        break;
      default:
        return(
          <p>没能力就别瞎掺和了，老实地闭眼！</p>
        );

    }
  }

  onButtonConfirmUser = () => {
     var e = document.getElementById("userID");
     userID = e.options[e.selectedIndex].text;
     var self = this;
     http.findPlayerSide ( userID ).then(data =>{
       userRole = data.userRole;
       console.log("your role is " + userRole + ", your id is " + userID );
       ability = self.abilityBasedOnRole(userRole);
       self.forceUpdate();
     });
   }

// After users confirmed their identities, go to the nigth page.
  enterNight = () => {
    roleEmpty = false;
    this.forceUpdate();
  }

  NightVision = () => {
    return(
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>欢迎来到</h2>
          <h2>Hampshire College</h2>
          <h2>狼人杀官方APP</h2>
        </div>

        <div className="container App-main">

          <h3>吼吼吼，我们又见面了。你看，我这记性不太好，再跟我说说你号码是多少？</h3>
            <div className="form-group">

              <select className="form-control" id="userID">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
                <option>7</option>
                <option>8</option>
                <option>9</option>
                <option>10</option>
                <option>11</option>
                <option>12</option>
              </select>

            </div>

          <a onClick={() => this.onButtonConfirmUser()} className="btn btn-primary">是这个数</a>
        </div>
      </div>


    )
  }

  onButtonSelect = () =>{
      var e = document.getElementById("userID");
      userID = e.options[e.selectedIndex].text;
      roleEmpty = false;
      this.forceUpdate();

  }

//Seer finished
  onButtonFind = () => {
      var e = document.getElementById("toFindID");
      var toFindID = e.options[e.selectedIndex].text;
      this.loadSideData(toFindID);
      this.forceUpdate();
  }

//Guard finished
  onButtonGuard = () => {
      var e = document.getElementById("toGuardID");
      var toGuardID = e.options[e.selectedIndex].text;
      var self = this;
      http.guardOnePlayer ( toGuardID ).then(data =>{
        result = data.userID;
        console.log("Player " + result + "has been guarded.");
        self.forceUpdate();
      });

  }

//Werewolf finished
  onButtonKill = () => {
      var e = document.getElementById("toKillID");
      var toKillID = e.options[e.selectedIndex].text;
      var self = this;
      http.killOnePlayer ( toKillID ).then(data =>{
        result = data.userID;
        console.log("Player " + result + "has been killed.");
        self.forceUpdate();
      });

  }

//Antidote
  onButtonRevive = () => {
      var e = document.getElementById("toReviveID");
      var toReviveID = e.options[e.selectedIndex].text;
      var self = this;
      http.reviveOnePlayer ( toReviveID ).then(data =>{
        result = data.userID;
        console.log("Player " + result + "has been revived.");
        self.forceUpdate();
      });

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
    var self = this;
    http.findPlayerSide(targetID).then(data => {
      result = data.userSide;
      console.log(result);

      self.forceUpdate();
    });


  }

  roleList = () => {
    const list = this.state.roles.map((role) =>
      <div className="col-sm-4" key={role._id}>
        <Role userRole={role.userRole} imgUrl={role.imgUrl} userSide={role.userSide}></Role>
      </div>
    );

    return (list);
  }

  render() {
    if (roleEmpty){
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

                <select className="form-control" id="userID">
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>
                  <option>8</option>
                  <option>9</option>
                  <option>10</option>
                  <option>11</option>
                  <option>12</option>
                </select>

              </div>
            <h3>选择你的角色</h3>
            <div className="row">
              {this.roleList()}
            </div>
            <a onClick={() => this.enterNight()} className="btn btn-primary">进入黑夜</a>
          </div>
        </div>

      );
    } else if (userID == -1 ){
      return (

          this.NightVision()


      )
    } else {
      return (
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>欢迎来到</h2>
            <h2>Hampshire College</h2>
            <h2>狼人杀官方APP</h2>
          </div>
          <div>{ability}</div>
          <p>{result}</p>
        </div>

      )
    }

  }
}

export default App;


///work
