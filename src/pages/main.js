import React, { Component } from 'react';
// import Chart from './chart.js';
import Body from "../components/Body";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../src/style.css";
import '../index.css';
import logo from '../img/swingabit_logo.png';
import Footer from '../components/Footer';

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
        <div style={appStyle} className="App">
          <header className="App-header logo-section" align='center'>
            <a href="/"><img style={logoStyle} src={logo} alt="Swing@bit logo" /></a>
          </header>
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

