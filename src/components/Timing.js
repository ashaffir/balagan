
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
            <div>
                <h4>There are {this.getMinutesUntilNextHour()} minutes remain for this cycle.</h4>
            </div>
            );
        }
}
    
    