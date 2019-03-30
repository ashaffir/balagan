
import React from 'react';
const API_KEY = '32b2b6bb068a6039d69d03fdcea127ee8f148bc38962d3296b9b514a10030a24'
const url_coindesk = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH&tsyms=ETH,USD,EUR&api_key=';

export default class CurrentValue extends React.Component {
    state = {
      isLoading: true,
      value: [],
      error: null
    }

    fetchUsers() {
        fetch(url_coindesk+API_KEY)
          .then(response => response.json())
          .then(data =>
            this.setState({
              value: data['BTC']['USD']
            })
          )
          // Catch any errors we hit and update the app
          .catch(error => this.setState({ error, isLoading: false }));
      }
  
    componentDidMount() {
        this.fetchUsers();
    }

    render() {
        return (
            <p>{this.state.value}</p>
        );
      }
  }
