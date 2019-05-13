import React, { Component } from 'react';
import './Gamers.css'

export default class Gamers extends Component {
    state = {
        bets: []
      }

      getUsers = () => {
        fetch(`/db/bets`)
        .then(response => response.json())
        .then(response => {this.setState ({bets: response.bets})})
        .catch((err) => {
          console.log(err)
        })
      }

      componentDidMount () {
        this.getUsers();
      }

    renderUser = ({user_local_wallet, direction, cycle_value, bet, result,user_wallet}) => 
        <tr key={user_local_wallet}>  
        <td className="gamers">{user_wallet}</td>
        <td className="gamers">{direction}</td>
        <td className="gamers">{cycle_value}</td>
        <td className="gamers">{bet}</td>
        <td className="gamers">{result}</td>
        </tr> 
    
    render () {

        const { bets } = this.state;
        console.log(bets)


        return (
            <table className="gamers">  
                <tbody>
                    <tr>
                      <td>
                      </td>
                    </tr>
                    <tr>  
                        <th>User ID</th>
                        <th>Direction</th>
                        <th>Cycle Value</th>
                        <th>Bet Amount</th>
                        <th>Won/Lost</th>
                    </tr>  
                    {bets.map(this.renderUser)}
                </tbody>
            </table>  
        )
    }
}

