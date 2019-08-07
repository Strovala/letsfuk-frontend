import React from 'react';
import './Popup.scss';

export default (props) => (
    <div className={`popup ${props.className}`}>
        <div className="popup__content">
            {props.children}
        </div>
    </div>
);
