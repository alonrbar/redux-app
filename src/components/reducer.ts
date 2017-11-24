import { Reducer, ReducersMapObject } from 'redux';
import { Computed, Connect, IgnoreState } from '../decorators';
import { ComponentInfo, CreatorInfo, getCreatorMethods } from '../info';
import { getActionName } from '../options';
import { isPrimitive, log, simpleCombineReducers, transformDeep, TransformOptions } from '../utils';
import { ReduxAppAction } from './actions';
import { Component } from './component';

// tslint:disable:member-ordering

export class ComponentReducer {

    private static readonly identityReducer = (state: any) => state;

    private static transformOptions: TransformOptions;

    //
    // public methods
    //

    public static createReducer(component: Component, creator: object): Reducer<object> {

        // method names lookup
        const methods = getCreatorMethods(creator);
        const options = CreatorInfo.getInfo(creator).options;
        if (!options)
            throw new Error(`Inconsistent component '${creator.constructor.name}'. The 'component' class decorator is missing.`);

        const methodNames: any = {};
        Object.keys(methods).forEach(methName => {
            var actionName = getActionName(creator, methName, options);
            methodNames[actionName] = methName;
        });

        // component id
        const componentId = ComponentInfo.getInfo(component).id;

        // the reducer
        return (state: object, action: ReduxAppAction) => {

            log.verbose(`[reducer] Reducer of: ${creator.constructor.name}, action: ${action.type}`);

            // initial state (redundant, handled in 'prepareState')
            if (state === undefined) {
                log.verbose('[reducer] State is undefined, returning initial value');
                return component;
            }

            // check component id
            if (componentId !== action.id) {
                log.verbose(`[reducer] Component id and action.id don't match (${componentId} !== ${action.id})`);
                return state;
            }

            // check if should use this reducer
            const methodName = methodNames[action.type];
            const actionReducer = methods[methodName];
            if (!actionReducer) {
                log.verbose('[reducer] No matching action in this reducer, returning previous state');
                return state;
            }

            // call the action-reducer with the new state as the 'this' argument
            var newState = Object.assign({}, state);
            actionReducer.call(newState, ...action.payload);

            // return new state
            log.verbose('[reducer] Reducer invoked, returning new state');
            return newState;
        };
    }

    public static combineReducersTree(root: any): Reducer<any> {

        const reducer = ComponentReducer.combineReducersRecursion(root, new Set());

        return (state: any, action: ReduxAppAction) => {
            const start = Date.now();

            var newState = reducer(state, action);
            newState = ComponentReducer.finalizeState(newState, root);

            const end = Date.now();
            log.debug(`[rootReducer] Reducer tree processed in ${end - start}ms.`);

            return newState;
        };
    }

    //
    // private methods
    //

    private static combineReducersRecursion(obj: any, visited: Set<any>): Reducer<any> {

        // no need to search inside primitives
        if (isPrimitive(obj))
            return undefined;

        // prevent endless loops on circular references
        if (visited.has(obj))
            return undefined;
        visited.add(obj);

        // get the root reducer
        var rootReducer: Reducer<any>;
        const info = ComponentInfo.getInfo(obj as any);
        if (info) {
            rootReducer = info.reducer;
        } else {
            rootReducer = ComponentReducer.identityReducer;
        }

        // gather the sub-reducers
        const subReducers: ReducersMapObject = {};
        for (let key of Object.keys(obj)) {

            // connected components are modified only by their source
            if (Connect.isConnectedProperty(obj, key))
                continue;

            // other objects
            var newSubReducer = ComponentReducer.combineReducersRecursion((obj as any)[key], visited);
            if (typeof newSubReducer === 'function')
                subReducers[key] = newSubReducer;
        }

        var resultReducer = rootReducer;

        // combine reducers
        if (Object.keys(subReducers).length) {
            var combinedSubReducer = simpleCombineReducers(subReducers);

            resultReducer = (state: object, action: ReduxAppAction) => {

                const thisState = rootReducer(state, action);
                const subStates = combinedSubReducer(thisState, action);

                // merge self and sub states
                const combinedState = ComponentReducer.mergeState(thisState, subStates);

                return combinedState;
            };
        }

        return resultReducer;
    }

    private static mergeState(state: any, subStates: any): any {

        if (Array.isArray(state) && Array.isArray(subStates)) {

            // merge arrays
            for (let i = 0; i < subStates.length; i++)
                state[i] = subStates[i];
            return state;

        } else {

            // merge objects
            return {
                ...state,
                ...subStates
            };
        }
    }

    private static finalizeState(rootState: any, root: any): any {
        if (!ComponentReducer.transformOptions) {
            const options = new TransformOptions();
            options.propertyPreTransform = (target, source, key) => !Connect.isConnectedProperty(target, key);
            ComponentReducer.transformOptions = options;
        }

        return transformDeep(rootState, root, (subState, subObj) => {

            // replace computed and connected props with placeholders
            var newSubState = Computed.removeComputedProps(subState, subObj);
            newSubState = Connect.removeConnectedProps(newSubState, subObj);

            // removed props that should not be stored in the store
            newSubState = IgnoreState.removeIgnoredProps(newSubState, subObj);

            return newSubState;
        }, ComponentReducer.transformOptions);
    }
}