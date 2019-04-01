import React from 'react';
import { NavLink } from 'react-router-dom';

const mainNavigation = props => (
    <div>
        <nav className="main-navigation__itemm" />
        <ul>
            <li><NavLink to='/faq'>FAQ</NavLink></li>
        </ul>
    </div>    

)

export default mainNavigation;