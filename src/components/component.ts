import { Store } from 'redux';
import { ComponentId } from '../decorators';
import { ClassInfo, ComponentInfo, ComponentTemplateInfo } from '../info';
import { ROOT_COMPONENT_PATH } from '../reduxApp';
import { IMap } from '../types';
import { defineProperties, DescriptorType, isPrimitive, log } from '../utils';
import { ComponentActions } from './actions';
import { ComponentReducer } from './reducer';

export class ComponentCreationContext {

    public visitedNodes = new Set();
    public visitedTemplates = new Map<object, Component>();
    public path = ROOT_COMPONENT_PATH;
    public appName: string;
    public parentTemplate: object;
    public createdComponents: IMap<Component> = {};

    constructor(initial?: Partial<ComponentCreationContext>) {
        Object.assign(this, initial);
    }
}

export class Component {

    //
    // static methods
    //

    public static create(store: Store<any>, template: object, context?: ComponentCreationContext): Component {

        context = Object.assign(new ComponentCreationContext(), context);

        // create the component
        ComponentTemplateInfo.getOrInitInfo(template);
        const ComponentClass = Component.getComponentClass(template);  // tslint:disable-line:variable-name
        const component = new ComponentClass(store, template, context as ComponentCreationContext);

        return component;
    }

    private static getComponentClass(template: object): typeof Component {
        const info = ComponentTemplateInfo.getInfo(template);
        if (!info.componentClass) {
            info.componentClass = Component.createComponentClass(template);
        }
        return info.componentClass;
    }

    private static createComponentClass(template: object): typeof Component {

        // create new component class
        const componentClassFactory = new Function(
            'initCallback', 
            `"use strict";return function ${template.constructor.name}_ReduxAppComponent() { initCallback(this, arguments); }`
        );
        const ComponentClass = componentClassFactory((self: any, args: any) => Component.apply(self, args));  // tslint:disable-line:variable-name
        ComponentClass.prototype = Object.create(Component.prototype);
        ComponentClass.prototype.constructor = ComponentClass;

        // patch it's prototype
        const actions = ComponentActions.createActions(template);
        Object.assign(ComponentClass.prototype, actions);

        return ComponentClass;
    }

    private static createSelf(component: Component, store: Store<object>, template: object, context: ComponentCreationContext): void {

        // regular js props (including getters and setters)
        defineProperties(component, template, [DescriptorType.Field, DescriptorType.Property]);

        // init component info        
        const id = ComponentId.getComponentId(context.parentTemplate, context.path);
        const selfInfo = ComponentInfo.initInfo(component, template, store.dispatch, id);
        
        // copy info from template
        const selfClassInfo = ClassInfo.getOrInitInfo(component);
        const templateClassInfo = ClassInfo.getInfo(template) || new ClassInfo();
        selfClassInfo.ignoreState = templateClassInfo.ignoreState;

        // reducer
        selfInfo.reducer = ComponentReducer.createReducer(component, template);
    }

    private static createSubComponents(treeNode: any, store: Store<object>, template: object, context: ComponentCreationContext): void {

        // no need to search inside primitives
        if (isPrimitive(treeNode))
            return;

        // prevent endless loops on circular references
        if (context.visitedNodes.has(treeNode))
            return;
        context.visitedNodes.add(treeNode);

        // traverse children
        const searchIn = template || treeNode;
        for (let key of Object.keys(searchIn)) {

            var subPath = context.path + '.' + key;

            var subTemplate = searchIn[key];
            if (ComponentTemplateInfo.getInfo(subTemplate)) {

                if (context.visitedTemplates.has(subTemplate)) {

                    // child is an existing sub-component
                    treeNode[key] = context.visitedTemplates.get(subTemplate);

                } else {

                    // child is a new sub-component                    
                    treeNode[key] = Component.create(store, subTemplate, {
                        ...context,
                        parentTemplate: template,
                        path: subPath
                    });
                }
            } else {

                // child is regular object, nothing special to do with it
                Component.createSubComponents(treeNode[key], store, null, {
                    ...context,
                    parentTemplate: null,
                    path: subPath
                });
            }
        }
    }

    //
    // constructor
    //

    private constructor(store: Store<any>, template: object, context: ComponentCreationContext) {

        if (!ComponentTemplateInfo.getInfo(template))
            throw new Error(`Argument '${nameof(template)}' is not a component template. Did you forget to use the decorator?`);

        Component.createSelf(this, store, template, context);
        context.createdComponents[context.path] = this;
        context.visitedTemplates.set(template, this);
        log.verbose(`[Component] New ${template.constructor.name} component created. Path: ${context.path}`);

        Component.createSubComponents(this, store, template, context);
    }

    // 
    // Note: Component methods are static so that they will not be exposed unnecessarily through the prototype chain.
    //
}