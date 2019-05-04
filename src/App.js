import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "../src/style.css";
import {BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import FaqPage from './pages/faq'
import './index.css'
import Main from './pages/main';
import Cookies from 'universal-cookie';

// Cookies
const balanceCookie = new Cookies();
const userIdCookie = new Cookies();

const randomString = require('random-string');
let currentBalance = 0;
let uid = '';

class App extends Component {
 
  state = {
    showForm: false,
    show: false,
    highLow: null,
    currentValue: null,
    balance: 0,
    user_id: 'none'
  }

  componentDidMount(){
    currentBalance = balanceCookie.get('balance');
    uid = randomString();

    if (isNaN(currentBalance)){
      balanceCookie.set('balance',10000, {path: '/'});
      userIdCookie.set('user_id', uid, {path:'/'});
      this.setState({
        balance: 10000,
        user_id: uid
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
          {/* <Redirect from='/' to='/main' exact  /> */}
          <Route path='/' component={Main} />
          <Route path='/faq' component={FaqPage} />
        </Switch> 
          </React.Fragment>

        <div>
        {/* Backend Demo */}
        {/* <MongoDB /> */}
        </div>
      </BrowserRouter>
      
        
    );
  }
}

export default App;
