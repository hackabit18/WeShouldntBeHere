import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Create extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    console.log('mounting create');
  }

  formSubmit = (e) => {
    e.preventDefault();

    // console.log(e.target);
    const descElem = document.getElementById('fancy-textarea');
    const desc = descElem.value;
    const emailElem = document.getElementById('fancy-email');
    const email = emailElem.value;
    console.log(`${desc}${email}`);

    let input = document.querySelector('input[type="file"]');

    let data = new FormData();
    for (const file of input.files) {
      data.append('files', file, file.name);
    }

    data.append('desc', desc);
    data.append('email', email);
    console.log(data);
    fetch('/api/create', {
      method: 'post',
      body: data
    })
      .then(res => res.json())
      .then(response => console.log(response));
  };

  render() {
    return (
      <form onSubmit={e => this.formSubmit(e)} encType="multipart/form-data">
        <h1>Create a New Campaign</h1>
        {/* <div className="row">
          <input type="checkbox" name="fancy-checkbox" id="fancy-checkbox" />
          <label htmlFor="fancy-checkbox">Checkbox</label>
        </div>

       <div className="row">
          <input type="radio" name="fancy-radio" id="fancy-radio-1" />
          <label htmlFor="fancy-radio-1">Radio</label>

          <input type="radio" name="fancy-radio" id="fancy-radio-2" />
          <label htmlFor="fancy-radio-2">Radio</label>
        </div>  */}

        <div className="row">
          <input type="text" name="email" id="fancy-email" />
          <label htmlFor="fancy-email">Email</label>
        </div>

        <div className="row">
          <textarea name="desc" id="fancy-textarea" />
          <label htmlFor="fancy-textarea">Description</label>
        </div>

        <div className="row">
          <input
            type="file"
            name="disasterImgs"
            multiple
            id="fancy-uploadarea"
          />
          <label htmlFor="fancy-textarea">Upload Related Images</label>
        </div>

        <button type="submit" tabIndex="0">
          Submit
        </button>
      </form>
    );
  }
}
ReactDOM.render(<Create />, document.getElementById('root'));
