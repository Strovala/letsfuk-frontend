import React from 'react';

const labelInput = (props) => (
    <div>
        <label>
            {props.label}:
            <input type={props.type} value={props.value} onChange={props.changed} />
        </label>
    </div>
);

export default labelInput;
