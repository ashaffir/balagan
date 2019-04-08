/* 
Creating the database:
=======================

CREATE DATABASE swingabit;
*/

const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();

app.use(cors());

const CREATE_BETS_TABLE = 'CREATE TABLE IF NOT EXISTS betting_table (idx INT AUTO_INCREMENT, user_local_wallet VARCHAR(35), direction VARCHAR(5), cycle_value FLOAT(7,3), bet_time TIMESTAMP, bet FLOAT(5,4), user_wallet VARCHAR(35), result INT, payout FLOAT(5,4), status BOOLEAN ,PRIMARY KEY (idx));';

const SELECT_ALL_ENTRIES = 'SELECT * FROM betting_table';
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

connection.query(CREATE_BETS_TABLE, err => {
    if(err){
        console.log('Failed to create betting_table'); 
    }
})

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

