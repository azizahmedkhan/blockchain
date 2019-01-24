import React, { Component } from 'react';
import {
  isSignInPending,
  loadUserData,
  Person,
  getFile,
  putFile,
  lookupProfile,
} from 'blockstack';
import UserInfo from './UserInfo.jsx';

export default class NewBlog extends Component {
  constructor(props) {
    super(props);
    console.log('New Blogg')
    this.state = {
      
      newStatus: "",
      statuses: [],
      statusIndex: 0,
      isLoading: false
    };
  }

  render() {
    const { handleSignOut } = this.props;
    const { person } = this.state;
    const { username } = this.state;
   
    return (
      !isSignInPending() && person ?
      
      <div className="container">
        <div className="row">
          <div className="col-md-offset-3 col-md-6">  
            {this.isLocal() &&
              <div className="new-blog">
                <div className="col-md-12">
                  <textarea className="input-title"
                    value={this.state.newStatus}
                    onChange={e => this.handleNewStatusChange(e)}
                    placeholder="title?"
                  />
                  {<textarea className="input-blog"
                    value={this.state.newStatus}
                    onChange={e => this.handleNewStatusChange(e)}
                    placeholder="What's on your mind?"
                  />}
            </div>
                <div className="col-md-12 text-right">
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={e => this.handleNewStatusSubmit(e)}
                  >
                    Submit
                  </button>
                </div>
              </div>
            }
            {/** <div className="col-md-12 statuses">
            {this.state.isLoading && <span>Loading...</span>}
            {this.state.statuses.map((status) => (
                <div className="status" key={status.id}>
                  {status.text}
                </div>
                )
            )}
            </div>*/}
          </div>
        </div>
      </div> : null
    );
    }

    
  componentDidMount() {
    console.log('componentDidMount')
    this.fetchData()
  }

  handleNewStatusChange(event) {
    console.log('handleNewStatusChange')
    this.setState({newStatus: event.target.value})
  }
 
  handleNewStatusSubmit(event) {
    this.saveNewStatus(this.state.newStatus)
    this.setState({
      newStatus: ""
    })
  }

  saveNewStatus(statusText) {
    let statuses = this.state.statuses
 
    let status = {
      id: this.state.statusIndex++,
      text: statusText.trim(),
      created_at: Date.now()
    }
 
    statuses.unshift(status)
    console.log('saveNewStatus')
    const options = { encrypt: false ,username:'azizahmed.id.blockstack'}
    //putFile()
    putFile('statuses.json', JSON.stringify(statuses), options)
      .then(() => {
        this.setState({
          statuses: statuses
        })
      })
  }
  isLocal() {
    return this.props.match.params.username ? false : true
  }

  
  fetchData() {
    this.setState({ isLoading: true })
    if (this.isLocal()) {
      const options = { decrypt: false, username:'azizahmed.id.blockstack'}
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
