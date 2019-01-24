import React, { Component } from 'react';

import {
    isSignInPending,
    loadUserData,
    Person
  } from 'blockstack';

const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

export default class UserInfo extends Component {


    constructor(props) {
        super(props);
        this.state = {
            person: {
              name() {
                return 'Anonymous';
              },
              avatarUrl() {
                return avatarFallbackImage;
              },
            },
            username: "",
          };
    }
    render (){

        const { handleSignOut } = this.props;
        const { person } = this.state;
        const { username } = this.state;
        return (
        <div className="user-info">
            <div className="avatar-section">
            <div className="username">
                <p>
                <span id="heading-name">{ person.name() ? person.name()
                    : 'Nameless Person' }</span>
                    <img
                src={ person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage }
                className="img-rounded avatar"
                id="avatar-image"
            />
                </p>
                <p>
                <span>{username}</span>
                </p>
                {this.isLocal() &&
                <span>
                    <a onClick={ handleSignOut.bind(this) }>(Logout)</a>
                </span>
                }
            </div>
            </div>
        </div>
        )
      }

      componentWillMount() {
        this.setState({
          person: new Person(loadUserData().profile),
          username: loadUserData().username
        });
      }
      isLocal() {
        return this.props.match.params.username ? false : true
      }
}