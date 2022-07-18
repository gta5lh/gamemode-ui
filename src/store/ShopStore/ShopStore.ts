import {
    makeObservable,
    observable,
    action
} from "mobx";

interface IShop {[key: string]: {id: string, name: string, list: Array<{id: string, name: string, price: number}>}}



export default class ShopStore {

    isShow: boolean = false;

    name: string = 'Apparel';

    shop: IShop = {
       'top': {
            id: 'top',
            name: '1Верх',
            list: [
                {id: 'dfdf', name: '1Black Hood', price: 48}
            ]
        },
        'bottom': {
            id: 'bottom',
            name: '2Верх',
            list: [
                {id: '12dfdf', name: '2Black Hood', price: 48}
            ]
        },

        '2323': {
            id: '2323',
            name: '',
            list: [
                {id: '13dfdf', name: '3Black Hood', price: 48}
            ]
        },
        '1top': {
            id: '1top',
            name: '1Верх',
            list: [
                {id: '4dfdf', name: '1Black Hood', price: 48}
            ]
        },
        '2bottom': {
            id: '2bottom',
            name: '2Верх',
            list: [
                {id: '51dfdf', name: '2Black Hood', price: 48}
            ]
        },

        '32323': {
            id: '32323',
            name: '',
            list: [
                {id: '61dfdf', name: '3Black Hood', price: 48}
            ]
        },
        '4top': {
            id: '4top',
            name: '1Верх',
            list: [
                {id: '7dfdf', name: '1Black Hood', price: 48}
            ]
        },
        '5bottom': {
            id: '5bottom',
            name: '2Верх',
            list: [
                {id: '81dfdf', name: '2Black Hood', price: 48}
            ]
        },

        '62323': {
            id: '62323',
            name: '',
            list: [
                {id: '91dfdf', name: '3Black Hood', price: 48}
            ]
        },
        '7top': {
            id: '7top',
            name: '1Верх',
            list: [
                {id: '123dfdf', name: '1Black Hood', price: 48}
            ]
        },
        '8bottom': {
            id: '8bottom',
            name: '2Верх',
            list: [
                {id: '1241dfdf', name: '2Black Hood', price: 48}
            ]
        },

        '92323': {
            id: '92323',
            name: '',
            list: [
                {id: '1251dfdf', name: '3Black Hood', price: 48}
            ]
        },
        '12362323': {
            id: '12362323',
            name: '',
            list: [
                {id: 'B91dfdf', name: '3Black Hood', price: 48}
            ]
        },
        '12347top': {
            id: '12347top',
            name: '1Верх',
            list: [
                {id: 'A123dfdf', name: '1Black Hood', price: 48}
            ]
        },
        '123458bottom': {
            id: '123458bottom',
            name: '2Верх',
            list: [
                {id: 'C1241dfdf', name: '2Black Hood', price: 48}
            ]
        },

        '1234592323': {
            id: '1234592323',
            name: '',
            list: [
                {id: 'X1251dfdf', name: '3Black Hood', price: 48}
            ]
        },
    }


    constructor() {
        makeObservable(this, {
            isShow: observable,
            name: observable,
            shop: observable,


            setShow: action.bound,
            setName: action.bound,
            setShop: action.bound,

        });

    }


    setShow(bool: boolean) {
        this.isShow = bool;
    }

    setName(name: string) {
        this.name = name;
    }

    setShop(data: any) {
        this.shop = data;
    }
}