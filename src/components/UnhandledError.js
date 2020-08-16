import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// Error page for unhandled error
export default class UnhandledError extends Component {
  render() {
    return (
      <div>
        <div className="bounds--error">
          <h1>Error</h1>
          <p>Sorry! We just encountered an unexpected error.</p>
        </div>
        <p className="home"><Link to={`/`}>Return Home</Link></p>
      </div>
      
    )
  }
}