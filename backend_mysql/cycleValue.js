// This module will handle all calculations in the backend
const mysql = require('mysql');
const fetch = require("node-fetch");
const result = require('../src/utils/result');
const db = require('../src/utils/db');

const TICKER_URL = 'https://cors.io/?https://api.cryptonator.com/api/ticker/';

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1q@W#E$R5t',
    database: 'swingabit'
});

connection.connect(err => {
    if(err){
        console.log(err)
    } 
});

const writeCycleValue = () => {
      
    setInterval(() => {
        fetch(TICKER_URL + 'btc-usd')
            .then(res => res.json())
            .then(d => {
                const ADD_VALUE = `INSERT INTO cycle_value_table (cycle_value, minutes, hours) VALUES ('${d.ticker.price}','${parseInt(new Date().getMinutes())}','${parseInt(new Date().getHours())}')`;
                connection.query(ADD_VALUE, err => {
                    if(err){
                        console.log(`Error writing value to DB ${err}`);
                    } else {
                        console.log(`writing ${d.ticker.price} to DB.`)
                    }
                })
            })
            .catch((err) => {
                console.log(err)
            });
        }, 5000);

    // setInterval(() => {
    //     BlockchainTicker();    //Every 15 min refresh rate
    //     coinDeskTicker();
    // }, 5000)
}

writeCycleValue();

async function BlockchainTicker(){
    let data = await fetch('https://blockchain.info/ticker');
    let main = await data.json();
    console.log(`data from Blockchian.info: ${main['USD']['last']}`);
}


async function coinDeskTicker() {
    let data = await fetch ('https://api.coindesk.com/v1/bpi/currentprice.json');
    let main = await data.json();
    console.log(`data from CoinSesk: ${main['bpi']['USD']['rate']}`);
}

// coinDeskTicker();

async function resCalc(){
    await result.resultsCalculation(); 
}

setInterval(async () => {
        await resCalc().catch((err) => {console.log(`failed at resCalc ${err}`)});
}, 300000);

setInterval(async () => {
    console.log(`Cleaning the Cycle value DB at ${new Date().toLocaleString()}`)
    await db.cleanCyclevalue().catch((err) => {console.log(`failed at cleaning DB ${err}`)});
}, 3600000);

setInterval(async() => {
    console.log(`Updating DB status for old players at ${new Date().toLocaleString()}`)
    await db.updatePlayersStatus().catch((err) => { console.log(`failed to update DB status for old players ${err}`)});
}, 1800000)

module.exports = {
    writeCycleValue
    // resCalc
};
