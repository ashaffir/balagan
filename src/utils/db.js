

const mysql = require('mysql');

// Maintenance commands
const CLEAN_DB = `delete from cycle_value_table where time < date_sub(now(), interval 3 hour);`;

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

async function cleanCycleValue(){
    console.log(`Cleaning the DB at ${new Date().getTime()}`);
    await Connection.query(CLEAN_DB);
}

module.exports = {
    Database: Database,
    Conncetion: Connection,
    cleaDB: cleanCycleValue
}