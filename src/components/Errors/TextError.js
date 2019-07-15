import React from 'react';

const textError = (props) => (
    props.error ? (
        <div>
            <output style={{color: "red"}}>{props.error.text}</output>
        </div>
    ): null
);

export default textError;