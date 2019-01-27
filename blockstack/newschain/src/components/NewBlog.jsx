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
      username: "",
      title: "",
      news: "",
      blogIds: [],
      blogId: 0,
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
                    value={this.state.title}
                    onChange={e => this.handleNewTitleChange(e)}
                    placeholder="title?"
                  />
                  {<textarea className="input-blog"
                    value={this.state.news}
                    onChange={e => this.handleNewsChange(e)}
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
          </div>
        </div>
      </div> : null
    );
    }

    
  componentDidMount() {
    console.log('componentDidMount')
    this.fetchBlogIds()
  }

  handleNewTitleChange(event) {
    this.setState({title: event.target.value})
  }
  handleNewsChange(event) {
    this.setState({news: event.target.value})
  }
 
  handleNewStatusSubmit(event) {
    this.saveNews(this.state.blogId, this.state.title, this.state.news)
    this.setState({
      newStatus: ""
    })
  }

  saveNews(blogId, title, news) {
    let blogIds = this.state.blogIds
 
    let blogIdItem = {
      id: blogId++,
      created_at: Date.now(),
      title:title,
    }
 
    blogIds.unshift(blogIdItem)
    console.log('saveNewBlog')
    const options = { encrypt: false}
    putFile('blogIds.json', JSON.stringify(blogIds), options)
      .then(() => {
        this.setState({
          blogIds: blogIds
        })
      })

      let blogItem = {
        blogId: blogId,
        created_at: Date.now(),
        title:title,
        news:news
      }
      putFile(blogId+'.json', JSON.stringify(blogItem), options)
      .then(() => {
        this.setState({
          title:'',
          news:''
        })
      })
  }
  isLocal() {
    return this.props.match.params.username ? false : true
  }

  fetchBlogIds(){
    
    console.log('state in constructotr', this.state );

    this.setState({ isLoading: true })
    if (this.isLocal()) {
      const options = { decrypt: false }
      /** const options = { username:'newschain3.id.blockstack',encrypt: false}*/

      getFile('blogIds.json', options)
        .then((file) => {
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
  
}
