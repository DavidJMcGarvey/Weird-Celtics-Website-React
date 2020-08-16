import React, { Component } from 'react';

import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import './styles/App.css';

// Import components
import Header from './components/Header';
// import Home from './components/Home';
import SmarfGems from './components/SmarfGems';
import SmarfGemDetail from './components/SmarfGemDetail';
import CreateSmarfGem from './components/CreateSmarfGem'
// import TwitterTalent from './components/TwitterTalent';
// import TwitterTalentDetail from './components/TwitterTalentDetial';
import UserSignIn from './components/UserSignIn';
import UserSignUp from './components/UserSignUp';
import UserSignOut from './components/UserSignOut';
import NotFound from './components/NotFound';
import Forbidden from './components/Forbidden';
import UnhandledError from './components/UnhandledError';
import withContext from './Context';

// Add context to components
const HeaderWithContext = withContext(Header);
// const HomeWithContext = withContext(Home);
const SmarfGemsWithContext = withContext(SmarfGems);
const SmarfGemDetailWithContext = withContext(SmarfGemDetail);
const CreateSmarfGemWithContext = withContext(CreateSmarfGem);

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
          <Route exact path="/" component={SmarfGemsWithContext} />
          <Route exact path="/smarf-gems" component={SmarfGemsWithContext} />
          <Route path="/smarf-gems/create" component={CreateSmarfGemWithContext} />
          <Route path="/smarf-gems/:id" component={SmarfGemDetailWithContext} />

          {/* <Route path="/twitter-talent" component={TwitterTalent} /> */}
          {/* <Route path="/twitter-talent/:id" component={TwitterTalentDetail} /> */}
          <Route path="/signin" component={UserSignInWithContext} />
          <Route path="/signup" component={UserSignUpwithContext} />
          <Route path="/signout" component={UserSignOutWithContext} />
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
