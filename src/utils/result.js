 const mysql = require('mysql');

/* 
Every hour:
    1) Calculate the sum of the loosers
    2) Calculate the distribution amout per winner
    3) Update DB with result, payment status and winnings

Earnings calculation
======================
Pu = Payout 
Ue = User Earnings
We = Weighted User Earnings
B = Bet
Ub = User Bet
Tu = Time to cycle end (minutes)
======================
Pu = Ue + We + Ub                                    
Ue = (Ub / SUM_WINNING_BETS) x BET_PORTION x SUM_LOOSING_BETS
We = ((Ub x Tu) / SUM_W_BETS) x BET_PORTION x SUM_LOOSING_BETS
*/

const SELECT_CURRENT_CYCLE_VALUE = `select cycle_value from cycle_value_table where minutes=0 and hours=`;
const SELECT_PREV_CYCLE_VALUE = `select cycle_value from cycle_value_table where minutes=0 and hours=`;
const CALCULATE_WIN_LOSE_AMOUNT = `SELECT SUM(bet) as 'sum' FROM players_table WHERE time > date_sub(now(), interval 10 hour) and bet_hour=`;
const CALCULATE_W_BETS_AMOUNT = `SELECT SUM(w_bet) as 'sum' FROM players_table WHERE time > date_sub(now(), interval 10 hour) and bet_hour=`;

const COMMISSION = 0.004;
const BET_PORTION = (1 - COMMISSION) / 2;

const DB_PASS = '1q@W#E$R5t';

let loosing_bets, winning_bets, weighted_bets, up_down;

let curr_value, prev_value;
const params = {
    host: 'localhost',
    user: 'root',
    password: DB_PASS,
    database: 'swingabit'
};

class Database {
    constructor(params) {
        this.connection = mysql.createConnection( params );
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

const db = new Database(params);

// Explanation on the below: 
// https://codeburst.io/node-js-mysql-and-promises-4c3be599909b and 
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises
///////////////////////////

function resultsCalculation(){
    console.log(`RESULTS CALCULATION AT: ${new Date().toLocaleString()}`); 
    console.log(`Running: ${SELECT_PREV_CYCLE_VALUE}${parseInt(new Date().getHours())-1} limit 1;`);
    db.query(`${SELECT_PREV_CYCLE_VALUE}${parseInt(new Date().getHours())-1} limit 1;`)
        .then(prev_cycle => { // result from the SELECT_PREV_CYCLE_VALUE => getting the previous cycle_value
            prev_value = prev_cycle[0]['cycle_value'];
            // console.log(`Prev_value=${prev_value}`); 
        console.log(`Retunring: ${SELECT_CURRENT_CYCLE_VALUE}${parseInt(new Date().getHours())} limit 1;`)
            return db.query(`${SELECT_CURRENT_CYCLE_VALUE}${parseInt(new Date().getHours())} limit 1;`) // and executing the next thing which its results will be used in the "result" in the next "then"
        })
        .then(curr_cycle => { // The results from the SELECT_CURRENT_CYCLE_VALUE => the current cycle_value
            curr_value = curr_cycle[0]['cycle_value'];
            console.log(`Curr_value=${curr_value}`);
            return {            // Sending the results required for the next operation
                prev_value: prev_value,
                curr_value: curr_value
            }
        })
        .then(cycle_values => { // Checking who won: the 'up' or 'down' bet
            let {prev_value, curr_value} = cycle_values;
            // console.log(`${result['prev_value']} and ${result['curr_value']}`);
            // console.log(`${prev_value} and ${curr_value}`);

            if(curr_value > prev_value){
                // Mark all players with 'up' as winners
                console.log('UP WON');
                return 'Up' 
            } else if(curr_value < prev_value) {
                // Mark all players with 'down' as winners
                console.log('DOWN WON');
                return 'Down' 
            } else { // Meaning the values are equal
                // Mark all players in that cycle as Void => refund the points
                console.log('DRAW!!');
                return 'DRAW'
            }
        })
        .then(direction => { 
            up_down = direction;
            // console.log(`dir1 = ${up_down}`);
            // console.log(`***************************`)
            // console.log(`${CALCULATE_LOOSING_AMOUNT}'${up_down}';`)
            db.query(`${CALCULATE_WIN_LOSE_AMOUNT}${parseInt(new Date().getHours())-1} and direction='${up_down}';`) //Calculating the winning mount
            .then(winnings => {
                winning_bets = winnings[0]['sum'];
                console.log(`Winnings amount is: ${winning_bets}`);
                return up_down
            })
            .then(up_down => {
                // console.log(`dir2 = ${up_down}`);
                db.query(`${CALCULATE_W_BETS_AMOUNT}${parseInt(new Date().getHours())-1} and direction='${up_down}';`) //Calculating the weighted bets amount
                .then(w_bets => {
                    // console.log(`dir2.5 = ${up_down}`);
                    weighted_bets = w_bets[0]['sum'];
                    console.log(`Winnings weighted bets amount is: ${weighted_bets}`); 
                    return up_down
                })
                .then(up_down => {
                    // console.log(`dir3 = ${up_down}`);
                    db.query(`${CALCULATE_WIN_LOSE_AMOUNT}${parseInt(new Date().getHours())-1} and direction='${up_down === 'Down' ? 'Up':'Down'}';`) // Flipping logic to calculate the loosing amount
                    .then(loosings => {
                        loosing_bets = loosings[0]['sum'];
                        // console.log(up_down)
                        return up_down
                    })
                    .then(up_down => {
                        // console.log(up_down)
                        console.log(`***************************`);
                        let payout = `update players_table set payout=(bet / ${winning_bets})*${BET_PORTION}*${loosing_bets}+ 
                        (w_bet / ${weighted_bets})*${BET_PORTION}*${loosing_bets}+bet, result=1 
                        where direction='${up_down}' and bet_hour=${parseInt(new Date().getHours())-1}`;
                        db.query(payout) // Calculating payout
                        console.log(`loosings= ${loosing_bets} winnings = ${winning_bets} w_bets = ${weighted_bets}`)
                        // return db.close()
                    })
                });
        })
        // }, (err) => {
        //     return db.close().then(() => {throw err;})
        })
        .catch((err) => {throw err});
}


module.exports = {
    resultsCalculation
};
