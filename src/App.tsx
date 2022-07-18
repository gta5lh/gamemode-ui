import React from 'react';
import { useLocalObservable } from 'mobx-react-lite';
import EventManager from './utils/eventManager';

import Shop from './pages/Shop';

import ShopStore from './store/ShopStore';

const App = () => {

    const shopStore = useLocalObservable( () => new ShopStore() );

    return <div className='app'>
        <Shop store={shopStore} />
    </div>
}

export default App;
