import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "../src/style.css";
import {BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import FaqPage from './pages/faq'
import './index.css'
import Main from './pages/main';
import MainNavigation from './components/mainNavigation';


class App extends Component {
 
  state = {
    showForm: false,
    show: false,
    highLow: null,
    currentValue: null
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
        </div>
      </BrowserRouter>
      
        
    );
  }
}

export default App;
