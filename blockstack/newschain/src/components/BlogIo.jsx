saveNews(blogId, title, news) {
    let blogIds = this.state.blogIds
 
    let blog = {
      id: blogId++,
      created_at: Date.now()
    }
 
    blogIds.unshift(blog)
    console.log('saveNewBlog')
    const options = { encrypt: false ,username:username}
    putFile('blogIds.json', JSON.stringify(blogIds), options)
      .then(() => {
        this.setState({
          blogIds: blogIds
        })
      })

      let blog = {
        blogId: blogId,
        created_at: Date.now(),
        title:title,
        news:news
      }
      putFile(blogId+'.json', JSON.stringify(blog), options)
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