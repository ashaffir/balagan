import React from 'react';
import PriceCard from './PriceCard';
import Form from './Form.js';
//import axios from 'axios';
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import Widgets from 'fusioncharts/fusioncharts.widgets';
import ReactFC from 'react-fusioncharts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import './Body.css'

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
            }
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
            fetch(this.BASE_URL + 'btc-usd')
            .then(res => res.json())
            .then(d => {
                let x_axis = this.clientDateTime();
                let y_axis = d.ticker.price;
                console.log(`current fucking value = ${d.ticker.price}`);
                this.setState({
                  btcusd: d.ticker.price
                });
                this.chartRef.feedData("&label=" + x_axis + "&value=" + y_axis);
            });
        }, 2000);
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
        highLow: direction
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
                    
                    {/* <PriceCard header="Litecoin(LTC)"   src={'/litecoin.png'} alt="fireSpot" label="(Price in USD)"  value={this.state.ltcusd}/>
                    <PriceCard header="Ethereum(ETH)" src={'/ethereum.png'} alt="fireSpot" label="(Price in USD)"    value={this.state.ethusd}/> */}
                    
                    <section className="buttons-section">
                      <table >
                        <tbody >
                          <tr className="buttons-row">
                            <td>
                              <div>
                                <button className="push_button blue" onClick={
                                  (e) => {this.showForm();this.setDirection('Up')}}>Will be Higher</button>
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
                                  (e) => {this.showForm();this.setDirection('Down')}}>Will be Lower</button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </section>
                 </div>          
            </div>
            <Form 
            onClose={this.showForm}
            show={this.state.show}
            highLow={this.state.highLow}>
          </Form>
		</div>
        )
    }
}

 export default Body;
