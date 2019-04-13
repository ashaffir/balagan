// This module will handle all calculations in the backend
const mysql = require('mysql');
const fetch = require("node-fetch");

const TICKER_URL = 'https://cors.io/?https://api.cryptonator.com/api/ticker/';

const CREATE_CYCLE_VALUE_TABLE = 'CREATE TABLE IF NOT EXISTS cycle_value_table (idx INT AUTO_INCREMENT, cycle_value FLOAT(8,3), hour INT, minutes INT, time TIMESTAMP, PRIMARY KEY (idx));';

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

connection.query(CREATE_CYCLE_VALUE_TABLE, err => {
    if(err){
        console.log('Failed to create betting_table'); 
    }
})


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
    }, 15000);
}




module.exports = {
    writeCycleValue
};
