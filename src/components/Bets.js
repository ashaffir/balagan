import React, { Component } from 'react';
import './Players.css'
import Cookies from 'universal-cookie';

const userCookie = new Cookies();


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
        fetch(`http://localhost:4000/player_info?uid=${uid}`)
        .then(response => response.json())
        // .then(response => {console.log(`response-2: ${response.player_info[0]['bet']}`);this.setState ({player_info: response.player_info})})
        .then(response => {this.setState ({player_info: response.player_info})})
        .catch((err) => {
          console.log(err)
        })
    }

    componentDidMount () {
        let uid = userCookie.get('user_id');;
        console.log(`userid = ${uid}`);
        this.getPlayerInfo(uid);
    }

    keyGen = (uid) => {
        let rand = toString(Math.floor(Math.random * 50));
        return uid+'_'+rand
    }

    renderUserBets = ({user_id, direction, cycle_value, bet, bet_hour, bet_minutes,payout}) => 
        // <tr key={this.keyGen(user_id)}> 
        <tr> 
            <td className="players">{user_id}</td>
            <td className="players">{direction}</td>
            <td className="players">{cycle_value}</td>
            <td className="players">{bet}</td>
            <td className="players">{bet_hour}:{bet_minutes}</td>
            <td className="players">{parseInt(payout)}</td>
        </tr> 
    
    render () {

        const { player_info } = this.state;
        // console.log(player_bets)


        return (
            <table className="players">  
                <tbody>
                    <tr>  
                        <th>User ID</th>
                        <th>Direction</th>
                        <th>Cycle Value</th>
                        <th>Bet Amount</th>
                        <th>Bet Time</th>
                        <th>Payout</th>
                    </tr>  
                    {player_info.map(this.renderUserBets)}
                </tbody>
            </table>  
        )
    }
}
