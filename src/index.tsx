import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import EventManager from './utils/eventManager';

import './styles/global.scss';
import './styles/fonts.scss';

const isDev = process.env.NODE_ENV === 'development';

const parseObject = ( obj: any ) => { try { return JSON.parse( obj ); } catch ( e ) { return obj; } };

if ( isDev ) {
    //@ts-ignore
    window.callHandler = ( event: string, ...args: any ) => EventManager.callHandler( event, ...args );

    // @ts-ignore
    if ( !window.mp ) {
        //@ts-ignore
        window.mp = {
            trigger: ( ...args: any ) => { },
            events: {
                add: ( ...args: any ) => { },
            }
        };
    }
}

// @ts-ignore
mp.events.add( 'cef::eventManager', ( event: string, ...args: any ) => { //eslint-disable-line
    for ( let i = 0; i < args.length; i++ ) {
        args[ i ] = parseObject( args[ i ] );
    }
    EventManager.callHandler( event, ...args );
} );


const root = ReactDOM.createRoot(
    document.getElementById( 'root' ) as HTMLElement
);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
