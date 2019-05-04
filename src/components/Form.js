/* 
Reference help
https://www.youtube.com/watch?v=gTqXHZaRjoU
 */

import React from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react'; //https://www.npmjs.com/package/qrcode.react;
import './Form.css';
import Cookies from 'universal-cookie';
// import connection from '../utils/db';

const userIdCookie = new Cookies();

const backdropStyle = {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 50
};

const formStyle = {
    backgroundColor: '#fff',
    borderRadius: 5,
    maxWidth: 500,
    minHeight: 500,
    margin: '0 auto',
    padding: 30,
    position: 'relative'
};

const upperClose = {
    position:'relative',
    top:0,
    textAlign: 'right',
    cursor: 'pointer'
}

const balanceCookie = new Cookies();
let current_balance = 0;
let new_balance = 0;

export default class Form extends React.Component {
    
    state = {
        direction: null,
        current_cycle: null,
        cycle_value: null,
        bet_time: null,
        user_local_wallet: 'USER_LOCAL_WALLET',
        current_balance: 0,
        user_id: 'nana',
        bet: 0
    };

    onClose = (e) => {
        this.props.onClose && this.props.onClose(e);
        
        // Refreshing the page for the player info table to update
        window.location.reload();
    }


    //Handling the closing of the form upon Escape key press

    onEsc = (e) => {
        document.addEventListener('keyup', (e) => {
            if (e.keyCode === 27 && this.props.show) this.onClose();
        })
    }

    qrcode = () => {
        if (this.state.user_wallet !== null){
            
        }
    }

    calculateTime = () => {
        const now = new Date();
        let hour = now.getHours();
        let nextHour = '';
        if(hour !== 23){
            nextHour = `${hour + 1}:00`;
        } else {
            nextHour = '00:00';
        }
        this.setState({
            // current_cycle: this.props.current_cycle,
            nextHour: nextHour

        });
    }

    enterAmount = (e) => {
        this.setState({
            bet: e.target.value
        })
    }

    handleBet = (e) => {
        e.preventDefault();
        let uid = this.props.user_id;
        let direction = this.props.direction;
        let cycle_value = this.props.cycle_value;
        let bet = this.state.bet;
        let min = parseInt(new Date().getMinutes());
        let w_bet = (60 - min)*bet;
        let bet_hour = parseInt(new Date().getHours());
        let bet_minutes = parseInt(new Date().getMinutes());
        current_balance = balanceCookie.get('balance');
        let PLAYER_BET_ADD = `http://localhost:4000/players_bets/add?uid=${uid}&direction=${direction}&cycle_value=${cycle_value}&bet=${bet}&w_bet=${w_bet}&bet_hour=${bet_hour}&bet_minutes=${bet_minutes}`;

        if ((parseInt(current_balance) - this.state.bet) >= 0) {
            new_balance = (parseInt(current_balance) - this.state.bet)
            balanceCookie.set('balance', new_balance, {path: '/'});
            this.setState({
                current_balance: new_balance
            });

            //Writing  the bet into the DB
            fetch(PLAYER_BET_ADD)
            .catch(err => console.log(err));
    
        } else if(current_balance > 0) {
            alert(`Please enter a bet lower or equal ${current_balance}`)
        } else {
            alert(`You have no free points left, try betting on real bitcoins :) `)
        }
        
    }

    setBetTime () {
        let now = new Date();
        let time = `${now.getHours()}:${now.getMinutes()}`;
        this.setState({
          bet_time: time
        })
      }

    componentDidMount() {
        //Escape key to exit form
        document.addEventListener("keyup", this.onEsc);
        this.setState({
            user_id: userIdCookie.get('user_id')
        })
        this.calculateTime();
    }

    componentWillUnmount() {
        document.removeEventListener("keyup", this.onEsc)
        console.log(`bet_time: ${this.state.bet_time}`)
    }

    
    render() {
        if (!this.props.show){
            return null
        }
        return (
            <div style ={backdropStyle}>
                <div style={formStyle}>
                    {/* {this.props.children} */}
                    <div>
                        <div style={upperClose} onClick={(e) => this.onClose(e)}>X</div>
                        
                        <h3>You are betting that the price at<span> </span>  
                            {this.state.nextHour} will go<span> </span> 
                            {this.props.direction} than<span> </span>
                            {this.props.cycle_value} </h3>
                    </div>

                    <div label="QR code section" className="qrSection">
                        <QRCode value={this.state.user_local_wallet} />
                    </div>
                    <div>
                        <p>Current cycle is until {this.state.nextHour}</p>
                    </div>
                    <div>
                        <p>Or if you want to play on free points:</p>
                        <form onSubmit={(e) => {
                            this.onClose(e);
                            this.handleBet(e);
                            this.setBetTime();
                            // this.updatePlayersTable();
                            }}>
                            <input type="number" autofocus="autofocus" onChange={(e) => {this.enterAmount(e)}}/>
                            <input type='submit' value='Bet'/>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
} 

Form.propTypes = {
    onClose: PropTypes.func.isRequired
}