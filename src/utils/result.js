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

const SELECT_CURRENT_CYCLE_VALUE = `select cycle_value from cycle_value_table where minutes=53 and hours=`;
const SELECT_PREV_CYCLE_VALUE = `select cycle_value from cycle_value_table where minutes=0 and hours=`;
const CALCULATE_WIN_LOSE_AMOUNT = `SELECT SUM(bet) as 'sum' FROM players_table WHERE direction=`;
const CALCULATE_W_BETS_AMOUNT = `SELECT SUM(w_bet) as 'sum' FROM players_table WHERE direction=`;


// const DRAW_CYCLE = `update players_table set result=3 where hours=`;
// const UP_PLAYERS_WON = `update players_table set result=1 where direction='up';`;
// const UP_PLAYERS_LOST = `update players_table set result=0 where direction='up';`;
// const DOWN_PLAYERS_WON = `update players_table set result=1 where direction='down';`;
// const DOWN_PLAYERS_LOST = `update players_table set result=0 where direction='down';`;
// const COUNT_WINNERS= `SELECT COUNT(user_id) FROM players_table WHERE status=1;`;
// const UPDATE_STATUS_LOST = `UPDATE players_table SET result=0 WHERE direction='down';`;
// const UPDATE_RESULT_WON= `UPDATE players_table SET result=1 WHERE direction='up;'`;
// const UPDATE_W_BET = `UPDATE players_table SET w_bet=bet*20 WHERE status=1;`;
// const SUM_LOOSING_BETS = `SELECT SUM(bet) FROM players_table WHERE result=0;`;
// const SUM_WINNING_BETS = `SELECT SUM(bet) FROM players_table WHERE result=1;`;
// const SUM_W_BETS = `SELECT SUM(w_bet) FROM players_table WHERE result=1;`;

const COMMISSION = 0.004;
const BET_PORTION = (1 - COMMISSION) / 2;


let loosing_bets, winning_bets, weighted_bets, up_down;

let curr_value, prev_value;
const params = {
    host: 'localhost',
    user: 'root',
    password: '1q@W#E$R5t',
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
    // console.log(`Running: ${SELECT_PREV_CYCLE_VALUE}${parseInt(new Date().getHours())-1} limit 1;`);
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
            db.query(`${CALCULATE_WIN_LOSE_AMOUNT}'${up_down}';`) //Calculating the winning mount
            .then(winnings => {
                winning_bets = winnings[0]['sum'];
                console.log(`Winnings amount is: ${winning_bets}`);
                return up_down
            })
            .then(up_down => {
                // console.log(`dir2 = ${up_down}`);
                db.query(`${CALCULATE_W_BETS_AMOUNT}'${up_down}';`) //Calculating the weighted bets amount
                .then(w_bets => {
                    // console.log(`dir2.5 = ${up_down}`);
                    weighted_bets = w_bets[0]['sum'];
                    console.log(`Winnings weighted bets amount is: ${weighted_bets}`); 
                    return up_down
                })
                .then(up_down => {
                    // console.log(`dir3 = ${up_down}`);
                    db.query(`${CALCULATE_WIN_LOSE_AMOUNT}'${up_down === 'Down' ? 'Up':'Down'}';`) // Calculating the loosing amount
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
