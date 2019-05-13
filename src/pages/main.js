import React, { Component } from 'react';

//Components
import Body from "../components/Body";
import Footer from '../components/Footer';

// Design
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/style.css";
import logo from '../img/swingabit_logo-1.png';

const logoStyle = {
    maxWidth: '30%',
    height: 'auto'
}

const appStyle = {
  background: '#f1eb3f'
}

export default class Main extends Component {

  state = {
    showForm: false,
    show: false,
    highLow: null,
    currentValue: null
  }

  render() {
    
    return (
        <div style={appStyle} >
          <div className="logo-section">
            <a href="/"><img style={logoStyle} src={logo} alt="Swing@bit logo" /></a>
          </div>
          {/* Start Chart Section */}
          {/* <Chart /> */}
          {/* <style type="text/css">
            g[class^='raphael-group-'][class$='-creditgroup'] {
                display:none !important;
            }
          </style> */}
          {/* <Header className="App-header" branding="Do you know if it will go up or down?" align='center'/> */}
          <div className="container">
            <Body />
          </div>
            <Footer />
        </div>
    );
  }
}

