import React, { Component } from 'react';

import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import './style/App.css';

// Import components
import Header from './components/Header';
import Home from './components/Home';
// import SmarfGems from './components/SmarfGems';
// import SmarfGemDetail from './components/SmarfGemDetail';
// import TwitterTalent from './components/TwitterTalent';
// import TwitterTalentDetail from './components/TwitterTalentDetial';
import UserSignIn from './components/UserSignIn.js';
import UserSignOut from './components/UserSignOut';
import UserSignUp from './components/UserSignUp';
import NotFound from './components/NotFound';
import Forbidden from './components/Forbidden';
import UnhandledError from './components/UnhandledError';
import withContext from './Context';

// Add context to components
const HeaderWithContext = withContext(Header);
// const HomeWithContext = withContext(Home);

const UserSignInWithContext = withContext(UserSignIn);
const UserSignUpwithContext = withContext(UserSignUp);
const UserSignOutWithContext = withContext(UserSignOut);


export default class App extends Component {
  render() {
    return (
      // Route handling
      <Router>
        <div>
        <HeaderWithContext />
        <Switch>
          {/* <Route exact path="/" component={HomeWithContext} /> */}
          {/* <Route path="/smarf-gems" component={SmarfGems} />
          <Route path="/smarf-gems/:id" component={SmarfGemDetail} />
          <Route path="/twitter-talent" component={TwitterTalent} />
          <Route path="/twitter-talent/:id" component={TwitterTalentDetail} /> */}
          <Route path="/signin" component={UserSignInWithContext} />
          <Route path="/signout" component={UserSignOutWithContext} />
          <Route path="/signup" component={UserSignUpwithContext} />
          <Route path="/forbidden" component={Forbidden} />
          <Route path="/error" component={UnhandledError} />
          <Route path="/notfound" component={NotFound} />
          <Route component={NotFound} />
        </Switch>
        </div>
      </Router>
    )

  }
}