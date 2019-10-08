import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import HttpService from '../services/http-service';
import hunter  from './imgs/hunter.jpg';
import seer  from './imgs/seer.jpg';
import werewolf  from './imgs/werewolf.jpg';
import villager  from './imgs/villager.jpg';



const http = new HttpService();


class App extends Component {

  constructor(props){
    super(props);
    http.getRoles();
    var req = require.context("./imgs", false, /.*\.jpg$/);
    req.keys().forEach(function(key){
        req(key);
    });
    console.log(req);
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>欢迎来到Hampshire College狼人杀</h2>
        </div>

        <div className="container-fluid App-main">
          <h3>选择你的角色</h3>
          <div className="row">
				        <div className="col-sm-8">
				  	           <div className="row">
                         <div className="col-sm-4">
                           <button class="btn btn-default">
                             <img src={hunter} alt="Hunter" width="150"></img>
                           </button>
                           <button class="btn btn-default">
                             <img src={seer} alt="Hunter" width="150"></img>
                           </button>
                           <button class="btn btn-default">
                             <img src={werewolf} alt="Hunter" width="150"></img>
                           </button>
                           <button class="btn btn-default">
                             <img src={villager} alt="Hunter" width="150"></img>
                           </button>
                         </div>

					             </div>
				        </div>
          </div>
        </div>
      </div>


    );
  }
}

export default App;


///work
