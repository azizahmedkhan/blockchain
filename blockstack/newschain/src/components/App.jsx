import React, { Component, Link } from 'react';
import Profile from './Profile.jsx';
import AllBlogs from './AllBlogs.jsx'
import NewBlog from './NewBlog.jsx';
import Signin from './Signin.jsx';
import UserInfo from './UserInfo.jsx';

import { Switch, Route } from 'react-router-dom'
import {
  isSignInPending,
  isUserSignedIn,
  redirectToSignIn,
  handlePendingSignIn,
  signUserOut,
} from 'blockstack';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {newBlogClicked:false};
  }

  handleSignIn(e) {
    e.preventDefault();
    const origin = window.location.origin
    redirectToSignIn(origin, origin + '/manifest.json', ['store_write', 'publish_data'])
  }

  handleSignOut(e) {
    e.preventDefault();
    signUserOut(window.location.origin);
  }

  render() {
    return (
      <div className="site-wrapper">
        <div className="site-wrapper-inner">
          { !isUserSignedIn() ?
            <Signin handleSignIn={ this.handleSignIn } />
            :
            <Switch>
              <Route
                path='/:username?'
                render={
                  routeProps => (
                    <div>
                      <div className="openSpace">
                      {this.state.newBlogClicked?
                        <a href="#" className="openSpace" onClick={()=>this.setState({ newBlogClicked : false} )}>
                          Return
                        </a>
                        :
                        <a href="#" className="openSpace" onClick={()=>this.setState({ newBlogClicked : true} )}>
                            Create News
                        </a>
                      }
                      </div>
                      <UserInfo handleSignOut={ this.handleSignOut } {...routeProps} />
                      {this.state.newBlogClicked? 
                        <NewBlog  {...routeProps} /> :
                        <AllBlogs {...routeProps} />  
                      }
                    </div>
                  )
                }
              />
            </Switch>
          }
        </div>
      </div>
    );
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('updateddd', prevState, 'snapsot', snapshot ,'  prevProps',prevProps);
    
  }

  createNewBlog() {
    this.setState({ newBlogClicked : true} );
  }
  
  componentWillMount() {
    if (isSignInPending()) {
      handlePendingSignIn().then((userData) => {
        window.location = window.location.origin;
      });
    }
  }
}
