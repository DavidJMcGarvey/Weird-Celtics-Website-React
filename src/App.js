import React, { Component } from 'react';

import {
  BroswerRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import './style/App.css';

// Import components
import Header from './components/Header';
import Home from './components/Home';
import SmarfGems from './components/SmarfGems';
import SmarfGemDetail from './components/SmarfGemDetail';
import TwitterTalent from './components/TwitterTalent';
import TwitterTalentDetail from './components/TwitterTalentDetial';
import UserSignIn from './components/UserSignIn.js';
import UserSignOut from './components/UserSignOut';
import UserSignUp from './components/UserSignUp';


export default class App extends Component {

  render() {
    return (
      // Route handling
      <Router>
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/smarf-gems" component={SmarfGems} />
          <Route path="/smarf-gems/:id" component={SmarfGemDetail} />
          <Route path="/twitter-talent" component={TwitterTalent} />
          <Route path="/twitter-talent/:id" component={TwitterTalentDetail} />
          <Route path="/signin" component={UserSignIn} />
          <Route path="/signout" component={UserSignOut} />
          <Route path="/signup" component={UserSignUp} />
        </Switch>
      </Router>
    )

  }
}