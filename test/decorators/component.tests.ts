import { expect } from 'chai';
import { component } from 'src';
import { ComponentTemplateInfo } from 'src/info';

// tslint:disable:no-unused-expression

describe(nameof(component), () => {

    it('marks an instance as a component template', () => {

        // instantiate component template
        @component
        class MyComponent {
            public action(): void {
                // noop
            }
        }
        const creator = new MyComponent();

        // assert
        const info = ComponentTemplateInfo.getInfo(creator);
        expect(info).to.not.be.undefined;
    });    

});