import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// Error page not found
export default class NotFound extends Component {
  render() {
    return (
      <div>
        <div className="bounds--error">
          <h1>Not Found</h1>
          <p>Sorry! We couldn't find the page you're looking for.</p>
        </div>
        <p className="home"><Link to={`/`}>Return Home</Link></p>
      </div>
      
    )
  }
}