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
      title: "",
      news: "",
      blogIds: [],
      blogId: 0,
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
            {this.state.blogIds.map((blog) => (
                <div className="status" key={blog.id}>
                 <a href="#" onClick={()=>this.setState({ newBlogClicked : false} )}>
                 {blog.title}
                        </a>
                </div>
                )
            )}
            </div>
          </div>
          <div className="col-md-offset-3 col-md-7" id="">            
            <div className="col-md-12 statuses">
            {this.state.isLoading && <span>Loading...</span>}
            {this.state.blogIds.map((blog) => (
                <div className="status" key={blog.id}>
                 <a href="#" onClick={()=>this.setState({ newBlogClicked : false} )}>
                 {blog.title}
                        </a>
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
    console.log('state in constructotr', this.state );
    this.fetchBlogs()
  }

  isLocal() {
    console.log('state in constructotr', this.state );
    return this.props.match.params.username ? false : true
  }

  fetchBlogs(){
    
    console.log('state in constructotr', this.state );

    this.setState({ isLoading: true })
    if (this.isLocal()) {
      const options = { decrypt: false }
      /** const options = { username:'newschain3.id.blockstack',encrypt: false}*/

      getFile('blogIds.json', options)
        .then((file) => {
            console.log(file)
          var blogIds = JSON.parse(file || '[]')
          this.setState({
            person: new Person(loadUserData().profile),
            username: loadUserData().username,
            blogId: blogIds.length,
            blogIds: blogIds,
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
        const options = { username:username,encrypt: false}

        getFile('blogIds.json', options)
          .then((file) => {
            var blogIds = JSON.parse(file || '[]')
            this.setState({
              statusIndex: blogIds.length,
              blogIds: blogIds
            })
          })
          .catch((error) => {
            console.log('could not fetch blogIds')
          })
          .finally(() => {
            this.setState({ isLoading: false })
          })
    } 
  }

  

  fetchData() {
    console.log('state in fetchData AllBlogs', this.state );

    this.setState({ isLoading: true })
    if (this.isLocal()) {
      const options = { decrypt: false }
      /** const options = { username:'newschain3.id.blockstack',encrypt: false}*/

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
        const options = { username:username,encrypt: false}

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
