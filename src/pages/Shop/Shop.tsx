import React from 'react';
import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import EventManager from '../../utils/eventManager';

import ShopStore from '../../store/ShopStore';

import './Shop.scss'
import { values } from 'mobx';
import _ from 'lodash';



const Shop: React.FC<{ store: ShopStore }> = ( { store } ) => {
    const [ currentCategory, setCurrentCategory ] = React.useState<string>( '' ),
        [ selectedItem, setSelectedItem ] = React.useState( 0 ),
        [ hideList, setHideList ] = React.useState( false ),
        [ repeatDelay, setRepeatDelay ] = React.useState( false );

    const hideAnimation = React.useRef<any>( null );
    const scrollRefs = React.useRef<any>( [] );
    const overlayRef = React.useRef<any>( null );

    const changeCategory = React.useCallback( ( id: string ) => {
        if ( hideAnimation.current.classList.contains( 'shop-content-list_hide' ) ) return;

        hideAnimation.current.classList.add( 'shop-content-list_hide' );

        const timeout = setTimeout( () => {
            setCurrentCategory( id )
            hideAnimation.current.classList.remove( 'shop-content-list_hide' )
        }, 300 )

        return () => clearTimeout( timeout )
    }, [] )

    const getItems = React.useMemo( () => {
        let items: Array<{ type: string, id: string, name: string, price?: number }> = [];

        if ( currentCategory === '' ) {
            values( store.shop ).forEach( ( item ) => {
                if ( item.name === '' ) {
                    item.list.forEach( ( el ) => {
                        items.push( { type: 'item', id: el.id, name: el.name, price: el.price } )
                    } )
                } else {
                    items.push( { type: 'category', id: item.id, name: item.name } )
                }
            } )
        } else {
            store.shop[ currentCategory ].list.forEach( ( el ) => {
                items.push( { type: 'item', id: el.id, name: el.name, price: el.price } )
            } )
        }

        return items;
    }, [ store.shop, currentCategory ] )

    const isInOverlayViewport = ( ref: any ) => {
        const rect = ref.current.getBoundingClientRect();
        const overlay = overlayRef.current.getBoundingClientRect();
        return (
            rect.top >= overlay.top &&
            rect.left >= overlay.left &&
            rect.bottom <= overlay.bottom &&
            rect.right <= overlay.right

        )
    }

    const handleKeyPress = React.useCallback( ( event: any ) => {
        if ( ![ 87, 83, 38, 40, 32, 13, 84 ].includes( event.keyCode ) ) return;
        if ( repeatDelay ) return;
        setRepeatDelay( true );
        setTimeout( () => {
            setRepeatDelay( false )
        }, 50 );

        if ( event.keyCode === 32 || event.keyCode === 13 ) { // Space and enter
            if ( getItems[ selectedItem ].type === 'category' ) {
                setSelectedItem( 0 )
                EventManager.trigger( 'shop', 'changeCategory', getItems[ selectedItem ].id );
                return changeCategory( getItems[ selectedItem ].id );
            } else {
                if ( !hideList ) {
                    EventManager.trigger( 'shop', 'prevClothes', getItems[ selectedItem ] );
                    setHideList( true );
                } else {
                    EventManager.trigger( 'shop', 'buyClothes', getItems[ selectedItem ] );
                    setHideList( false );
                }
            }

        } else if ( event.keyCode === 84 ) { // T
            if ( hideList ) setHideList( false )
            if ( currentCategory === '' ) return;
            setSelectedItem( 0 )
            return changeCategory( '' );
        } else {
            let newSelectedItem: number = 0;

            if ( event.keyCode === 87 || event.keyCode === 38 ) { // W
                newSelectedItem = selectedItem - 1;
            };

            if ( event.keyCode === 83 || event.keyCode === 40 ) { // S
                newSelectedItem = selectedItem + 1;
            }
            if ( newSelectedItem < 0 ) return setSelectedItem( 0 );
            if ( newSelectedItem > getItems.length - 1 ) return setSelectedItem( getItems.length - 1 );
            return setSelectedItem( newSelectedItem );
        }
    }, [ selectedItem, setSelectedItem, getItems, hideList, repeatDelay, setRepeatDelay ] ) // eslint-disable-line

    const handleEndScroll = React.useMemo( () => _.debounce( () => {
        scrollRefs.current.forEach( ( ref: any ) => {
            if ( !ref.current ) return;
            if ( isInOverlayViewport( ref ) ) {
                ref.current.style.opacity = '0.5';
            } else {
                ref.current.style.opacity = '1.0';
            }
        } )
    }, 10 ), [] );

    const handleScroll = ( e: any ) => {
        handleEndScroll();
    };

    React.useEffect( () => {
        document.addEventListener( 'keydown', handleKeyPress );

        return () => document.removeEventListener( 'keydown', handleKeyPress )
    }, [ handleKeyPress ] );

    React.useEffect( () => {
        scrollRefs.current = [ ...getItems, {} ].map(
            ( _, i ) => scrollRefs.current[ i ] ?? React.createRef()
        );
        handleEndScroll();
    }, [ scrollRefs.current ] ) // eslint-disable-line

    React.useEffect( () => {
        scrollRefs.current[ selectedItem > 8 ? selectedItem + 1 : selectedItem ].current &&
            scrollRefs.current[ selectedItem > 8 ? selectedItem + 1 : selectedItem ].current.scrollIntoView( { block: "nearest", inline: "nearest", behavior: "smooth" } );
    }, [ selectedItem ] );

    React.useEffect( () => {
        EventManager.addHandler( 'shop', 'setShow', ( bool: boolean ) => store.setShow( bool ) );
        EventManager.addHandler( 'shop', 'setShop', ( data: any ) => store.setShop( data ) );
        EventManager.addHandler( 'shop', 'setName', ( name: string ) => store.setName( name ) );

        return () => EventManager.removeHandler( 'shop' )
    }, [ store ] )

    if ( !store.isShow ) return null;

    return <div className='shop'>
        <div className='shop-content'>
            <div className='shop-content-header'>{store.name}</div>
            <div className='shop-content-main'>
                <div ref={hideAnimation} onScroll={e => handleScroll( e )} className={cn( 'shop-content-list', hideList && 'shop-content-list_hide' )}>
                    {getItems.map( ( item, idx ) => {
                        if ( item.type === 'category' ) {
                            return <div key={idx}
                                className={cn( 'shop-content-list-box', selectedItem === idx && 'shop-content-list-box_active' )}
                                onClick={() => {
                                    changeCategory( item.id )
                                    setSelectedItem( 0 )
                                    EventManager.trigger( 'shop', 'changeCategory', getItems[ selectedItem ].id );
                                }}
                                ref={scrollRefs.current[ idx ]}
                            >
                                <img src={require( `../../assets/images/shop/tshort.png` )} alt='#' />
                                <div className='shop-content-list-box-info'>
                                    <div className='shop-content-list-box-info__name'>{item.name}</div>
                                </div>
                            </div>
                        } else if ( item.type === 'item' ) {
                            return <div key={`${ item.id }-${ idx }`}
                                className={cn( 'shop-content-list-box', selectedItem === idx && 'shop-content-list-box_active' )}
                                ref={scrollRefs.current[ idx ]}
                                onClick={() => {
                                    setSelectedItem( idx )
                                    EventManager.trigger( 'shop', 'prevClothes', getItems[ selectedItem ] );
                                    setHideList( true );
                                }}
                            >
                                <img src={require( `../../assets/images/shop/tshort.png` )} alt='#' />
                                <div className='shop-content-list-box-info'>
                                    <div className='shop-content-list-box-info__name'>{item.name}</div>
                                    <div className='shop-content-list-box-info__price'>${item.price}</div>
                                </div>
                            </div>
                        }
                        return null;
                    } )}
                    <div ref={scrollRefs.current[ getItems.length ]} className='shop-content-list__clearBox' />
                </div>
                <div ref={overlayRef} className='shop-content-list__security'></div>
            </div>
        </div>
    </div>
}
export default observer( Shop );
