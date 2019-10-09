import React, { Component } from 'react';
import './role.css';

class Role extends Component {
  render() {
    return (
      <div className="card role">
        <img className="card-img-top" src={this.props.imgUrl} alt="role"></img>
        <div className="card-block">
          <h4 className="card-title"></h4>
          <p className="card-text">{this.props.name}</p>
          <a href="#" className="btn btn-primary">Confirm</a>
        </div>
      </div>
    );
  }
}

export default Role;
