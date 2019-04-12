// This module will handle all calculations in the backend
const mysql = require('mysql');
const fetch = require("node-fetch");

const TICKER_URL = 'https://cors.io/?https://api.cryptonator.com/api/ticker/';
// let cycle_value = 0;
// let current_value = 0;
// let cycle_hour = 0;

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


// writeCycleValue();


// const writeCylceValue = () => {
//     setInterval(() => {
//         fetch(TICKER_URL + 'btc-usd')
//             .then(res => res.json())
//             .then(d => {
//                 current_value = d.ticker.price;
//                 console.log(`cycle hour: ${cycle_hour}  cycle value: ${cycle_value}  current value: ${current_value}`);
//                 return current_value;
//             });
//     }, 1000);

//     if(parseInt(new Date().getMinutes()) === 41){
//         cycle_value = current_value;
//         cycle_hour = parseInt(new Date().getHours());
//     }
    
//     return {
//         current_value: current_value,
//         cycle_value: cycle_value,
//         cycle_hour: cycle_hour

//     }
// }

// async function getData() {
//     await fetch(TICKER_URL + 'btc-usd')
//     .then(res => res.json())
//     .then(d => {
//         current_data = d.ticker.price;
//     });

//     console.log(`response = ${current_data}`);

//     return current_data

// }


// function updateResults() {

// }

// function updatePayout() {

// }

// function updateStatus() {

// }

// // setTimeout(() => {
// //     writeCylceValue()
// // }, 1000);

// writeCylceValue();


module.exports = {
    writeCycleValue
};
//     cycle_value,
//     setCurrentValue,
//     // setCycleValue,
//     updateResults,
//     updatePayout,
//     updateStatus
// };