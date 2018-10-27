import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ReactDOM from 'react-dom';
import MenuAppBar from './MenuAppBar.js';

const styles = {
  card: {
    maxWidth: 345
  },
  media: {
    height: 140
  }
};

class Approve extends Component {
  constructor(props) {
    super(props);
    this.state = { eventList: [] };
  }

  componentDidMount = () => {
    this.fetchRecents();
  };

  fetchRecents = () => {
    fetch('/api/recents')
      .then(res => res.json())
      .then((response) => {
        console.log(response);
        this.setState({ eventList: response }, () => {
          console.log('Updated State');
        });
      });
  };

  handleApprove(e, id) {
    const stuff = this;
    fetch('/api/approve', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
      .then(res => res.json())
      .then((response) => {
        console.log(response);
        this.fetchRecents();
        return 42;
      });
  }

  render() {
    return (
      <div>
        <MenuAppBar />
        <div style={{ margin: '0 auto', width: '33%' }}>
          <h5 style={{ textAlign: 'center' }}>Approve campaigns</h5>
          <br />

          <p>
            Approving a campaign triggers bots that engage in conversation in
            high traffic zones of the internet
          </p>
        </div>
        <br />
        <br />
        {this.state.eventList ? (
          this.state.eventList.map((elem, id) => (
            <div
              style={{
                paddingBottom: '35px',
                maxWidth: '50vw',
                margin: '0 auto'
              }}
            >
              <Card className="approve-card" id={`${id}-approve-card`}>
                <CardActionArea>
                  <CardMedia
                    className="approve-card-image"
                    style={{ minHeight: '100px' }}
                    image={elem.imgArr[0]}
                    title="Contemplative Reptile"
                  />
                  <CardContent>
                    <Typography gutterBottom component="p">
                      {elem.createdBy}
                      <br />
                      {elem.createdOn}
                    </Typography>
                    <Typography component="h5">{elem.description}</Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={e => this.handleApprove(e, elem._id)}
                  >
                    Approve
                  </Button>
                  <Button variant="contained" size="small" color="primary">
                    Decline
                  </Button>
                </CardActions>
              </Card>
            </div>
          ))
        ) : (
          <span />
        )}
      </div>
    );
  }
}
ReactDOM.render(<Approve />, document.getElementById('root'));
