
// /client/App.js
import React, { Component } from 'react';

class App extends Component {
  // initialize state
  state = {
    data: [],
    id: 0
  };

  // fetch data from database
  getDataFromDb = (idToGet) => {
    fetch('http://localhost:3001/api/item/'+idToGet)
      .then((data) => data.json())
      .then((res) => this.setState({ data: res.data }));
  };

 

  // UI
  render() {
    const { data } = this.state;
    return (
      <div>    
        <div style={{ padding: '10px' }}>
          <input
            type="text"
            style={{ width: '200px' }}
            onChange={(e) => this.setState({ idToGet: e.target.value })}
            placeholder="put asin of item to find here"
          />
          <button onClick={() => this.getDataFromDb(this.state.idToGet)}>
            SEARCH
          </button>
        </div>

        <ul>
          {data.length <= 0
            ? 'Please enter asin'
            : data.map((dat) => (
                <li style={{ padding: '10px' }}>
                  <span style={{ color: 'gray' }}> asin: </span> {dat.asin} <br />
                  <span style={{ color: 'gray' }}> name: </span> {dat.name} <br />
                  <span style={{ color: 'gray' }}> seller name: </span> {dat.sellerName} <br />
                  <span style={{ color: 'gray' }}> seller rating: </span> {dat.sellerRating} <br />
                  <span style={{ color: 'gray' }}> price: </span> {dat.offerPrice} <br />
                </li>
              ))}
        </ul>
      </div>
    );
  }
}

export default App;