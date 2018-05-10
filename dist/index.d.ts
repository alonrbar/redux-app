import { Store, StoreEnhancer } from 'redux';

//
// Decorators
//

/**
 * Method decorator.
 * 
 * Mark this method as a Redux action.
 */
export function action(target: object, propertyKey: string | symbol): void;

/**
 * Class decorator.
 * 
 * Mark this class as a redux component.
 */
export function component(ctor: Function): any;

/**
 * Method decorator. 
 * 
 * The method will dispatch an action with the corresponding name but the
 * dispatched action will **not** trigger a reducer reaction. Instead, after the
 * dispatch process is done the method will be invoked as a regular one
 * (similarly to `noDispatch` methods).
 */
export function sequence(target: any, propertyKey: string | symbol): void;

/**
 * Property decorator.
 */
export function withId(target: object, propertyKey: string | symbol): void;
export function withId(id?: any): PropertyDecorator;

/**
 * Property decorator.
 * Instruct redux-app to not store this property in the store.
 */
export function ignoreState(target: object, propertyKey: string | symbol): void;

//
// ReduxApp
//

export class ReduxApp<T extends object> {

    /**
     * Global redux-app options.
     */
    static options: GlobalOptions;

    static createApp<T extends object>(appCreator: T, enhancer?: StoreEnhancer<T>): ReduxApp<T>;
    static createApp<T extends object>(appCreator: T, options: AppOptions, enhancer?: StoreEnhancer<T>): ReduxApp<T>;
    static createApp<T extends object>(appCreator: T, options: AppOptions, preloadedState: any, enhancer?: StoreEnhancer<T>): ReduxApp<T>;

    /**
     * @param type The type of the component.
     * @param componentId The ID of the component (assuming the ID was assigned
     * to the component by the 'withId' decorator). If not specified will get to
     * the first available component of that type.
     * @param appId The name of the ReduxApp instance to search in. If not
     * specified will search in default app.
     */
    static getComponent<T>(type: Constructor<T>, componentId?: string, appId?: string): T;

    readonly name: string;
    /**
     * The root component of the application.
     */
    readonly root: T;
    /**
     * The underlying redux store.
     */
    readonly store: Store<T>;

    constructor(appCreator: T, enhancer?: StoreEnhancer<T>);
    constructor(appCreator: T, options: AppOptions, enhancer?: StoreEnhancer<T>);
    constructor(appCreator: T, options: AppOptions, preloadedState: any, enhancer?: StoreEnhancer<T>);

    dispose(): void;
}

//
// Utilities
//

export function isInstanceOf(obj: any, type: Function): boolean;

/**
 * @param obj 
 * @param bind Whether or not to bind the returned methods to 'obj'. Default
 * value: false.
 */
export function getMethods(obj: object | Function, bind?: boolean): IMap<Method>;

//
// types
//
  
export type Method = Function;
  
export interface Constructor<T> {
    new(...args: any[]): T;
}

export interface IMap<T> { 
    [key: string]: T;
}

//
// Options
//

export class AppOptions {
    /**
     * Name of the newly created app.
     */
    name?: string;
    /**
     * By default each component is assigned (with some optimizations) with it's
     * relevant sub state on each store change. Set this to false to disable
     * this updating process. The store's state will still be updated as usual
     * and can always be retrieved using store.getState().
     * Default value: true.
     */
    updateState?: boolean;
}

export class GlobalOptions {
    /**
     * Default value: LogLevel.Warn
     */
    logLevel: LogLevel;
    /**
     * Customize actions naming.
     */
    actionNameResolver: (className: string, methodName: string) => string;
}

export enum LogLevel {
    /**
     * Emit no logs
     */
    None = 0,
    Verbose = 1,
    Debug = 2,
    Warn = 5,
    /**
     * Emit no logs (same as None)
     */
    Silent = 10
}