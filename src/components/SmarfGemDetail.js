import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import Img from 'react-image';
const base64Img = require('base64-img');  

// Detail page component
export default class SmarfGemDetail extends Component {
  constructor() {
    super()
    this.state = {
      smarfGem: [],
      owner: [],
    }
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    axios.get(`http://localhost:5000/api/smarf-gems/${id}`)
      .then(response => {
        if (response.data.course === null) {
          this.props.history.push('/notfound');
        } else {
          this.setState({
            smarfGem: response.data.smarfGem,
            owner: response.data.smarfGem.author,
          })
        }
      })
      .catch(err => {
        this.props.history.push('/error')
        console.log('Error fetching data from REST API', err)
      })
  }

  render() {
    const smarfGem = this.state.smarfGem;
    const smarfBase64 = this.state.smarfGem.gem;
    const author = this.state.owner;
    const id = this.state.smarfGem.id;
    const { context } = this.props;
    const authUser = context.authenticatedUser;

    return (
      <div>
        <div className="actions--bar">
        <div className="bounds">
          <div className="grid-100">
            { authUser && authUser.emailAddress === author.emailAddress ?
              <React.Fragment>
                <span><Link className="button" to={`/smarf-gems/${id}/update`}>Update Smarf Gem</Link><a className="button" href="/" onClick={this.courseDelete} >Delete Course</a></span>
                <Link className="button button-secondary" to="/">Return to List</Link>
              </React.Fragment>
            :
              <React.Fragment>
                <Link className="button button-secondary" to="/">Return to List</Link>
              </React.Fragment>  
            }
          </div>
            
        </div>  
      </div>
      <div className="bounds course--detail">
          <div className="grid-66">
            <div className="course--header">
              <h4 className="course--label">Course</h4>
      <h3 className="course--title">{smarfGem.title}</h3>
              <p>By {author.firstName} {author.lastName}</p>
            </div>
            <div className="course--description">
            <ReactMarkdown 
                source={smarfGem.description}
              />
              
            </div>
          </div>
          {/* <div className="grid-25 grid-right"> */}
            <div className="course--stats">
              {/* render image from base64 */}
              <img alt="Smarf Gem" src={`data:image/jpeg;base64, ${smarfBase64}`}></img>
            </div>
          {/* </div> */}
        </div>
      </div>
    )
  }

  // Function that deletes course, invokes method from context
  courseDelete = () => {
    const { context } = this.props;
    const id = this.props.match.params.id;
    const emailAddress = context.authenticatedUser.emailAddress;
    const password = context.authenticatedUser.password;
    const { from } = this.props.location.state || { from: { pathname: '/' } };

    context.data.deleteSmarfGem(id, emailAddress, password)
      .then( response => {
        if (response.status === 204) {
          this.props.history.push(from);
          console.log(`SUCCESS! That course just exploded!`);
        } else if (response.status === 403) {
          this.props.history.push('/forbidden');
          console.log(`WHOA! You are not allow to do that!`);
        }
      });
  }

}