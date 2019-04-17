/* 
Creating the database:
=======================

CREATE DATABASE swingabit;
*/

const cycleValue = require('./cycleValue.js');

const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();

app.use(cors());

const SELECT_ALL_ENTRIES = 'SELECT * FROM betting_table';
const SELECT_ALL_PLAYERS = 'SELECT * FROM players_table where result=1 and time > date_sub(now(), interval 1 hour)'; //Displaying only the winners
const SELECT_CURRENT_CYCLE_VALUE = 'SELECT * FROM cycle_value_table WHERE minutes=0 AND hours=';

const DB_PORT = 4000;

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

app.get('/', (req, res) => {
    res.send('You are at the right place')
})

app.get('/bets', (req,res) => {
    connection.query(SELECT_ALL_ENTRIES, (err, result) => {
        if(err){
            return res.send(err)
        } else {
            return res.json({
                bets: result
            })
        }
    })
})

// Cycle Value Section

// Presenting the current cycle value
app.get('/cycle_value', (req,res) => {
    let hour = parseInt(new Date().getHours());
    connection.query(`${SELECT_CURRENT_CYCLE_VALUE}${hour} limit 1`, (err, result) => {
        if(err) {
            return res.send(err)
        } else {
            return res.json({
                cycle_value: result
            })
        }
    })
})

//////////////// END CYCLE VALUE ESECTION //////////////////

app.get('/players', (req,res) => {
    connection.query(`${SELECT_ALL_PLAYERS}`, (err, result) => {
        if(err) {
            return res.send(err)
        } else {
            return res.json({
                players_bets: result
            })
        }
    })
})

app.get('/bets/add', (req, res) => {
    const { ulw, direction, cycle_value } = req.query;
    const ADD_NEW_BET = `INSERT INTO betting_table (user_local_wallet, direction, cycle_value) VALUES ('${ulw}','${direction}','${cycle_value}')`;
    connection.query(ADD_NEW_BET, err => {
        if(err){
            res.send('Error adding a bet!')
        } else {
            res.send(`Added a new bet: ${ulw} going ${direction} from ${cycle_value}.`)
        }
    })
})

app.get('/players_bets/add', (req, res) => {
    const { uid, direction, cycle_value, bet, w_bet, bet_hour, bet_minutes } = req.query;
    const ADD_NEW_BET = `INSERT INTO players_table (user_id, direction, cycle_value, bet, w_bet, bet_hour, bet_minutes) 
                         VALUES ('${uid}','${direction}','${cycle_value}','${bet}', '${w_bet}', '${bet_hour}', '${bet_minutes}')`;
    connection.query(ADD_NEW_BET, err => {
        if(err){
            res.send(`Error adding a players bet. ${err}`) 
        } else {
            res.send(`Added a new players bet: ${uid} going ${direction} from ${cycle_value}.`)
        }
    })
})

app.get('/players_update', (req, res) => {
    const {uid} = req.query;
    const UPDATE_STATUS = `update players_table set status=1 where user_id='${uid}' and bet_hour=${parseInt(new Date().getHours())-1}`;
    console.log(UPDATE_STATUS);
    connection.query(UPDATE_STATUS, (err) => {
        if(err) {
            res.send(`Error updating the user status field!!`)
        } else {
            res.send(`updated status for user ${uid} at ${new Date().getHours()}:${new Date().getMinutes()} ${new Date().getDate()}`);
        }
    })
})

app.get('/bets/update_payment', (req, res) => {
    const { ulw, bet, user_wallet } = req.query;
    const UPDATE_PAYMENT = `UPDATE betting_table SET bet=${bet}, user_wallet='${user_wallet}', bet_time=bet_time WHERE user_local_wallet='${ulw}'`;
    connection.query(UPDATE_PAYMENT, err => {
        if(err){
            console.log(err)
            res.send('Failed to update payment!')
        } else {
            res.send(`Updated payment of ${bet} made by user ${ulw}.`)
        }
    })
})

app.get('/bets/update_result', (req, res) => {
    const { ulw, result} = req.query;
    const UPDATE_RESULT = `UPDATE betting_table SET result=${result}, bet_time=bet_time WHERE user_local_wallet='${ulw}'`;
    connection.query(UPDATE_RESULT, err => {
        if(err){
            console.log(err)
            res.send('Failed to update result!')
        } else {
            res.send(`Updated result for user ${ulw}.`)
        }
    })
})

app.get('/bets/update_payout', (req, res) => {
    const { ulw, payout} = req.query;
    const UPDATE_PAYOUT = `UPDATE betting_table SET payout=${payout}, bet_time=bet_time WHERE user_local_wallet='${ulw}'`;
    connection.query(UPDATE_PAYOUT, err => {
        if(err){
            console.log(err)
            res.send('Failed to update payout!')
        } else {
            res.send(`Updated payout of ${payout} for user ${ulw}.`)
        }
    })
})

app.get('/bets/update_status', (req, res) => {
    const { ulw, status} = req.query;
    const UPDATE_STATUS = `UPDATE betting_table SET status=${status}, bet_time=bet_time WHERE user_local_wallet='${ulw}'`;
    connection.query(UPDATE_STATUS, err => {
        if(err){
            console.log(err)
            res.send('Failed to update status!')
        } else {
            res.send(`User ${ulw} status was updated to ${status} .`)
        }
    })
})

app.listen(DB_PORT, () => {
    console.log(`Listening on port ${DB_PORT}`) 
})

