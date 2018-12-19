import React from 'react';

export default function Loader({size = 50}) {
    return (
        <div style={{margin: '0 auto', width: size, position: 'relative'}}>
            <div className='spinner' style={{width: size, height: size}}/>
        </div>
    )
}