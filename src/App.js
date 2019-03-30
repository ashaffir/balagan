import React, { Component } from 'react';
import Modal from './modal.js';
import CurrentValue from './apiData.js';

class App extends Component {

  state = {
    showForm: false,
    show: false,
    highLow: null,
    currentValue: null
  }

  toggleForm() {
    this.setState({
      showForm: !this.state.showForm
    });
  }

  handleBetHigh = (e) => {
    e.preventDefault()
    console.log(`Betting on a high result`)
  }

  handleBetLow = (e) => {
    e.preventDefault()
    console.log(`Betting on a low result`)
  }
 
  getCurrentValue = () => {
    // this.setState({
    //   currentValue: API()
    // })
    console.log(`current  value is ${CurrentValue}`);
  }


  showModal = () => {
    this.setState({
      ...this.state,
     show: !this.state.show
    })    
  }

  closeModal = () => {
    this.setState({
      show: false
    })
  }

  setDirection = (direction) => {
    this.setState({
      highLow: direction
    })
  }

  render() {
    
    return (
      <div className="App">
        <header className="App-header">
          <h1>Swing@Bit</h1>
          
        </header>
        <canvas id="canvas"></canvas>
        <section>
        <table align='center'>
          <tbody >
            <tr className='row'>
              <td>
                <div>
                  <button className="push_button blue" onClick={
                    (e) => {this.showModal();this.setDirection('High')}}>Will be Higher</button>
                </div>
              </td>
              <td>
                <div>
                    <table>
                      <tbody>
                          <tr>
                            <td className="current_value"><h2>Current Value</h2></td>
                          </tr>
                          <tr>
                            <td id="current_value"><h3><CurrentValue /></h3></td>
                          </tr>  
                      </tbody>
                    </table>
                </div>
              </td>
              <td>
                <div>
                  <button type="button" className="push_button red" onClick={
                    (e) => {this.showModal();this.setDirection('Low')}}>Will be Lower</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        </section>
        <Modal 
            onClose={this.showModal}
            show={this.state.show}
            highLow={this.state.highLow}>
          </Modal>

      </div>
    );
  }
}

export default App;
