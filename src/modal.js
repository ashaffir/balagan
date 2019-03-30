/* 
Reference help
https://www.youtube.com/watch?v=gTqXHZaRjoU
 */

import React from 'react';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react'; //https://www.npmjs.com/package/qrcode.react

const backdropStyle = {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 50
};

const modalStyle = {
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

const qrSection = {
    maxWidth: 100,
    minHeight: 100,
    padding: 5,
    textAlign: 'center'
}

export default class Modal extends React.Component {
    state = {
        user_wallet: null,      
        bet: null,
        highLow: null,
        our_wallet: '0x69069F7589B35d5a436eCf4718EEE3402B2e3dab'
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
    componentDidMount(){
        document.addEventListener("keyup", this.onEsc)
    }

    componentWillUnmount () {
        document.removeEventListener("keyup", this.onEsc)
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
    }
    
    checkBetRange = () => {
        if(this.state.bet > 50 || this.state.bet > 0){
            alert("This is not a legal bet try again!!");
        }
    }

    qrcode = () => {
        if (this.state.user_wallet !== null){

        }
    }

    render() {
        if (!this.props.show){
            return null
        }
        return (
            <div style ={backdropStyle}>
                <div style={modalStyle}>
                    {this.props.children}
                    <div>
                        <div style={upperClose} onClick={(e) => this.onClose(e)}>X</div>
                        
                        <h3>You are betting {this.props.highLow}</h3>
                        
                        <form onSubmit={this.handleSubmit} autoComplete="off">
                            
                            <div id="user-wallet" style={formElement}>
                                <input id="wallet" onChange={(e) => {this.enterWallet(e)}} 
                                    placeholder="Your wallet address (required)"
                                    style={inputField}/>
                            </div>
                            
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
                                        this.checkBetRange()}}>Bet</Button>
                            </div>
                        </form> 
                    </div>

                    <div>
                        <h2>Our Wallet</h2>
                        <p>0x69069F7589B35d5a436eCf4718EEE3402B2e3dab</p>
                    </div>
                    <div label="QR code section" style={qrSection} align='center'>
                        <QRCode value={this.state.our_wallet} />
                    </div>
                    
                </div>
            </div>
        )
    }
}

Modal.propTypes = {
    onClose: PropTypes.func.isRequired
}