
// This ccompenent will display the time left to the next cycle and the current cycle value
import React, { Component } from 'react';    
    
export default class Timing extends Component {
    
    state = {
        minutesUntilNextHour: 0
    };
    
    getMinutesUntilNextHour = () => { return 60 - new Date().getMinutes(); };
    getSecondsUntilNextHour = () => { return 3600 - new Date().getSeconds(); };

    render() {
        return (
            <div >
                <h4> At {new Date().getHours()}:00 the rate was <b>{this.props.cycle_value}</b>.
                You have {this.getMinutesUntilNextHour()} minutes to make your bet.</h4>
            </div>
            );
        }
}
    
    