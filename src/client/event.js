import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import MenuAppBar from './MenuAppBar';

class Event extends Component {
  constructor(props) {
    super(props);
    this.state = { event: null };
  }

  componentWillMount() {
    const params = new URL(document.location).searchParams;
    const name = params.get('id');
    console.log(name);
  }

  componentDidMount() {
    const params = new URL(document.location).searchParams;
    const name = params.get('id');
    console.log(name);
    fetch(`/campaign?id=${name}`)
      .then(res => res.json())
      .then((response) => {
        this.setState({ event: response }, () => {
          console.log(response);
        });
      })
      .catch(err => console.error(err));
  }

  render() {
    return (
      <div>
        {this.state.event ? (
          <div>
            <MenuAppBar />
            <div className="row" style={{ marginTop: '100px' }}>
              <div className="col-sm-8">
                <div
                  style={{
                    height: '50%',
                    maxHeight: '250px',
                    backgroundImage: `${this.state.event.imgArr[0]}`
                  }}
                >
                  <img
                    src={`${this.state.event.imgArr[0]}`}
                    style={{ width: '100%', height: '100%' }}
                    alt="something"
                  />
                </div>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">
                      {this.state.event.createdBy}
                      <br />
                      {this.state.event.createdOn}
                    </h5>
                    <p className="card-text">{this.state.event.description}</p>
                    <a href="#" className="btn btn-primary">
                      Know More
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Engage and Share</h5>
                    <p className="card-text">
                      With supporting text below as a natural lead-in to
                      additional content.
                    </p>
                    <a href="#" className="btn btn-primary">
                      Engage
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <span />
        )}
      </div>
    );
  }
}
ReactDOM.render(<Event />, document.getElementById('root'));
