import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import HttpService from '../services/http-service';
import Role from '../role/role';
import io from 'socket.io-client';
// 413-527-2388
// RT
const shortid = require('shortid');

const socket = io('http://10.0.0.46:3004');
const http = new HttpService();
var roleEmpty = true;

//守卫 完成功能跳转 女巫自救 bug


//var roleName = "nobody";
var userID = -1;
const userUniqueID = shortid.generate();
var userRole = "nope";
var result = "abilityResult";
var ability;
var htmlContent = (<div></div>);
var witchRevive = true;
var witchPoison = true;
var lastNight = -1;

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
    this.onButtonConfirmUser = this.onButtonConfirmUser.bind(this);
    this.abilityBasedOnRole = this.abilityBasedOnRole.bind(this);
    this.onButtonPoison = this.onButtonPoison.bind(this);
    this.waitForDay = this.waitForDay.bind(this);
    this.enterDay = this.enterDay.bind(this);
    this.dontRevive = this.dontRevive.bind(this);

    this.loadData();

  }


//jia加入 女巫



  waitForDay() {

    if (userID == 1) {
      htmlContent = (
        <div>
          <h4>请等待黑夜结束，带领所有人进入白天</h4>
          <a onClick={() => this.enterDay()} className="btn btn-primary">白夜追凶</a>
        </div>
      );
    } else {
      htmlContent = (
      <div>
        <h4>白天和黑夜，只交替没交换</h4>
      </div>);
    }

    this.forceUpdate();
  }

  enterDay() {
    socket.emit("enterDay", "wake up everyone!");
  }

  nightResult(poisonID, killID) {
    var firstPlayer, secondPlayer;
    if (poisonID == -1) {
      firstPlayer  = "";
    } else {
      firstPlayer = poisonID;
    }
    if (killID == -1) {
      secondPlayer  = "";
    } else {
      secondPlayer = killID;
    }
    htmlContent = (
      <div>
        <h4>昨晚死亡的玩家是{firstPlayer}{secondPlayer}</h4>
      </div>);
    this.forceUpdate();
  }






  componentDidMount() {
    var self = this;
      socket.on('werewolf', function(toKillID){
        console.log("werewolf recieved. " + userRole);
        if (userRole == "witch" && witchRevive){
          lastNight = toKillID;
          htmlContent= (<div>
                          <h4>昨晚死亡的是，{toKillID}号玩家。是否使用解药</h4>
                          <a onClick={() => self.onButtonRevive()} className="btn btn-primary">是</a>
                          <a onClick={() => self.dontRevive()} className="btn btn-primary">否</a>
                        </div>
        );
          self.forceUpdate();
        }

      });

      socket.on('enterDay', function(poison, kill){
        var poisonID, killID;
        if (poison == -1) {
          poisonID = " ";
        } else {
          poisonID = poison;
        }

        if (kill == 0) {
          killID = " ";
        } else {
          killID = kill;
        }

        htmlContent = (
          <div>
            <h4>昨晚死亡的玩家是:{killID}{poisonID}</h4>
            <a onClick={() => self.enterNight()} className="btn btn-primary">进入黑夜</a>
          </div>);
        self.forceUpdate();
        console.log(`kill is ${killID} poison is ${poisonID}`);
      });
  }

  dontRevive = () => {
      witchRevive = false;
      htmlContent = this.abilityBasedOnRole ( userRole );
      this.forceUpdate();
      witchRevive = true;
      console.log("called");
  }

  abilityBasedOnRole = ( playerRole ) => {
    switch (playerRole) {
      case "seer":
        return(
          <div className="form-group">
              <div>
                <h3>你好，{playerRole}, 我们又见面了</h3>
              </div>
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
          </div>
        );
        break;

      case "werewolf":
        return(
          <div className="form-group">
            <div>
              <h3>你好，{playerRole}, 我们又见面了</h3>
            </div>
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

        case "guard":
          return(
            <div className="form-group">
              <div>
                <h3>你好，{playerRole}, 我们又见面了</h3>
              </div>
              <select className="form-control" id="toGuardID">
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
              <a onClick={() => this.onButtonGuard()} className="btn btn-primary">守卫这名玩家</a>
            </div>
          );
          break;

          case "witch":
            if (witchRevive) {
              return(
                <div>等待狼人确认击杀目标</div>
              );
            } else if (witchPoison){
              return(
                <div className="form-group">
                  <div>
                    <h3>你好，{playerRole}, 我们又见面了,你现在只剩一瓶毒药，</h3>
                  </div>
                  <select className="form-control" id="toPoisonID">
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
                  <a onClick={() => this.onButtonPoison()} className="btn btn-primary">毒死这名玩家</a>
                </div>
              );
            } else {
              return(<div>没药了。。。</div>);

            }
            break;
      default:
        return(
          <p>没能力就别瞎掺和了，老实地闭眼！</p>
        );

    }
  }

  onButtonPoison = () => {
    if (witchPoison) {
      var e = document.getElementById("toPoisonID");
      var toPoisonID = e.options[e.selectedIndex].text;
      witchPoison = false;
      socket.emit("poison", toPoisonID);
      this.waitForDay();
    } else {
      this.waitForDay();
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
    if (userID == -1) {
      var self = this;
      var e = document.getElementById("userID");
      userID = e.options[e.selectedIndex].text;
      http.findPlayer(userUniqueID).then(data => {
        userRole = data.userRole;
        htmlContent = self.abilityBasedOnRole(userRole);
        self.forceUpdate();
      });
    } else {
      htmlContent = this.abilityBasedOnRole(userRole);
      this.forceUpdate();
    }

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
      socket.emit("guard", toGuardID);
      console.log("guared");
      this.waitForDay();

  }

//Werewolf finished
  onButtonKill = () => {
      var e = document.getElementById("toKillID");
      var toKillID = e.options[e.selectedIndex].text;

      socket.emit('werewolf', toKillID);
      var self = this;
      http.killOnePlayer ( toKillID ).then(data =>{
        result = data.userID;
        console.log("Player " + result + "has been killed.");
        self.forceUpdate();
      });
      this.waitForDay();
  }

//Antidote
  onButtonRevive = () => {

    socket.emit("witchRevive", lastNight);

  }


  loadData = () => {
    var self = this;
    //Scope
    http.getRoles().then(data => {

      self.setState({roles: data})
      htmlContent = (<div className="container App-main">
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
      </div>);
      self.forceUpdate();
    }, err => {

    });
  }

  // Find the userSide for seer
  loadSideData = ( targetID ) => {
    var self = this;
    http.findPlayerSide(targetID).then(data => {
      result = data.userSide;
      htmlContent = (<h4>{targetID}号玩家阵营为{result}。</h4>)
      self.forceUpdate();
    });


  }

  roleList = () => {
    const list = this.state.roles.map((role) =>
      <div className="col-sm-4" key={role._id}>
        <Role userRole={role.userRole} imgUrl={role.imgUrl} userSide={role.userSide} UUID={userUniqueID}></Role>
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
        <div className="machineId">{userUniqueID}</div>
        <div id="werewolf"></div>
        <div>{htmlContent}</div>
      </div>
    );
  }
}

export default App;


///work
