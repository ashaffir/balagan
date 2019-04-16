import React, { Component } from 'react';
import './Players.css'


export default class Players extends Component {
    state = {
        players_bets: [],
        player: {
            user_id: 0,
            direciton: 'side',
            cycle_value: 0,
            bet_time: 12,
            payout: 0,
            bet: 111
        }

      }

      getPlayers = () => {
        fetch('http://localhost:4000/players')
        .then(response => response.json())
        .then(response => {this.setState ({players_bets: response.players_bets})})
        .catch((err) => {
          console.log(err)
        })
      }


    addPlayer = _ => {
        const { player } = this.state;
        fetch(`http://localhost:4000/players/add?
            user_id=${player.user_id}&
            direction=${player.direction}&
            cycle_value=${player.cycle_value}&
            bet_time=${player.bet_time}&
            bet=${player.bet}
            `)
        .then(this.getPlayers)
        .catch(err => console.log(err))
    }

    keyGen = (uid) => {
        let key = uid + '_' + new Date().getTime();
        return key
    }
      componentDidMount () {
        this.getPlayers();
      }

    renderUser = ({user_id, direction, cycle_value, bet, bet_time,payout}) => 
        <tr key={user_id}> 
            <td className="players">{user_id}</td>
            <td className="players">{direction}</td>
            <td className="players">{cycle_value}</td>
            <td className="players">{bet}</td>
            <td className="players">{bet_time}</td>
            <td className="players">{payout}</td>
        </tr> 
    
    render () {

        const { players_bets } = this.state;
        console.log(players_bets)


        return (
            <table className="players">  
            <h2>Winners Table</h2>
                <tbody>
                    <tr>  
                        <th>User ID</th>
                        <th>Direction</th>
                        <th>Cycle Value</th>
                        <th>Bet Amount</th>
                        <th>Bet Time</th>
                        <th>Payout</th>
                    </tr>  
                    {players_bets.map(this.renderUser)}
                </tbody>
            </table>  
        )
    }
}

