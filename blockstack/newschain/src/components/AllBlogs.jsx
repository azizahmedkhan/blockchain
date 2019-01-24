import React, { Component } from 'react';
import {
  isSignInPending,
  loadUserData,
  Person,
  getFile,
  lookupProfile,
} from 'blockstack';
import UserInfo from './UserInfo.jsx';


export default class AllBlogs extends Component {
  constructor(props) {
    super(props);
    console.log('All Bloggs')

    this.state = {
      person: {
        name() {
          return 'Anonymous';
        },
      },
      username: "",
      statuses: [],
      statusIndex: 0,
      isLoading: false
    };
  }

  render() {
    const { person } = this.state;   
    return (
      !isSignInPending() && person ?
      <div className="container">
      
        <div className="row">
        
          <div className="col-md-offset-3 col-md-6" id="">            
            <div className="col-md-12 statuses">
            {this.state.isLoading && <span>Loading...</span>}
            {this.state.statuses.map((status) => (
                <div className="status" key={status.id}>
                  {status.text}
                </div>
                )
            )}
            </div>
          </div>
        </div>
      </div> : null
    );
    }

  componentDidMount() {
    this.fetchData()
  }

  isLocal() {
    return this.props.match.params.username ? false : true
  }
  fetchData() {
    this.setState({ isLoading: true })
    if (this.isLocal()) {
      const options = { decrypt: false }
      getFile('statuses.json', options)
        .then((file) => {
          var statuses = JSON.parse(file || '[]')
          this.setState({
            person: new Person(loadUserData().profile),
            username: loadUserData().username,
            statusIndex: statuses.length,
            statuses: statuses,
          })
        })
        .finally(() => {
          this.setState({ isLoading: false })
        })
    } else {
      const username = this.props.match.params.username
 
      lookupProfile(username)
        .then((profile) => {
          this.setState({
            person: new Person(profile),
            username: username
          })
        })
        .catch((error) => {
          console.log('could not resolve profile')
        })
        const options = { username: username, decrypt: false }
        getFile('statuses.json', options)
          .then((file) => {
            var statuses = JSON.parse(file || '[]')
            this.setState({
              statusIndex: statuses.length,
              statuses: statuses
            })
          })
          .catch((error) => {
            console.log('could not fetch statuses')
          })
          .finally(() => {
            this.setState({ isLoading: false })
          })
    }
  }
}
