// Instructions are at: https://canvasjs.com/docs/charts/integration/react/

import React, { Component } from 'react';
import CanvasJSReact from './assets/canvasjs.react';
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

let today = new Date();
let time = today.getHours() + ":" + today.getMinutes();


// let dps = [{x: 1, y: 10}, {x: 2, y: 13}, {x: 3, y: 18}, {x: 4, y: 20}, {x: 5, y: 17},{x: 6, y: 10}, {x: 7, y: 13}, {x: 8, y: 18}, {x: 9, y: 20}, {x: 10, y: 17}];   //dataPoints.
let dps = [{x: new Date().getSeconds(), y:4000}];
const updateInterval = 3000;
let xVal = dps.length + 1;
let yVal = 15;


export default class Chart extends Component {
	constructor() {
		super();
		this.updateChart = this.updateChart.bind(this);
	}
	componentDidMount() {
		setInterval(this.updateChart, updateInterval);
	}
	updateChart() {
		yVal = yVal +  Math.round(5 + Math.random() *(-5-5));
		dps.push({x: xVal,y: yVal});
		xVal++;
		if (dps.length >  10 ) {
			dps.shift();
		}
		this.chart.render();
	}
	render() {
		const options = {
			axisX: {
				title: 'Time',
				type: 'time',
				unit: 'minute'
			},
			theme: "dark2",
			title :{
				text: ""
			},
			data: [{
				type: "line",
				dataPoints : dps
			}]
		}
		
		return (
		<div>
			<h1>BTC/USD</h1>
			<CanvasJSChart options = {options} 
				onRef={ref => this.chart = ref}
			/>
			{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
		</div>
		);
	}
}
