import React, { Component } from 'react';
// import Chart from './chart.js';
import Body from "../components/Body";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../src/style.css";
import '../index.css'
import logo from '../img/sab-logo7.png'
import Gamers from '../components/Gamers';
import Footer from '../components/Footer';


export default class Main extends Component {

  state = {
    showForm: false,
    show: false,
    highLow: null,
    currentValue: null
  }

  render() {
    
    return (
        <div className="App">
          <header className="App-header logo-section" align='center'>
            <img src={logo} alt="Swing@bit logo" />
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
            <Gamers />
            <Footer />
          </div>
        </div>
    );
  }
}

