import React from 'react';
import PriceCard from './PriceCard';
import Timing from './Timing';
import Form from './Form.js';
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import Widgets from 'fusioncharts/fusioncharts.widgets';
import ReactFC from 'react-fusioncharts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import './Body.css'

import Cookies from 'universal-cookie';

const balanceCookie = new Cookies();
let now = new Date();
let hour = 0;
let nextHour = 0;


ReactFC.fcRoot(FusionCharts, Charts, Widgets, FusionTheme);

class Body extends React.Component{
    constructor(props){
        super(props);
        this.BASE_URL = 'https://cors.io/?https://api.cryptonator.com/api/ticker/';
        this.chartRef = null;
        this.state = {
            btcusd: '-',
            ltcusd: '-',
            ethusd: '-',
            showChart: false,
            initValue: 0,
            dataSource : {
                "chart": {
                    "caption": "Bitcoin Current Value",
                    "subCaption": "",
                    "xAxisName": "Local Time",
                    "yAxisName": "USD",
                    "numberPrefix": "$",
                    "refreshinterval": "2",
                    "slantLabels": "1",
                    "numdisplaysets": "10",
                    "labeldisplay": "rotate",
                    "showValues": "0",
                    "showRealTimeValue": "0",
                    "theme": "fusion"    
                },
                "categories": [{
                    "category": [{
                        "label": this.clientDateTime().toString()
                    }]
                }],
                "dataset": [{
                    "data": [{
                        "value": 0
                    }]
                }]
            },
          cycle_value: 0
        };
        this.chartConfigs = {
            type: 'realtimeline',
            renderAt: 'container',
            width: '100%',
            height: '350',
            dataFormat: 'json'
        };
    }

    componentDidMount() {
        this.getDataFor('btc-usd', 'btcusd');
        this.getDataFor('ltc-usd', 'ltcusd');
        this.getDataFor('eth-usd', 'ethusd');
    }

    startUpdatingData(){
        setInterval(() => {
            now = new Date();
            fetch(this.BASE_URL + 'btc-usd')
            .then(res => res.json())
            .then(d => {
                let x_axis = this.clientDateTime();
                let y_axis = d.ticker.price;
                this.setState({
                  btcusd: d.ticker.price
                });
                this.chartRef.feedData("&label=" + x_axis + "&value=" + y_axis);
              })
              .catch((err) => {
                console.log(err)
              });  
        }, 2000); // Data streaming to the graph, time interval - 2000 = 2sec
    }

    getDataFor(conversion, prop){
        fetch(this.BASE_URL + conversion, {
            mode: 'cors'
        })
        .then(res => res.json())
        .then(d => {
            if(prop === 'btcusd'){
                const dataSource = this.state.dataSource;
                dataSource.chart.yAxisMaxValue =  parseInt(d.ticker.price) + 5;
                dataSource.chart.yAxisMinValue =  parseInt(d.ticker.price) - 5;
                dataSource.dataset[0]['data'][0].value = d.ticker.price;
                this.setState({
                    showChart: true,
                    dataSource: dataSource,
                    initValue: d.ticker.price
                }, ()=>{
                    
                    this.startUpdatingData();
                })
            }

            this.setState({
                [prop]: d.ticker.price
            });
        })
        .catch((err) => {
          console.log(err)
        })
        
    }

    static addLeadingZero(num) {
        return (num <= 9) ? ("0" + num) : num;
    }


    clientDateTime() {
        var date_time = new Date();
        var curr_hour = date_time.getHours();
        var zero_added_curr_hour = Body.addLeadingZero(curr_hour);
        var curr_min = date_time.getMinutes();
        var curr_sec = date_time.getSeconds();
        var curr_time = zero_added_curr_hour + ':' + curr_min + ':' + curr_sec;
        return curr_time
    }

    getChartRef(chart){
        this.chartRef = chart;
        
      
    }

    // Form functions)
    showForm = () => {
      this.setState({
        ...this.state,
       show: !this.state.show
      }) 
    } 
    closeForm = () => {
      this.setState({
        show: false
      })
    }
  
    setDirection = (direction) => {
      this.setState({
        direction: direction
      })
    }

   async getCycleValue() {
        await fetch('http://localhost:4000/cycle_value')
        .then(response => response.json())
        .then(response => {this.setState ({cycle_value: response['cycle_value'][0]['cycle_value']})})
        .catch((err) => {
          console.log(err)
        })
    }

    render(){
        return (
        <div className="row mt-5 mt-xs-4">
          <div className="col-12">
                  <div className="card custom-card mb-5 mb-xs-4">
                    <div className="card-body">
                              {
                              this.state.showChart ? 
                              <ReactFC 
                              {...this.chartConfigs}
                              dataSource={this.state.dataSource} 
                              onRender={this.getChartRef.bind(this)}/>: null
                          }
                    </div>
                  </div>
            </div>
            <div className="row col-12 mb-5 buttons-area">
                 <div className="card-deck custom-card-deck">
                    
                    {/* <PriceCard header="Bitcoin(LTC)"   src={'/bitcoin.png'} alt="fireSpot" label="(Price in USD)"  value={this.state.btcusd}/> */}
                    {/* <PriceCard header="Litecoin(LTC)"   src={'/litecoin.png'} alt="fireSpot" label="(Price in USD)"  value={this.state.ltcusd}/>
                    <PriceCard header="Ethereum(ETH)" src={'/ethereum.png'} alt="fireSpot" label="(Price in USD)"    value={this.state.ethusd}/> */}
                    
                    <section className="buttons-section">
                      <table >
                        <tbody >
                          <tr className="buttons-row">
                            <td>
                              <div>
                                <button className="push_button blue" onClick={
                                  (e) => {
                                    this.showForm();
                                    this.setDirection('Up')
                                    }}>Will be Higher</button>
                              </div>
                            </td>
                            <td>
                            <PriceCard 
                              header="Bitcoin" 
                              src={'/bitcoin.png'} 
                              alt="fireSpot" 
                              label="(Price in USD)"   
                              value={this.state.btcusd} 
                            />
                            </td>
                            <td>
                              <div>
                                <button type="button" className="push_button red" onClick={
                                  (e) => {
                                    this.showForm();
                                    this.setDirection('Down');
                                    this.getCycleValue();
                                    }}>Will be Lower</button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      
                      <Timing />

                    </section>
                 </div>          
            </div>
            <Form 
            onClose={this.showForm}
            show={this.state.show}
            direction={this.state.direction}
            cycle_value={this.state.cycle_value} 
            />
          <h3>Current balance is {balanceCookie.get('balance')}</h3>
		</div>
        )
    }
}

 export default Body;
