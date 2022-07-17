const isDev = process.env.NODE_ENV === 'development';
let events: {[key:string]: Array<{eventName: string, handler: Function}>} = {};

class EventManager {  
    static addHandler = function (eventTarget: string, eventName: string, handler: Function) {
        if (eventTarget in events) {
            events[eventTarget].push({eventName, handler});
        } else {
            events[eventTarget] = [{eventName, handler}];
        }
    };

    static removeHandler = function (eventTarget: string) {
        if (eventTarget in events) {
            events[eventTarget] = [];
            delete events[eventTarget];
        }
    };

    static callHandler = function ( event: string, ...args: any ) {
        const eventTarget = event.split( ':' )[ 0 ],
			eventName = event.split( ':' )[ 1 ];

        if (eventTarget in events) {    
            let index = events[eventTarget].findIndex( el => el.eventName === eventName );

            if (index !== -1) {
                events[eventTarget][index].handler( ...args );
                if (isDev) console.log(`${eventTarget}:${eventName} ${JSON.stringify([...args])}`);
            } else {
                if (isDev) console.log(`${eventTarget}:${eventName} - not found`);
            }
        } else {
            if (isDev) console.log(`${eventTarget} - not found`);
        }
    };

    static trigger = function(eventTarget: string, eventName: string, ...args: any) {
        if (process.env.NODE_ENV !== 'production') {
            console.log(`emitted: server::${eventTarget}:${eventName}\n`, ...args) 
        } else {
            // @ts-ignore
            mp.trigger(eventTarget, eventName, JSON.stringify(...args)) // eslint-disable-line
        }
    }
  };
  
  export default EventManager;