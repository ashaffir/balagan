/* 
Reference help
https://www.youtube.com/watch?v=gTqXHZaRjoU
 */

import React from 'react';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react'; //https://www.npmjs.com/package/qrcode.react
import axios from "axios";
import './Form.css'

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
        user_wallet: null,      
        bet: 0,
        highLow: null,
        our_wallet: '0x69069F7589B35d5a436eCf4718EEE3402B2e3dab',

        data: [],
        id: 0,
        message: null,
        intervalIsSet: false,
        idToDelete: null,
        idToUpdate: null,
        objectToUpdate: null
    
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

    handleBet = (e) => {
        e.preventDefault()
        console.log(`Bet of ${e.target.value} was placed`)
    }

    handleSubmit = (e) => {
        e.preventDefault()
        console.log(`Bet of ${this.state.bet} was placed`)
        console.log(`High-low is ${this.state.highLow}`)
    }

    enterAmount = (e) => {
        this.setState({
            bet: e.target.value
        })
    }

    enterWallet = (e) => {
        this.setState({
            user_wallet: e.target.value
        })
        console.log(`wallet is:${this.state.user_wallet}`)
    }

    getProps = () => {
        this.setState({
            highLow: this.props.highLow
        })
    }

    storeUserData = () => {
        console.log("************************************")
        console.log(`Wallet is: ${this.state.user_wallet}`)
        console.log(`Bet is: ${this.state.bet}`)
        console.log(`Direction is: ${this.props.highLow}`)
    }
    
    checkBet = (e) => {
        e.preventDefault();
        if(this.state.bet === null){
            alert(`Please enter a valid bet (< $50)`);
        } else if (this.state.bet > 50 || this.state.bet < 0){
            alert(`${this.state.bet} is not a legal bet. Please try again!!`);
        } else {
            alert(`You bet ${this.state.bet} that the price of Bitcoin with go ${this.props.highLow}!!`);
        }
    }

    qrcode = () => {
        if (this.state.user_wallet !== null){

        }
    }

    componentDidMount() {
        //Escape key to exit form
        document.addEventListener("keyup", this.onEsc)

        // DB reads
        this.getDataFromDb();
            if (!this.state.intervalIsSet) {
                let interval = setInterval(this.getDataFromDb, 1000);
                this.setState({ intervalIsSet: interval });
            }
    }

    componentWillUnmount() {
    document.removeEventListener("keyup", this.onEsc)
        if (this.state.intervalIsSet) {
            clearInterval(this.state.intervalIsSet);
            this.setState({ intervalIsSet: null });
        }
    }
    
    getDataFromDb = () => {
        fetch("http://localhost:3001/api/getData")
          .then(data => data.json())
          .then(res => this.setState({ data: res.data }));
      }; 
    
    putDataToDB = message => {
    let currentIds = this.state.data.map(data => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
        ++idToBeAdded;
    }

    axios.post("http://localhost:3001/api/putData", {
        id: idToBeAdded,
        message: message
    });
    };

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
                        
                        <h3>You are betting {this.props.highLow}</h3>
                        
                        <form onSubmit={this.handleSubmit} autoComplete="off">
                            
                            {/* <div id="user-wallet" style={formElement}>
                                <input id="wallet" onChange={(e) => {this.enterWallet(e)}} 
                                    placeholder="Your wallet address (optional)"
                                    style={inputField}/>
                            </div> */}
                            
                            <div className="our-wallet" id="our-wallet" style={formElement}></div>
                            
                            <div style={formElement}>
                                <input className="form-element" type='number' id="amount" 
                                    onChange={(e) => {this.enterAmount(e)}} 
                                    placeholder="Bet amount (Between 0 and 50$)"
                                    style={inputField}/>
                            </div>
                            
                            <div style={footerStyle} label="Close the form">
                                <Button type="button" onClick=
                                    {(e) => {
                                        this.onClose(e); 
                                        this.storeUserData();
                                        this.checkBet(e)}}>Bet</Button>
                            </div>
                        </form> 
                    </div>

                    <div>
                        <h3>Our Wallet</h3>
                        <p>0x69069F7589B35d5a436eCf4718EEE3402B2e3dab</p>
                    </div>
                    <div label="QR code section" className="qrSection">
                        <QRCode value={this.state.our_wallet} />
                    </div>
                    
                </div>
            </div>
        )
    }
}

Form.propTypes = {
    onClose: PropTypes.func.isRequired
}