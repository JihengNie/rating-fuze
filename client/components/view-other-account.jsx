import React from 'react';
import Smiley from './smiley';
import AccountCard from './account-card';

export default class ViewOtherAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      happyLevel: null,
      otherUsers: null,
      currentIndex: 1
    };
    this.handleHomeClick = this.handleHomeClick.bind(this);
    this.handleDirectionClick = this.handleDirectionClick.bind(this);
  }

  handleHomeClick() {
    window.location.hash = '#view-other-accounts';
  }

  handleDirectionClick(event) {
    if (event.target.className.includes('left')) {
      let currentIndex = this.state.currentIndex - 1;
      if (currentIndex < 0) {
        currentIndex = this.state.otherUsers.length - 1;
      }
      this.setState({
        currentIndex
      });
    } else if (event.target.className.includes('right')) {
      let currentIndex = this.state.currentIndex + 1;
      if (currentIndex > this.state.otherUsers.length - 1) {
        currentIndex = 0;
      }
      this.setState({
        currentIndex
      });
    }
  }

  componentDidMount() {
    const previousUsername = window.localStorage.getItem('username');
    if (previousUsername) {
      this.setState({ username: previousUsername });
    }

    const requestObj = {
      method: 'GET'
    };
    fetch(`/api/accounts/${previousUsername}`, requestObj)
      .then(result => result.json())
      .then(result => {
        this.setState({
          happyLevel: result.happyLevel
        });
      })
      .catch(err => console.error(err));

    const requestObj2 = {
      method: 'GET'
    };
    fetch('/api/other-accounts/', requestObj2)
      .then(result => result.json())
      .then(result => {
        const otherUsers = result.map(item => item.username);
        otherUsers.splice(otherUsers.indexOf(this.state.username), 1);
        this.setState({
          otherUsers
        });
      })
      .catch(err => console.error(err));
  }

  render() {
    const otherUsers = this.state.otherUsers;
    if (otherUsers) {
      const currentIndex = this.state.currentIndex;
      const userCurrentIndex = otherUsers[currentIndex];
      let userPreviousIndex = otherUsers[currentIndex - 1];
      let userNextIndex = otherUsers[currentIndex + 1];
      if (currentIndex - 1 < 0) {
        userPreviousIndex = otherUsers[otherUsers.length - 1];
      }
      if (currentIndex + 1 > (otherUsers.length - 1)) {
        userNextIndex = otherUsers[0];
      }
      return (
        <div className='container'>
          <div className='row flex-center'>
            <div className='column-third-always left-align '>
              <i onClick={this.handleHomeClick} className="fa-solid fa-house-chimney fa-4x fa-house-style" />
            </div>
            <div className='column-third-always'>
              <Smiley happyLevel={this.state.happyLevel}/>
            </div>
            <div className='column-third-always' />
          </div>
          <div className='flex-center row-no-wrap'>
            <i onClick={this.handleDirectionClick} className="fa-solid fa-chevron-left chevron-style left" />
            <div className='none-focus-cards'>
              <AccountCard username={userPreviousIndex} hideRating={true} hideName={true} hideStars={true} className='none-focus-cards' />
            </div>
            <AccountCard username={userCurrentIndex} />
            <div className='none-focus-cards'>
              <AccountCard username={userNextIndex} hideRating={true} hideName={true} hideStars={true} className='none-focus-cards overflow' />
            </div>
            <i onClick={this.handleDirectionClick} className="fa-solid fa-chevron-right chevron-style right" />
          </div>
        </div>
      );
    }
  }
}
