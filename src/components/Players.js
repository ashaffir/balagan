import React, { Component } from 'react';
import './Players.css'
import Cookies from 'universal-cookie';
import uniqueid from 'uniqid';

const balanceCookie = new Cookies();
const DB_PORT = 4000;


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
        fetch(`http://localhost:${DB_PORT}/players`)
        .then(response => response.json())
        .then(response => {this.setState ({players_bets: response.players_bets})})
        .then(() => {this.updateBalance()})
        .then(()=> {this.updateStatusDB()}) // Update the DB status field for the users that were updated
        .catch((err) => {
          console.log(err)
        })
    }

    updateBalance = () => {     
        let payout;      
        let current_balance = parseFloat(balanceCookie.get('balance'));
        let uid = balanceCookie.get('user_id');
        // console.log(`Updating balance cookie...`);
        // console.log(`${this.state.players_bets[0]['user_id']}`);
        // console.log(`${this.state.players_bets[0]['status']}`);
        // console.log(`${this.state.players_bets.length}`);
        // console.log(`USER ID FROM COOKIE: ${balanceCookie.get('user_id')}`);
        for(let i=0; i < this.state.players_bets.length;i++){
            if((uid === this.state.players_bets[i]['user_id']) && (this.state.players_bets[i]['status'] !== 1))
                {
                    // console.log(`current balance ${i} = ${current_balance}`)
                    payout = parseFloat(this.state.players_bets[i]['payout']);
                    // console.log(`payout ${i} = ${payout}`)
                    current_balance += payout;
                    // console.log(`NEW BALANCE: ${new_balance}`);
                }
            }
            
            balanceCookie.set('balance', current_balance, {path: '/'});        
        }
    
    updateStatusDB = () => {
        let uid = balanceCookie.get('user_id');
        let PLAYER_STATUS_UPDATE = `http://localhost:${DB_PORT}/players_update?uid=${uid}`;
        // console.log(`Updating the status of the user ${balanceCookie.get('user_id')}`);
        fetch(PLAYER_STATUS_UPDATE)
        .catch(err => console.log(err));
    }

      componentDidMount () {
        this.getPlayers();
      }

    renderUser = ({user_id, direction, cycle_value, bet, bet_hour, bet_minutes,payout}) => 
        <tr key={uniqueid()}> 
            <td className="players">{user_id}</td>
            <td className="players">{direction}</td>
            <td className="players">{cycle_value}</td>
            <td className="players">{bet}</td>
            <td className="players">{bet_hour}:{bet_minutes}</td>
            <td className="players">{parseInt(payout)}</td>
        </tr> 


    render () {

        const { players_bets } = this.state;

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
                    {players_bets.map(this.renderUser)}
                </tbody>
            </table>  
        )
    }
}
