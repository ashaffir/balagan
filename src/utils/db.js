

const mysql = require('mysql');

// Creating the tables queries:
const CREATE_PLAYERS_TABLE = 'CREATE TABLE IF NOT EXISTS players_table (idx INT AUTO_INCREMENT, user_id VARCHAR(35), direction VARCHAR(5), cycle_value FLOAT(8,4), time timestamp default current_timestamp on update current_timestamp, bet_hour int, bet_minutes int, bet INT,w_bet INT,result INT, payout FLOAT(10,4), status BOOLEAN ,PRIMARY KEY (idx));';
const CREATE_CYCLE_VALUE_TABLE = 'CREATE TABLE IF NOT EXISTS cycle_value_table (idx INT AUTO_INCREMENT, cycle_value FLOAT(10,4), hours int, minutes int, time TIMESTAMP, PRIMARY KEY (idx));';
const CREATE_BETS_TABLE = 'CREATE TABLE IF NOT EXISTS betting_table (idx INT AUTO_INCREMENT, user_local_wallet VARCHAR(35), direction VARCHAR(5), cycle_value FLOAT(7,3), bet_time TIMESTAMP, bet FLOAT(5,4), user_wallet VARCHAR(35), result INT, payout FLOAT(5,4), status BOOLEAN ,PRIMARY KEY (idx));';


// Maintenance commands
const CLEAN_DB_CYCLE_VALUE = `delete from cycle_value_table where time < date_sub(now(), interval 3 hour);`;
const CLEAN_DB_UPDATE_OLD_PLAYERS_STATUS = `update players_table set status=0 where status is NULL and time < date_sub(now(), interval 1 hour);`

class Database {
    constructor() {
        this.connection = mysql.createConnection( {
            host: 'localhost',
            user: 'root',
            password: '1q@W#E$R5t',
            database: 'swingabit'
        } );
    }
    query( sql, args ) {
        return new Promise( ( resolve, reject ) => {
            this.connection.query( sql, args, ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    }
    
    execute ( callback ) {
        const database = new Database();
        return callback( database ).then(
            result => database.close().then( () => result ),
            err => database.close().then( () => { throw err; } )
        );
    };


    close() {
        return new Promise( ( resolve, reject ) => {
            this.connection.end( err => {
                if ( err )
                    return reject( err );
                resolve();
            } );
        } );
    }
}



const Connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1q@W#E$R5t',
    database: 'swingabit'
});

Connection.connect(err => {
    if(err){
        console.log(err)
    } 
});

Connection.query(CREATE_PLAYERS_TABLE, err => {
    if(err){
        console.log('Failed to create players_table'); 
    } else {
        console.log(`PLAYERS TABLE CREATED AT: ${new Date().toLocaleString()}`);
    }
})

Connection.query(CREATE_CYCLE_VALUE_TABLE, err => {
    if(err){
        console.log('Failed to create cycle_value_table'); 
    } else {
        console.log(`CYCLE VALUE TABLE CREATED AT: ${new Date().toLocaleString()}`);
    }
})


Connection.query(CREATE_BETS_TABLE, err => {
    if(err){
        console.log('Failed to create betting_table'); 
    } else {
        console.log(`BETS TABLE CREATED AT: ${new Date().toLocaleString()}`);
    }
})


async function cleanCycleValue(){
    await Connection.query(CLEAN_DB_CYCLE_VALUE);
}

async function updatePlayersStatus(){
    await Connection.query(CLEAN_DB_UPDATE_OLD_PLAYERS_STATUS);
}

module.exports = {
    Database: Database,
    Conncetion: Connection,
    cleanCycleValue: cleanCycleValue,
    updatePlayersStatus: updatePlayersStatus
}