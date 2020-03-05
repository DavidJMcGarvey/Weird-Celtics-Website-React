import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// Error page when user is not Authenticated 
export default class Error extends Component {
  render() {
    return (
      <div>
        <div className="bounds--error">
          <h1>Forbidden</h1>
          <p>Oh oh! You can't access this page.</p>
        </div>
        <p className="home"> <Link to={`/`}>Return Home</Link></p>
      </div>
      
    )
  }
}