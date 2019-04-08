/* 
Reference help
https://www.youtube.com/watch?v=gTqXHZaRjoU
 */

import React from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react'; //https://www.npmjs.com/package/qrcode.react;
import './Form.css';
import Cookies from 'universal-cookie';

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

const formElement = {
    borderRadius: '5px',
    padding: 5,
    width: '150px',
    boxSizing: 'border-box'

};

const inputField = {
    width: '300px',
    borderRadius: '5px'

}
const footerStyle = {
    position: 'absolute',
    bottom: 20
};

const upperClose = {
    position:'relative',
    top:0,
    textAlign: 'right',
    cursor: 'pointer'
}


export default class Form extends React.Component {
    state = {
        highLow: null,
        current_cycle: 0,
        cycle_value: 'CYCLE_VALUE',
        user_local_wallet: 'USER_LOCAL_WALLET',
        bet: 0
    };

    onClose = (e) => {
        this.props.onClose && this.props.onClose(e);
    }


    //Handling the closing of the form upon Escape key press

    onEsc = (e) => {
        document.addEventListener('keyup', (e) => {
            if (e.keyCode === 27 && this.props.show) this.onClose();
        })
    }

    getProps = () => {
        this.setState({
            highLow: this.props.highLow
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
            nextHour = '00';
        }
        this.setState({
            current_cycle: nextHour
        });
    }

    enterAmount = (e) => {
        this.setState({
            bet: e.target.value
        })
    }

    handleBet = (e) => {
        e.preventDefault()
        console.log(`bet placed = ${this.state.bet}`);
    }

    updateCookies = (e) => {
        const userIdCookie = new Cookies();
        const betCookie = new Cookies();
        userIdCookie.set('userId', 'userLocalWallet', { path: '/' });
        betCookie.set('useBet', this.state.bet, { path: '/' });
        console.log(userIdCookie.get('useBet')); // Amount
    }
    componentDidMount() {
        //Escape key to exit form
        document.addEventListener("keyup", this.onEsc);
        this.calculateTime();
    }

    componentWillUnmount() {
    document.removeEventListener("keyup", this.onEsc)
    }
    
    render() {
        if (!this.props.show){
            return null
        }
        return (
            <div style ={backdropStyle}>
                <div style={formStyle}>
                    {this.props.children}
                    <div>
                        <div style={upperClose} onClick={(e) => this.onClose(e)}>X</div>
                        
                        <h3>You are betting that the price at {this.state.current_cycle} will go {this.props.highLow} than {this.state.cycle_value} </h3>
                    </div>

                    <div label="QR code section" className="qrSection">
                        <QRCode value={this.state.user_local_wallet} />
                    </div>
                    <div>
                        <p>Current cycle is until {this.state.current_cycle}</p>
                    </div>
                    <div>
                        <p>Or if you want to play on free points:</p>
                        <input type="number" onChange={(e) => {this.enterAmount(e)}}/>
                        <button type="submit" onClick={(e) => {
                            this.handleBet(e);
                            this.onClose(e);
                            this.updateCookies(e);
                            }}>Bet</button>
                    </div>
                </div>
            </div>
        )
    }
} 

Form.propTypes = {
    onClose: PropTypes.func.isRequired
}