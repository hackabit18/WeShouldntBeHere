import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import MenuAppBar from './MenuAppBar.js';

class Recents extends Component {
  constructor(props) {
    super(props);
    this.state = { eventList: [] };
  }

  componentDidMount = () => {
    fetch('/api/recentAll')
      .then(res => res.json())
      .then((response) => {
        this.setState({ eventList: response });
      });
  };

  render() {
    return (
      <div>
        <MenuAppBar />
        <div className="row" style={{ marginTop: '100px' }}>
          {this.state.eventList && this.state.eventList.length ? (
            this.state.eventList.map(elem => (
              <div className="col-xs-12 col-md-4 col-sm-4">
                <div
                  style={{
                    height: '50%',
                    maxHeight: '250px',
                    backgroundImage: `${elem.imgArr[0]}`
                  }}
                >
                  <img
                    src={`${elem.imgArr[0]}`}
                    style={{ width: '100%', height: '100%' }}
                    alt="something"
                  />
                </div>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">
                      {elem.createdBy}
                      <br />
                      {elem.createdOn}
                    </h5>
                    <p className="card-text">{elem.description}</p>
                    <a
                      href={`/event?id=${elem._id}`}
                      className="btn btn-primary"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Know More
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <span />
          )}
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Recents />, document.getElementById('root'));
