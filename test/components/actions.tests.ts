import { expect } from 'chai';
import { action } from 'src';
import { ComponentActions } from 'src/components';

describe(nameof(ComponentActions), () => {
    describe(nameof(ComponentActions.getActionName), () => {

        it('returns correctly formatted action name', () => {

            class MyComponent {

                @action
                public action(): void {
                    // noop
                }
            }

            const creator = new MyComponent();

            const actionName = ComponentActions.getActionName(creator, nameof(creator.action));
            expect(actionName).to.eql('[MyComponent] action');
        });

    });
});