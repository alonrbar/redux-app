import { expect } from 'chai';
import { action, ReduxApp, withId } from 'src';
import { Component } from 'src/components';

// tslint:disable:no-unused-expression

describe(nameof(ReduxApp), () => {

    describe('constructor', () => {

        it("does not throw on null values", () => {

            class Root {
                public value: string = null;
            }

            // create component tree            
            const app = new ReduxApp(new Root());
            app.dispose();
        });

        it("components nested inside standard objects are constructed", () => {

            class Root {
                public first = {
                    second: new Level2()
                };
            }

            class Level2 {
                public third = new Level3();
            }

            class Level3 {
                public some = new ThisIsAComponent();
            }

            class ThisIsAComponent {
                @action
                public dispatchMe() {
                    /* noop */
                }
            }

            // create component tree
            const app = new ReduxApp(new Root());
            try {

                expect(app.root.first.second.third.some).to.be.an.instanceOf(Component);

            } finally {
                app.dispose();
            }
        });

        it("handles pre-loaded state of nested component", () => {

            class Root {
                public first = {
                    second: new Level2()
                };
            }

            class Level2 {
                public theComponent = new ThisIsAComponent();
            }

            class ThisIsAComponent {

                public value: string = 'before';

                @action
                public changeValue() {
                    this.value = 'after';
                }
            }

            const preLoadedState = {
                first: {
                    second: {
                        theComponent: {
                            value: 'I am here!'
                        }
                    }
                }
            };

            // create component tree
            const root = new Root();
            expect(root.first.second.theComponent).to.be.an.instanceOf(ThisIsAComponent);
            expect(root.first.second.theComponent.value).to.eql('before');

            // create the app
            const app = new ReduxApp(root, undefined, preLoadedState);
            try {

                expect(app.root.first.second.theComponent).to.be.an.instanceOf(Component);
                expect(app.root.first.second.theComponent.value).to.eql('I am here!');

                // verify state is updating
                app.root.first.second.theComponent.changeValue();
                expect(app.root.first.second.theComponent).to.be.an.instanceOf(Component);
                expect(app.root.first.second.theComponent.value).to.eql('after');

            } finally {
                app.dispose();
            }
        });

        it("handles pre-loaded state of plain class instances", () => {

            class Root {
                public first = {
                    second: new Level2()
                };
            }

            class Level2 {
                public theComponent = new ThisIsAComponent();
            }

            class ThisIsAComponent {

                public value: string = 'before';

                public changeValue() {
                    this.value = 'after';
                }
            }

            const preLoadedState = {
                first: {
                    second: {
                        theComponent: {
                            value: 'I am here!'
                        }
                    }
                }
            };

            // create component tree
            const root = new Root();
            expect(root.first.second.theComponent.value).to.eql('before');

            // create the app
            const app = new ReduxApp(root, undefined, preLoadedState);
            try {

                expect(app.root.first.second.theComponent.value).to.eql('I am here!');

                // verify state is updating
                app.root.first.second.theComponent.changeValue();
                expect(app.root.first.second.theComponent.value).to.eql('after');

            } finally {
                app.dispose();
            }
        });

        it("arrays of objects from the app creator are stored in the store state", () => {

            class Some {

            }

            class Root {
                public arr: Some[];

                constructor(arr?: Some[]) {
                    this.arr = arr || [];
                }
            }

            const app = new ReduxApp(new Root([new Some(), new Some(), new Some()]), undefined);

            try {
                const state = app.store.getState();
                expect(Array.isArray(state.arr)).to.be.true;
            } finally {
                app.dispose();
            }
        });
    });

    describe('updateState', () => {

        describe('properties', () => {

            it('removes component properties that do not exists on the new state', () => {

                // create the component
                class MyComponent {
                    public prop1: string = undefined;
                    public prop2: string = undefined;
    
                    @action
                    public setAndRemove() {
                        delete this.prop1;
                        this.prop2 = 'hello';
                    }
                }
                const app = new ReduxApp(new MyComponent());
                try {
    
                    // test before
                    expect(app.root).to.haveOwnProperty('prop1');
                    expect(app.root).to.haveOwnProperty('prop2');
    
                    // test after
                    app.root.setAndRemove();
                    expect(app.root).to.not.haveOwnProperty('prop1');
                    expect(app.root).to.haveOwnProperty('prop2');
    
                } finally {
                    app.dispose();
                }
            });
    
            it('does not remove component properties that exists on the new state but are undefined', () => {
    
                // create the component
                class MyComponent {
                    public prop1: string = undefined;
                    public prop2: string = undefined;
    
                    @action
                    public updateProp2Only() {
                        this.prop2 = 'hello';
                    }
                }
                const app = new ReduxApp(new MyComponent());
                try {
    
                    // test before
                    expect(app.root).to.haveOwnProperty('prop1');
                    expect(app.root).to.haveOwnProperty('prop2');
    
                    // test after
                    app.root.updateProp2Only();
                    expect(app.root).to.haveOwnProperty('prop1');
                    expect(app.root).to.haveOwnProperty('prop2');
    
                } finally {
                    app.dispose();
                }
            });
    
            it('does not remove component getters', () => {
    
                // create the component
                class MyComponent {
    
                    public get prop1(): string {
                        return 'hi';
                    }
                    public prop2: string = undefined;
    
                    @action
                    public updateProp2Only() {
                        this.prop2 = 'hello';
                    }
                }
                const app = new ReduxApp(new MyComponent());
                try {
    
                    // test before
                    expect(app.root).to.haveOwnProperty('prop1');
                    expect(app.root).to.haveOwnProperty('prop2');
    
                    // test after
                    app.root.updateProp2Only();
                    expect(app.root).to.haveOwnProperty('prop1');
                    expect(app.root).to.haveOwnProperty('prop2');
    
                } finally {
                    app.dispose();
                }
            });

        });

        describe('actions', () => {
            
            it("actions of a component are invoked only once, even if it appears several time in the tree", () => {

                class Root {
                    public link: IAmComponent;
                    public original = new IAmComponent();
                    public nested: NestedComponent;
    
                    constructor() {
                        this.link = this.original;
                        this.nested = new NestedComponent(this.link);
                    }
                }
    
                class NestedComponent {
                    constructor(public readonly link: IAmComponent) {
                    }
                }
    
                let count = 0;
                class IAmComponent {
    
                    public value = 0;
    
                    @action
                    public dispatchMe() {
                        count++;
                        this.value = this.value + 1;
                    }
                }
    
                // create component tree
                const app = new ReduxApp(new Root());
                try {
    
                    // before dispatching
                    expect(count).to.eql(0);
                    expect(app.root.link.value).to.eql(0);
                    expect(app.root.original.value).to.eql(0);
                    expect(app.root.nested.link.value).to.eql(0);
    
                    // after dispatching
                    app.root.link.dispatchMe();
                    expect(count).to.eql(1, 'count is not 1');
                    expect(app.root.link.value).to.eql(1, 'link.value is not 1');
                    expect(app.root.original.value).to.eql(1, 'original.value is not 1');
                    expect(app.root.nested.link.value).to.eql(1, 'nested.link.value is not 1');
    
                } finally {
                    app.dispose();
                }
            });
    
            it("actions of a component nested inside standard objects can be invoked multiple times", () => {
    
                class Root {
                    public first = {
                        second: new Level2()
                    };
                }
    
                class Level2 {
                    public third = new Level3();
                }
    
                class Level3 {
                    public counter = new Counter();
                }
    
                class Counter {
                    public value = 0;
    
                    @action
                    public increment() {
                        this.value = this.value + 1;
                    }
                }
    
                // create component tree
                const app = new ReduxApp(new Root());
                try {
    
                    expect(app.root.first.second.third.counter.value).to.eql(0);
                    app.root.first.second.third.counter.increment();
                    expect(app.root.first.second.third.counter.value).to.eql(1);
                    app.root.first.second.third.counter.increment();
                    expect(app.root.first.second.third.counter.value).to.eql(2);
                    app.root.first.second.third.counter.increment();
                    expect(app.root.first.second.third.counter.value).to.eql(3);
    
                } finally {
                    app.dispose();
                }
            });

        });

        it("components nested inside standard objects are synced with the store's state", () => {

            class Root {
                public first = {
                    second: new Level2()
                };
            }

            class Level2 {
                public third = new Level3();
            }

            class Level3 {
                public some = new ThisIsAComponent();
            }

            class ThisIsAComponent {

                public value = 0;

                @action
                public dispatchMe() {
                    this.value = 1;
                }
            }

            // create component tree
            const app = new ReduxApp(new Root());
            try {

                // before dispatching
                expect(app.root.first.second.third.some.value).to.eql(0);

                // after dispatching
                app.root.first.second.third.some.dispatchMe();
                expect(app.root.first.second.third.some.value).to.eql(1);

            } finally {
                app.dispose();
            }
        });        

        it("adds, removes and updates objects in an array", () => {

            class App {
                public items: Item[] = [];

                @action
                public push() {
                    this.items = this.items.concat(new Item());
                }

                @action
                public pop() {
                    this.items = this.items.slice(0, this.items.length - 1);
                }

                @action
                public incrementIndex(index: number) {
                    this.items = this.items.map((item, i) => {
                        if (i === index) {
                            const { value, ...otherProps } = item;
                            return {
                                value: value + 1,
                                ...otherProps
                            };
                        } else {
                            return item;
                        }
                    });
                }

                @action
                public updateFirstItem(newValue: number) {
                    const newItem = new Item();
                    newItem.value = newValue;
                    this.items = this.items.map((item, index) => index === 0 ? newItem : item);
                }
            }

            class Item {
                public value = 0;
            }

            const app = new ReduxApp(new App());
            try {

                // push

                expect(app.root.items.length).to.eql(0);

                app.root.push();
                app.root.push();
                app.root.push();
                app.root.push();
                app.root.push();

                expect(app.root.items.length).to.eql(5);

                // update

                app.root.incrementIndex(3);
                expect(app.root.items[4].value).to.eql(0);
                expect(app.root.items[3].value).to.eql(1);
                expect(app.root.items[2].value).to.eql(0);

                // pop

                app.root.pop();
                expect(app.root.items.length).to.eql(4);
                expect(app.root.items[3].value).to.eql(1);
                expect(app.root.items[2].value).to.eql(0);

                // update

                expect(app.root.items[0].value).to.eql(0);
                app.root.updateFirstItem(5);
                expect(app.root.items[0].value).to.eql(5);

            } finally {
                app.dispose();
            }
        });
    });

    describe('getComponent', () => {

        it("retrieves a component by type", () => {

            class Root {
                public comp = new MyComponent();
                public otherComp = new MyOtherComponent();
            }

            class MyComponent {

                @action
                public myAction() {
                    // noop
                }
            }

            class MyOtherComponent {

                @action
                public myAction() {
                    // noop
                }
            }

            const appId = Math.random().toString();
            const app = new ReduxApp(new Root(), { name: appId });
            try {

                const comp = ReduxApp.getComponent(MyComponent, undefined, appId);
                expect(comp).to.equal(app.root.comp);
                expect(comp).to.not.equal(app.root.otherComp);
            } finally {
                app.dispose();
            }
        });

        it("retrieves a component by type and id", () => {

            class Root {
                @withId('first comp')
                public comp1 = new MyComponent();
                @withId('second comp')
                public comp2 = new MyComponent();
                public otherComp = new MyOtherComponent();
            }

            class MyComponent {

                @action
                public myAction() {
                    // noop
                }
            }

            class MyOtherComponent {

                @action
                public myAction() {
                    // noop
                }
            }

            const appId = Math.random().toString();
            const app = new ReduxApp(new Root(), { name: appId });
            try {

                const comp = ReduxApp.getComponent(MyComponent, 'second comp', appId);
                expect(comp).to.equal(app.root.comp2);
                expect(comp).to.not.equal(app.root.comp1);
                expect(comp).to.not.equal(app.root.otherComp);
            } finally {
                app.dispose();
            }
        });
    });
});