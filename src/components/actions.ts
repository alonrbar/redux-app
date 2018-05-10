import { Action } from 'redux';
import { ComponentInfo, ComponentTemplateInfo } from '../info';
import { globalOptions } from '../options';
import { IMap, Method } from '../types';
import { getMethods } from '../utils';
import { Component } from './component';

// tslint:disable-next-line:interface-name
export interface ReduxAppAction extends Action {
    id: any;
    payload: any[];
}

export class ComponentActions {

    public static createActions(template: object): IMap<Method> {
        const methods = getMethods(template);
        if (!methods)
            return undefined;

        const templateInfo = ComponentTemplateInfo.getInfo(template);
        const componentActions: any = {};
        Object.keys(methods).forEach(key => {
            componentActions[key] = function (this: Component, ...payload: any[]): void {

                // verify 'this' arg
                if (!(this instanceof Component))
                    throw new Error(
                        `Component method invoked with non-Component as 'this'. ` +
                        `Component: ${template.constructor.name}, ` + 
                        `Method: ${key}, ` +
                        `Bound 'this' argument is: ${this}.`
                    );

                const oldMethod = methods[key];

                // handle actions and sequences (use store dispatch)
                if (templateInfo.actions[key] || templateInfo.sequences[key]) {
                    const compInfo = ComponentInfo.getInfo(this);
                    const action: ReduxAppAction = {
                        type: ComponentActions.getActionName(template, key),
                        id: (compInfo ? compInfo.id : undefined),
                        payload: payload
                    };
                    compInfo.dispatch(action);
                }

                // handle regular methods (just call the function)
                if (!templateInfo.actions[key]) {
                    return oldMethod.call(this, ...payload);
                }
            };
        });

        return componentActions;
    }

    public static getActionName(template: object, methodName: string): string {
        const className = template.constructor.name;
        const resolver = globalOptions.actionNameResolver;
        return resolver(className, methodName);
    }
}