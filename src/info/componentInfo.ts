import { Dispatch, Reducer } from 'redux';
import { Component } from '../components';
import { COMPONENT_INFO, getSymbol, setSymbol } from '../symbols';

// tslint:disable:ban-types

/**
 * Metadata stored on every component instance.
 */
export class ComponentInfo {

    public static getInfo(component: Component): ComponentInfo {
        if (!component)
            return undefined;

        return getSymbol(component, COMPONENT_INFO);
    }

    public static initInfo(component: Component, template: object, dispatch: Dispatch<any>, id: any): ComponentInfo {
        const info = new ComponentInfo(template, dispatch, id);
        return setSymbol(component, COMPONENT_INFO, info);
    }
    
    public readonly id: any;
    public readonly originalClass: Function;
    public readonly dispatch: Dispatch<any>;
    public reducer: Reducer<object>;

    constructor(template: object, dispatch: Dispatch<any>, id: any) {
        this.originalClass = template.constructor;
        this.dispatch = dispatch;
        this.id = id;
    }
}