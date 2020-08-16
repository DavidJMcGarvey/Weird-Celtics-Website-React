import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import SmarfGem from './SmarfGem';

// Home page component that lists course modules
export default class SmarfGems extends Component {
  constructor() {
    super()
    this.state = {
      smarfGems: []
    }
  }

  componentDidMount() {
    axios.get('http://localhost:5000/api/smarf-gems')
      .then(response => {
        this.setState({
          smarfGems: response.data.smarfGems
        });
      })
      .catch(err => {
        this.props.history.push('/error')
        console.log('Error fetching data from REST API', err)
      })
  }

  render() {
    let smarfGemsList = this.state.smarfGems;
    let smarfGems = smarfGemsList.map( smarfGem => 
      <SmarfGem 
        id={smarfGem.id}
        key={smarfGem.id.toString() + 1}
        title={smarfGem.title}
      />
    );
    return (
      <div>
        <div className="bounds">
          <ul>
            {smarfGems}
          </ul>
          <div className="grid-33"><Link className="course--module course--add--module" to="/smarf-gems/create">
          <h3 className="course--add--title"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
              viewBox="0 0 13 13" className="add">
              <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
            </svg>New Smarf Gem</h3>
          </Link></div>
        </div>
      </div>
      
    )
  }

}

