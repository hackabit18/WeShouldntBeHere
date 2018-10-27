import React from 'react';
import ReactDOM from 'react-dom';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    const elem = this;
    const Userelem = document.getElementById('username');
    const email = Userelem.value;
    Userelem.value = '';

    const Passelem = document.getElementById('password');
    const password = Passelem.value;
    Passelem.value = '';

    if (email && password) {
      fetch('/api/login', {
        method: 'post',
        mode: 'cors',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      })
        .then(res => res.json())
        .then((response) => {
          console.log('Here!' + response.url);
          window.location.href = response.url;
        });
    } else {
      console.log('Username and Password can not be empty');
    }
    e.preventDefault();
  }

  render() {
    return (
      <div className="wrapper">
        <div className="profile-pic">
          <img src="http://amplifiii.com/flatso/wp-content/uploads/2013/09/flat-faces-icons-circle-man-4_256x256x32.png" />
        </div>
        <div
          className="text-center "
          style={{ color: 'white', marginTop: '15px' }}
        >
          <h4 className="text-center">Login</h4>
        </div>
        <div className="signin">
          <form onSubmit={e => this.handleSubmit(e)}>
            <div className="input-group">
              <input id="username" id="username" name="email" type="text" />
              <label>Your Username</label>
            </div>
            <div className="input-group">
              <input id="password" name="password" type="password" />
              <label>Your Password</label>
            </div>
            <input id="submitButton" type="submit" />
          </form>

          <p
            className="text-center"
            style={{ fontSize: '14px', color: 'white' }}
          >
            Not registered?
            <a style={{ textDecoration: 'none' }} href="/register">
              Register
            </a>
          </p>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Login />, document.getElementById('root'));
