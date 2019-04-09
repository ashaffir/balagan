import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "../src/style.css";
import {BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import FaqPage from './pages/faq'
import './index.css'
import Main from './pages/main';
import Cookies from 'universal-cookie';

const balanceCookie = new Cookies();
let currentBalance = 0;

class App extends Component {
 
  state = {
    showForm: false,
    show: false,
    highLow: null,
    currentValue: null,
    balance: 0
  }

  checkbalance = () => {
    currentBalance = balanceCookie.get('balance');
    console.log(`checkBalance= ${currentBalance}`)
    if (isNaN(currentBalance)){
      balanceCookie.set('balance',10000, {path: '/'});
      this.setState({
        balance: 10000
      })
    }
  }
  render() {
    //Backend demo
    // const { data } = this.state;
    // End demo
    
    return (
      <BrowserRouter >
        <React.Fragment>
        {/* <MainNavigation /> */}
        <Switch>
          <Redirect from='/' to='/main' exact  />
          <Route path='/main' component={Main} />
          <Route path='/faq' component={FaqPage} />
        </Switch> 
          </React.Fragment>

        <div>
        {/* Backend Demo */}
        {/* <MongoDB /> */}
        {/* <DomCookies balance={this.checkbalance()} bet={0}/> */}
        {this.checkbalance()}
        </div>
      </BrowserRouter>
      
        
    );
  }
}

export default App;
