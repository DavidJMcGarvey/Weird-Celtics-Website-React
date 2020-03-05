import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Form from './Form';

// Compoenent for user sign in
export default class UserSignIn extends Component {
  state = {
    emailAddress: '',
    password: '',
    errors: [],
  }

  render() {
    const {
      emailAddress,
      password,
      errors,
    } = this.state;

    return (
      <div className="grid-33 centered signin">
        <h1>Sign In</h1>
        <div>
          {/* <form>
            <div><input id="emailAddress" name="emailAddress" type="text" className="" placeholder="Email Address" value=""/></div>
            <div><input id="password" name="password" type="password" className="" placeholder="Password" value=""/></div>
            <div className="grid-100 pad-bottom"><button className="button" type="submit">Sign In</button><button className="button button-secondary" onClick="event.preventDefault(); location.href='index.html';">Cancel</button></div>
          </form> */}
          <Form 
            cancel={this.cancel}
            errors={errors}
            submit={this.submit}
            submitButtonText="Sign In"
            elements={() => (
              <React.Fragment>
                <input 
                  id="emailAddress" 
                  name="emailAddress" 
                  type="text"
                  value={emailAddress} 
                  onChange={this.change} 
                  placeholder="Email Address" />
                <input 
                  id="password" 
                  name="password"
                  type="password"
                  value={password} 
                  onChange={this.change} 
                  placeholder="Password" />                
              </React.Fragment>
          )} />
        </div>
        <p>&nbsp;</p>
        <p>Don't have a user account? <Link to={`/signup`}>Click here</Link> to sign up!</p>
      </div>
    )
  }

  change = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(() => {
      return {
        [name]: value
      };
    });
  }

  submit = () => {
    const { context } = this.props;
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    const { emailAddress, password } = this.state;
    context.actions.signIn(emailAddress, password)
      .then( user => {
        if (user === null) {
          this.setState(() => {
            return { errors: [ 'Sign-In was unsuccessful' ] };
          });
        } else {
          this.props.history.push(from);
          console.log(`SUCCESS! ${emailAddress} is now signed in!`);
        }
      })
      .catch( err => {
        console.log(err);
        this.props.history.push('/error');
      })
  }

  cancel = () => {
    this.props.history.push('/');
  }

}