import { expect } from 'chai';
import { action } from 'src';
import { Component } from 'src/components';
import { ComponentInfo } from 'src/info';
import { FakeStore } from '../testTypes';

// tslint:disable:no-unused-expression

describe(nameof(Component), () => {

    describe('constructor', () => {

        it("does not throw on null values", () => {

            class Root {
                public value: string = null;
            }

            const store = new FakeStore();
            Component.create(store, new Root());
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
            const store = new FakeStore();
            const root: any = Component.create(store, new Root());

            expect(root).to.be.an.instanceOf(Component); // root is always a component
            expect(root.first).to.not.be.an.instanceOf(Component);
            expect(root.first.second).to.not.be.an.instanceOf(Component);
            expect(root.first.second.third).to.not.be.an.instanceOf(Component);
            expect(root.first.second.third.some).to.be.an.instanceOf(Component);
        });

        it("components nested inside standard objects are connected to store's dispatch function", () => {

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

            // fake store
            var isConnected = false;
            const store = new FakeStore();
            (store.dispatch as any) = () => { isConnected = true; };

            // create component tree
            const root: any = Component.create(store, new Root());

            // before dispatching
            expect(isConnected).to.be.false;

            // after dispatching
            root.first.second.third.some.dispatchMe();
            expect(isConnected).to.be.true;
        });

        it("standard object nested inside components are not connected to store's dispatch function", () => {

            class Root {
                public first = {
                    second: new Level2()
                };
            }

            class Level2 {
                public third = new Level3();
            }

            class Level3 {
                public some = new ThisIsNotAComponent();
            }

            class ThisIsNotAComponent {

                public dispatchMe() {
                    /* noop */
                }
            }

            // fake store
            var isConnected = false;
            const store = new FakeStore();
            (store.dispatch as any) = () => { isConnected = true; };

            // create component tree
            const root: any = Component.create(store, new Root());

            // assert
            root.first.second.third.some.dispatchMe();
            expect(isConnected).to.be.false;
        });

        it("two different component classes with the same method name has separate methods", () => {

            class Root {
                public first = new First();
                public second = new Second();
            }

            class First {

                @action
                public foo() {
                    return 'First foo';
                }
            }

            class Second {

                @action
                public foo() {
                    return 'Second foo';
                }
            }

            var root: Root = Component.create(new FakeStore(), new Root()) as any;

            expect(root.first.foo.toString).to.not.equal(root.second.foo);
        });

        it("two component instances of the same class has the same methods", () => {

            class TheComponent {

                @action
                public foo() {
                    return 5;
                }
            }

            var comp1: TheComponent = Component.create(new FakeStore(), new TheComponent()) as any;
            var comp2: TheComponent = Component.create(new FakeStore(), new TheComponent()) as any;

            expect(comp1.foo).to.equal(comp2.foo);
        });

        it("derived component dispatches parent actions with derived namespace", () => {

            class Base {

                @action
                public bar() {
                    // noop
                }
            }

            class Derived extends Base {

                @action
                public foo() {
                    // noop
                }
            }

            // fake store
            const store = new FakeStore();
            var dispatchedAction: any;
            (store.dispatch as any) = (actionObject: any) => { dispatchedAction = actionObject; };

            // create component tree
            const comp: any = Component.create(store, new Derived());

            // has methods
            expect(comp).to.have.property('foo');
            expect(comp).to.have.property('bar');

            // dispatch
            comp.foo();
            expect(dispatchedAction).to.not.be.undefined;
            expect(dispatchedAction.type).be.a('string');
            expect(dispatchedAction.type.toLowerCase()).to.include(nameof(Derived).toLowerCase());
        });
    });

    describe('reducer', () => {

        it("throws when invoking an action from within another action", () => {

            class Person {

                public name: string;

                @action
                public changeName(name: string) {
                    this.name = name;
                }

                @action
                public shouldThrow() {
                    this.changeName('something');
                }
            }

            const store = new FakeStore();
            const comp = Component.create(store, new Person());
            const info = ComponentInfo.getInfo(comp);
            const reducer = info.reducerCreator(() => { /* noop */ });

            expect(() => reducer({}, { type: 'Person.shouldThrow' })).to.throw(Error);
        });

        it("does not throw when invoking regular methods from within actions", () => {

            class Person {
                public name: string;

                @action
                public changeName(name: string) {
                    this.name = this.toUpperCase(name);
                }

                public toUpperCase(str: string) {
                    return str.toUpperCase();
                }
            }

            const store = new FakeStore();
            const comp = Component.create(store, new Person());
            const info = ComponentInfo.getInfo(comp);
            const reducer = info.reducerCreator(() => { /* noop */ });

            var newState = reducer({}, { type: 'Person.changeName', payload: ['alon'] }) as any;

            expect(newState.name).to.eql('ALON');
        });
    });
});