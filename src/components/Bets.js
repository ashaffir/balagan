import React, { Component } from 'react';
import './Players.css'
import Cookies from 'universal-cookie';
import uniqueid from 'uniqid';

const userCookie = new Cookies();

const dev_db_route = 'http://localhost:3001';

export default class Bets extends Component {
    state = {
        player_info: [],
        player: {
            user_id: 0,
            cycle_value: 0,
            bet_time: 12,
            payout: 0,
            bet: 111
        }

      }

    getPlayerInfo = (uid) => {
        fetch(`${dev_db_route}/db/player_info?uid=${uid}`)
        .then(response => response.json())
        .then(response => {this.setState ({player_info: response.player_info})})
        .catch((err) => {
          console.log(err)
        })
    }

    componentDidMount () {
        let uid = userCookie.get('user_id');;
        this.getPlayerInfo(uid);
    }

    renderUserBets = ({user_id, direction, cycle_value, bet, bet_hour, bet_minutes,payout}) => 
        <tr key={uniqueid()}> 
            <td className="players">{user_id}</td>
            <td className="players">{direction}</td>
            <td className="players">{cycle_value}</td>
            <td className="players">{bet}</td>
            <td className="players">{bet_hour}:{bet_minutes}</td>
        </tr> 
    
    render () {

        const { player_info } = this.state;

        return (
            <table className="players">  
                <tbody>
                    <tr>  
                        <th>User ID</th>
                        <th>Direction</th>
                        <th>Cycle Value</th>
                        <th>Bet Amount</th>
                        <th>Bet Time</th>
                    </tr>  
                    {player_info.map(this.renderUserBets)}
                </tbody>
            </table>
        )
    }
}
