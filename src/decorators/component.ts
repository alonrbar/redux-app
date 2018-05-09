import { ComponentTemplateInfo } from '../info';

// tslint:disable:ban-types

/**
 * Class decorator.
 * 
 * Mark this class as a redux component.
 */
export function component(ctor: Function): any {
    ComponentTemplateInfo.getOrInitInfo(ctor);
}