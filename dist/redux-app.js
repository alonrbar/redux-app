(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("redux-app", [], factory);
	else if(typeof exports === 'object')
		exports["redux-app"] = factory();
	else
		root["redux-app"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

// CONCATENATED MODULE: ./src/symbols.ts
function isSymbol(obj) {
    return typeof obj === 'symbol' || obj instanceof Symbol;
}
function setSymbol(obj, symbol, value) {
    return obj[symbol] = value;
}
function getSymbol(obj, symbol) {
    return obj[symbol];
}
function getOwnSymbol(obj, symbol) {
    return Object.getOwnPropertySymbols(obj).includes(symbol) && getSymbol(obj, symbol);
}
var COMPONENT_INFO = Symbol('REDUX-APP.COMPONENT_INFO');
var COMPONENT_TEMPLATE_INFO = Symbol('REDUX-APP.COMPONENT_TEMPLATE_INFO');
var CLASS_INFO = Symbol('REDUX-APP.CLASS_INFO');
var AUTO_ID = Symbol('REDUX-APP.AUTO_ID');

// CONCATENATED MODULE: ./src/info/classInfo.ts

var classInfo_ClassInfo = (function () {
    function ClassInfo() {
        this.ignoreState = {};
    }
    ClassInfo.getInfo = function (obj) {
        if (!obj)
            return undefined;
        return getSymbol(obj, CLASS_INFO);
    };
    ClassInfo.getOrInitInfo = function (obj) {
        var info = ClassInfo.getInfo(obj);
        if (!info) {
            info = setSymbol(obj, CLASS_INFO, new ClassInfo());
        }
        return info;
    };
    return ClassInfo;
}());


// CONCATENATED MODULE: ./src/info/componentInfo.ts

var componentInfo_ComponentInfo = (function () {
    function ComponentInfo(template, dispatch, id) {
        this.originalClass = template.constructor;
        this.dispatch = dispatch;
        this.id = id;
    }
    ComponentInfo.getInfo = function (component) {
        if (!component)
            return undefined;
        return getSymbol(component, COMPONENT_INFO);
    };
    ComponentInfo.initInfo = function (component, template, dispatch, id) {
        var info = new ComponentInfo(template, dispatch, id);
        return setSymbol(component, COMPONENT_INFO, info);
    };
    return ComponentInfo;
}());


// CONCATENATED MODULE: ./src/options.ts
var AppOptions = (function () {
    function AppOptions() {
    }
    return AppOptions;
}());

var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["None"] = 0] = "None";
    LogLevel[LogLevel["Verbose"] = 1] = "Verbose";
    LogLevel[LogLevel["Debug"] = 2] = "Debug";
    LogLevel[LogLevel["Warn"] = 5] = "Warn";
    LogLevel[LogLevel["Silent"] = 10] = "Silent";
})(LogLevel || (LogLevel = {}));
var GlobalOptions = (function () {
    function GlobalOptions() {
        this.logLevel = LogLevel.Warn;
        this.actionNameResolver = function (className, methodName) { return "[" + className + "] " + methodName; };
    }
    return GlobalOptions;
}());

var globalOptions = new GlobalOptions();

// CONCATENATED MODULE: ./src/utils/log.ts

var log_Log = (function () {
    function Log() {
    }
    Log.prototype.verbose = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        if (!this.shouldLog(LogLevel.Verbose))
            return;
        console.debug.apply(console, ['VERBOSE [redux-app] ' + message].concat(optionalParams));
    };
    Log.prototype.debug = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        if (!this.shouldLog(LogLevel.Debug))
            return;
        console.log.apply(console, ['DEBUG [redux-app] ' + message].concat(optionalParams));
    };
    Log.prototype.warn = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        if (!this.shouldLog(LogLevel.Warn))
            return;
        console.warn.apply(console, ['WARN [redux-app] ' + message].concat(optionalParams));
    };
    Log.prototype.shouldLog = function (level) {
        if (globalOptions.logLevel === LogLevel.None)
            return false;
        if (globalOptions.logLevel > level)
            return false;
        return true;
    };
    return Log;
}());
var log = new log_Log();

// CONCATENATED MODULE: ./src/utils/simpleCombineReducers.ts
function simpleCombineReducers(reducers) {
    var reducerKeys = Object.keys(reducers);
    return function combination(state, action) {
        if (state === void 0) { state = {}; }
        var hasChanged = false;
        var nextState = {};
        for (var _i = 0, reducerKeys_1 = reducerKeys; _i < reducerKeys_1.length; _i++) {
            var key = reducerKeys_1[_i];
            var reducer = reducers[key];
            var previousStateForKey = state[key];
            var nextStateForKey = reducer(previousStateForKey, action);
            nextState[key] = nextStateForKey;
            hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
        }
        return hasChanged ? nextState : state;
    };
}

// CONCATENATED MODULE: ./src/utils/utils.ts

var DescriptorType;
(function (DescriptorType) {
    DescriptorType["None"] = "None";
    DescriptorType["Field"] = "Field";
    DescriptorType["Property"] = "Property";
    DescriptorType["Method"] = "Method";
})(DescriptorType || (DescriptorType = {}));
function defineProperties(target, source, descriptorTypes) {
    var descriptors = getAllPropertyDescriptors(source, descriptorTypes);
    for (var _i = 0, _a = Object.keys(descriptors); _i < _a.length; _i++) {
        var key = _a[_i];
        Object.defineProperty(target, key, descriptors[key]);
    }
    return target;
}
function getAllPropertyDescriptors(obj, descriptorTypes) {
    var result = {};
    while (obj.constructor !== Object) {
        var descriptors = Object.getOwnPropertyDescriptors(obj);
        if (descriptorTypes && descriptorTypes.length) {
            var filteredDescriptors = {};
            for (var _i = 0, _a = Object.keys(descriptors); _i < _a.length; _i++) {
                var key = _a[_i];
                for (var _b = 0, descriptorTypes_1 = descriptorTypes; _b < descriptorTypes_1.length; _b++) {
                    var flag = descriptorTypes_1[_b];
                    var shouldAdd = false;
                    switch (flag) {
                        case DescriptorType.None:
                            break;
                        case DescriptorType.Field:
                            shouldAdd = (typeof descriptors[key].value !== 'function' && typeof descriptors[key].get !== 'function');
                            break;
                        case DescriptorType.Property:
                            shouldAdd = (typeof descriptors[key].get === 'function');
                            break;
                        case DescriptorType.Method:
                            shouldAdd = (typeof descriptors[key].value === 'function' && typeof descriptors[key].get !== 'function');
                            break;
                        default:
                            throw new Error("Property flag not supported: " + flag);
                    }
                    if (shouldAdd)
                        filteredDescriptors[key] = descriptors[key];
                }
            }
            descriptors = filteredDescriptors;
        }
        result = Object.assign(descriptors, result);
        obj = getPrototype(obj);
    }
    if (result.constructor)
        delete result.constructor;
    return result;
}
function getConstructorProp(obj, key) {
    if (!obj || !obj.constructor)
        return undefined;
    var ctor = obj.constructor;
    return ctor[key];
}
function getConstructorOwnProp(obj, key) {
    if (!obj || !obj.constructor)
        return undefined;
    var ctor = obj.constructor;
    if (isSymbol(key) && Object.getOwnPropertySymbols(ctor).includes(key)) {
        return ctor[key];
    }
    else if (typeof key === 'string' && Object.getOwnPropertyNames(ctor).includes(key)) {
        return ctor[key];
    }
    return undefined;
}
function getMethods(obj, bind) {
    if (bind === void 0) { bind = false; }
    var methodDescriptors = getAllPropertyDescriptors(obj, [DescriptorType.Method]);
    var methods = {};
    for (var _i = 0, _a = Object.keys(methodDescriptors); _i < _a.length; _i++) {
        var key = _a[_i];
        methods[key] = methodDescriptors[key].value;
        if (bind) {
            methods[key] = methods[key].bind(obj);
        }
    }
    return methods;
}
function getPrototype(obj) {
    if (typeof obj === 'object') {
        return Object.getPrototypeOf(obj);
    }
    else if (typeof obj === 'function') {
        return obj.prototype;
    }
    else {
        throw new Error("Expected an object or a function. Got: " + obj);
    }
}
function isPrimitive(val) {
    if (!val)
        return true;
    var type = typeof val;
    return type !== 'object' && type !== 'function';
}

// CONCATENATED MODULE: ./src/utils/index.ts




// CONCATENATED MODULE: ./src/info/componentTemplateInfo.ts


var componentTemplateInfo_ComponentTemplateInfo = (function () {
    function ComponentTemplateInfo() {
        this.actions = {};
        this.sequences = {};
        this.childIds = {};
    }
    ComponentTemplateInfo.getInfo = function (obj) {
        if (!obj)
            return undefined;
        var ownInfo = ComponentTemplateInfo.getOwnInfo(obj);
        if (ownInfo)
            return ownInfo;
        var baseInfo = ComponentTemplateInfo.getBaseInfo(obj);
        if (baseInfo)
            return ComponentTemplateInfo.initInfo(obj);
        return undefined;
    };
    ComponentTemplateInfo.getOrInitInfo = function (obj) {
        var info = ComponentTemplateInfo.getInfo(obj);
        if (info)
            return info;
        return ComponentTemplateInfo.initInfo(obj);
    };
    ComponentTemplateInfo.getOwnInfo = function (obj) {
        if (typeof obj === 'object') {
            return getConstructorOwnProp(obj, COMPONENT_TEMPLATE_INFO);
        }
        else {
            return getOwnSymbol(obj, COMPONENT_TEMPLATE_INFO);
        }
    };
    ComponentTemplateInfo.getBaseInfo = function (obj) {
        if (typeof obj === 'object') {
            return getConstructorProp(obj, COMPONENT_TEMPLATE_INFO);
        }
        else {
            return getSymbol(obj, COMPONENT_TEMPLATE_INFO);
        }
    };
    ComponentTemplateInfo.initInfo = function (obj) {
        var isConstructor = (typeof obj === 'function' ? true : false);
        var target = (isConstructor ? obj : obj.constructor);
        var baseInfo = getSymbol(target, COMPONENT_TEMPLATE_INFO);
        var selfInfo = Object.assign(new ComponentTemplateInfo(), baseInfo);
        return setSymbol(target, COMPONENT_TEMPLATE_INFO, selfInfo);
    };
    return ComponentTemplateInfo;
}());


// CONCATENATED MODULE: ./src/info/index.ts




// CONCATENATED MODULE: ./src/decorators/action.ts

function action_action(target, propertyKey) {
    var info = componentTemplateInfo_ComponentTemplateInfo.getOrInitInfo(target);
    info.actions[propertyKey] = true;
}

// CONCATENATED MODULE: ./src/decorators/component.ts

function component_component(ctor) {
    componentTemplateInfo_ComponentTemplateInfo.getOrInitInfo(ctor);
}

// CONCATENATED MODULE: ./src/decorators/ignoreState.ts

function ignoreState(target, propertyKey) {
    var info = classInfo_ClassInfo.getOrInitInfo(target);
    info.ignoreState[propertyKey] = true;
}
var ignoreState_IgnoreState = (function () {
    function IgnoreState() {
    }
    IgnoreState.isIgnoredProperty = function (propHolder, propKey) {
        var info = classInfo_ClassInfo.getInfo(propHolder);
        return info && info.ignoreState[propKey];
    };
    IgnoreState.removeIgnoredProps = function (state, obj) {
        var info = classInfo_ClassInfo.getInfo(obj);
        if (!info)
            return state;
        for (var _i = 0, _a = Object.keys(info.ignoreState); _i < _a.length; _i++) {
            var propKey = _a[_i];
            delete state[propKey];
        }
        return state;
    };
    return IgnoreState;
}());


// CONCATENATED MODULE: ./src/decorators/sequence.ts

function sequence(target, propertyKey) {
    var info = componentTemplateInfo_ComponentTemplateInfo.getOrInitInfo(target);
    info.sequences[propertyKey] = true;
}

// CONCATENATED MODULE: ./src/decorators/withId.ts



function withId(targetOrId, propertyKeyOrNothing) {
    if (propertyKeyOrNothing) {
        withIdDecorator.call(undefined, targetOrId, propertyKeyOrNothing);
    }
    else {
        return function (target, propertyKey) { return withIdDecorator(target, propertyKey, targetOrId); };
    }
}
function withIdDecorator(target, propertyKey, id) {
    var info = componentTemplateInfo_ComponentTemplateInfo.getOrInitInfo(target);
    info.childIds[propertyKey] = id || AUTO_ID;
}
var withId_ComponentId = (function () {
    function ComponentId() {
    }
    ComponentId.nextAvailableId = function () {
        return --ComponentId.autoComponentId;
    };
    ComponentId.getComponentId = function (parentTemplate, path) {
        var pathArray = path.split('.');
        if (!parentTemplate || !pathArray.length)
            return undefined;
        var info = componentTemplateInfo_ComponentTemplateInfo.getInfo(parentTemplate);
        if (!info)
            return;
        var selfKey = pathArray[pathArray.length - 1];
        var id = info.childIds[selfKey];
        if (!id)
            return undefined;
        if (id === AUTO_ID) {
            var generatedId = ComponentId.nextAvailableId();
            log.verbose('[getComponentId] new component id generated: ' + generatedId);
            info.childIds[selfKey] = generatedId;
            return generatedId;
        }
        return id;
    };
    ComponentId.autoComponentId = 0;
    return ComponentId;
}());


// CONCATENATED MODULE: ./src/decorators/index.ts






// EXTERNAL MODULE: external "redux"
var external__redux_ = __webpack_require__(2);
var external__redux__default = /*#__PURE__*/__webpack_require__.n(external__redux_);

// CONCATENATED MODULE: ./src/reduxApp.ts
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};






var ROOT_COMPONENT_PATH = 'root';
var DEFAULT_APP_NAME = 'default';
var appsRepository = {};
var appsCount = 0;
var UpdateContext = (function () {
    function UpdateContext(initial) {
        this.visited = new Set();
        this.path = ROOT_COMPONENT_PATH;
        Object.assign(this, initial);
    }
    return UpdateContext;
}());
var reduxApp_ReduxApp = (function () {
    function ReduxApp(appTemplate) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        this.warehouse = new Map();
        this.initialStateUpdated = false;
        var _a = this.resolveParameters(appTemplate, params), options = _a.options, preLoadedState = _a.preLoadedState, enhancer = _a.enhancer;
        this.name = this.getAppName(options.name);
        if (appsRepository[this.name])
            throw new Error("An app with name '" + this.name + "' already exists.");
        appsRepository[this.name] = this;
        var initialReducer = function (state) { return state; };
        this.store = Object(external__redux_["createStore"])(initialReducer, preLoadedState, enhancer);
        var creationContext = new component_ComponentCreationContext({ appName: this.name });
        var rootComponent = component_Component.create(this.store, appTemplate, creationContext);
        this.root = rootComponent;
        this.registerComponents(creationContext.createdComponents);
        var reducersContext = new reducer_CombineReducersContext({
            componentPaths: Object.keys(creationContext.createdComponents)
        });
        var rootReducer = reducer_ComponentReducer.combineReducersTree(this.root, reducersContext);
        var stateListener = this.updateState(reducersContext);
        this.subscriptionDisposer = this.store.subscribe(stateListener);
        this.store.replaceReducer(rootReducer);
    }
    ReduxApp.createApp = function (appTemplate) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        return new (ReduxApp.bind.apply(ReduxApp, [void 0, appTemplate].concat(params)))();
    };
    ReduxApp.getComponent = function (type, componentId, appId) {
        var app = ReduxApp.getApp(appId);
        if (!app)
            throw new Error("App not found (id: '" + (appId || DEFAULT_APP_NAME) + "')");
        var warehouse = app.getTypeWarehouse(type);
        if (componentId) {
            var comp = warehouse.get(componentId);
            if (!comp)
                throw new Error("Component not found. Type: " + type.name + ". Id: '" + componentId + "'.");
            return comp;
        }
        else {
            var comp = warehouse.values().next().value;
            if (!comp)
                throw new Error("Component not found. Type: " + type.name + ".");
            return comp;
        }
    };
    ReduxApp.getApp = function (appId) {
        var applicationId = appId || DEFAULT_APP_NAME;
        var app = appsRepository[applicationId];
        if (!app)
            log.debug("[ReduxApp] Application '" + applicationId + "' does not exist.");
        return app;
    };
    ReduxApp.prototype.dispose = function () {
        if (this.subscriptionDisposer) {
            this.subscriptionDisposer();
            this.subscriptionDisposer = null;
        }
        if (appsRepository[this.name]) {
            delete appsRepository[this.name];
        }
    };
    ReduxApp.prototype.resolveParameters = function (appTemplate, params) {
        var result = {};
        if (params.length === 0) {
            result.options = new AppOptions();
            result.preLoadedState = appTemplate;
        }
        else if (params.length === 1) {
            if (typeof params[0] === 'function') {
                result.options = new AppOptions();
                result.enhancer = params[0];
                result.preLoadedState = appTemplate;
            }
            else {
                result.options = Object.assign(new AppOptions(), params[0]);
                result.preLoadedState = appTemplate;
            }
        }
        else if (params.length === 2) {
            result.options = Object.assign(new AppOptions(), params[0]);
            result.preLoadedState = params[1];
        }
        else {
            result.options = Object.assign(new AppOptions(), params[0]);
            result.preLoadedState = params[1];
            result.enhancer = params[2];
        }
        return result;
    };
    ReduxApp.prototype.getAppName = function (name) {
        if (name)
            return name;
        if (!Object.keys(appsRepository).length) {
            return DEFAULT_APP_NAME;
        }
        else {
            return DEFAULT_APP_NAME + '_' + (++appsCount);
        }
    };
    ReduxApp.prototype.registerComponents = function (components) {
        for (var _i = 0, _a = Object.values(components); _i < _a.length; _i++) {
            var comp = _a[_i];
            var compInfo = componentInfo_ComponentInfo.getInfo(comp);
            var warehouse = this.getTypeWarehouse(compInfo.originalClass);
            var key = compInfo.id || withId_ComponentId.nextAvailableId();
            warehouse.set(key, comp);
        }
    };
    ReduxApp.prototype.getTypeWarehouse = function (type) {
        if (!this.warehouse.has(type))
            this.warehouse.set(type, new Map());
        return this.warehouse.get(type);
    };
    ReduxApp.prototype.updateState = function (reducersContext) {
        var _this = this;
        return function () {
            if (!_this.initialStateUpdated || !reducersContext.invoked) {
                var start = Date.now();
                var newState = _this.store.getState();
                _this.updateStateRecursion(_this.root, newState, new UpdateContext());
                _this.initialStateUpdated = true;
                var end = Date.now();
                log.debug("[updateState] Component tree updated in " + (end - start) + "ms.");
            }
            else {
            }
            reducersContext.reset();
        };
    };
    ReduxApp.prototype.updateStateRecursion = function (obj, newState, context) {
        if (obj === newState)
            return newState;
        if (isPrimitive(obj) || isPrimitive(newState))
            return newState;
        if (context.visited.has(obj))
            return obj;
        context.visited.add(obj);
        var changeMessage;
        if (Array.isArray(obj) && Array.isArray(newState)) {
            changeMessage = this.updateArray(obj, newState, context);
        }
        else {
            changeMessage = this.updateObject(obj, newState, context);
        }
        if (changeMessage && changeMessage.length) {
            log.debug("[updateState] Change in '" + context.path + "'. " + changeMessage);
            log.verbose("[updateState] New state: ", obj);
        }
        return obj;
    };
    ReduxApp.prototype.updateObject = function (obj, newState, context) {
        var propsDeleted = [];
        for (var _i = 0, _a = Object.keys(obj); _i < _a.length; _i++) {
            var key = _a[_i];
            if (ignoreState_IgnoreState.isIgnoredProperty(obj, key))
                continue;
            if (!newState.hasOwnProperty(key)) {
                var desc = Object.getOwnPropertyDescriptor(obj, key);
                if (desc && typeof desc.get === 'function')
                    continue;
                if (typeof obj[key] === 'function')
                    log.warn("[updateState] Function property removed in path: " + context.path + "." + key + ". Consider using a method instead.");
                delete obj[key];
                propsDeleted.push(key);
            }
        }
        var propsAssigned = [];
        for (var _b = 0, _c = Object.keys(newState); _b < _c.length; _b++) {
            var key = _c[_b];
            if (ignoreState_IgnoreState.isIgnoredProperty(obj, key))
                continue;
            var desc = Object.getOwnPropertyDescriptor(obj, key);
            if (desc && typeof desc.get === 'function' && typeof desc.set !== 'function')
                continue;
            var subState = newState[key];
            var subObj = obj[key];
            var newSubObj = this.updateStateRecursion(subObj, subState, __assign({}, context, { path: context.path + '.' + key }));
            if (newSubObj !== subObj) {
                obj[key] = newSubObj;
                propsAssigned.push(key);
            }
        }
        if (propsAssigned.length || propsDeleted.length) {
            var propsAssignedMessage = propsAssigned.length ? "Props assigned: " + propsAssigned.join(', ') + "." : '';
            var propsDeleteMessage = propsDeleted.length ? "Props deleted: " + propsDeleted.join(', ') + "." : '';
            var space = (propsAssigned.length && propsDeleted.length) ? ' ' : '';
            return propsAssignedMessage + space + propsDeleteMessage;
        }
        else {
            return null;
        }
    };
    ReduxApp.prototype.updateArray = function (arr, newState, context) {
        var changeMessage = [];
        var prevLength = arr.length;
        var newLength = newState.length;
        var itemsAssigned = [];
        for (var i = 0; i < Math.min(prevLength, newLength); i++) {
            var subState = newState[i];
            var subObj = arr[i];
            var newSubObj = this.updateStateRecursion(subObj, subState, __assign({}, context, { path: context.path + '.' + i }));
            if (newSubObj !== subObj) {
                arr[i] = newSubObj;
                itemsAssigned.push(i);
            }
        }
        if (itemsAssigned.length)
            changeMessage.push("Assigned item(s) at indexes " + itemsAssigned.join(', ') + ".");
        if (newLength > prevLength) {
            var newItems = newState.slice(prevLength);
            Array.prototype.push.apply(arr, newItems);
            changeMessage.push("Added " + (newLength - prevLength) + " item(s) at index " + prevLength + ".");
        }
        else if (prevLength > newLength) {
            arr.splice(newLength);
            changeMessage.push("Removed " + (prevLength - newLength) + " item(s) at index " + newLength + ".");
        }
        return changeMessage.join(' ');
    };
    ReduxApp.options = globalOptions;
    return ReduxApp;
}());


// CONCATENATED MODULE: ./src/components/reducer.ts
var reducer___assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};





var reducer_CombineReducersContext = (function () {
    function CombineReducersContext(initial) {
        this.visited = new Set();
        this.path = ROOT_COMPONENT_PATH;
        this.componentPaths = [];
        this.invoked = false;
        Object.assign(this, initial);
    }
    CombineReducersContext.prototype.reset = function () {
        this.invoked = false;
    };
    return CombineReducersContext;
}());

var reducer_ComponentReducer = (function () {
    function ComponentReducer() {
    }
    ComponentReducer.createReducer = function (component, componentTemplate) {
        var templateInfo = componentTemplateInfo_ComponentTemplateInfo.getInfo(componentTemplate);
        if (!templateInfo)
            throw new Error("Inconsistent component '" + componentTemplate.constructor.name + "'. The 'component' class decorator is missing.");
        var methods = ComponentReducer.createMethodsLookup(componentTemplate, templateInfo);
        var componentId = componentInfo_ComponentInfo.getInfo(component).id;
        return function (state, action) {
            log.verbose("[reducer] Reducer of: " + componentTemplate.constructor.name + ", action: " + action.type + ".");
            if (state === undefined) {
                log.verbose('[reducer] State is undefined, returning initial value.');
                return ComponentReducer.finalizeStateObject(component);
            }
            if (state === componentTemplate) {
                log.verbose("[reducer] State equals to component's template, returning initial value.");
                return ComponentReducer.finalizeStateObject(component);
            }
            if (componentId !== action.id) {
                log.verbose("[reducer] Component id and action.id don't match (" + componentId + " !== " + action.id + ").");
                return state;
            }
            var actionReducer = methods[action.type];
            if (!actionReducer) {
                log.verbose('[reducer] No matching action in this reducer, returning previous state.');
                return state;
            }
            actionReducer.call.apply(actionReducer, [component].concat(action.payload));
            log.verbose('[reducer] Reducer invoked, returning new state.');
            return ComponentReducer.finalizeStateObject(component);
        };
    };
    ComponentReducer.combineReducersTree = function (root, context) {
        var reducer = ComponentReducer.combineReducersRecursion(root, context);
        return function (state, action) {
            var start = Date.now();
            context.invoked = true;
            log.debug("[rootReducer] Reducing action: " + action.type + ".");
            var newState = reducer(state, action);
            var end = Date.now();
            log.debug("[rootReducer] Reducer tree processed in " + (end - start) + "ms.");
            return newState;
        };
    };
    ComponentReducer.createMethodsLookup = function (componentTemplate, templateInfo) {
        var allMethods = getMethods(componentTemplate);
        var actionMethods = {};
        Object.keys(templateInfo.actions).forEach(function (originalActionName) {
            var normalizedActionName = actions_ComponentActions.getActionName(componentTemplate, originalActionName);
            actionMethods[normalizedActionName] = allMethods[originalActionName];
        });
        return actionMethods;
    };
    ComponentReducer.finalizeStateObject = function (component) {
        log.verbose('[finalizeStateObject] finalizing state.');
        var finalizedState = Object.assign({}, component);
        finalizedState = ignoreState_IgnoreState.removeIgnoredProps(finalizedState, component);
        log.verbose('[finalizeStateObject] state finalized.');
        return finalizedState;
    };
    ComponentReducer.combineReducersRecursion = function (obj, context) {
        if (isPrimitive(obj))
            return undefined;
        if (context.visited.has(obj))
            return undefined;
        context.visited.add(obj);
        if (!context.componentPaths.some(function (path) { return path.startsWith(context.path); }))
            return ComponentReducer.identityReducer;
        var rootReducer;
        var info = componentInfo_ComponentInfo.getInfo(obj);
        if (info) {
            rootReducer = info.reducer;
        }
        else {
            rootReducer = ComponentReducer.identityReducer;
        }
        var subReducers = {};
        for (var _i = 0, _a = Object.keys(obj); _i < _a.length; _i++) {
            var key = _a[_i];
            var newSubReducer = ComponentReducer.combineReducersRecursion(obj[key], new reducer_CombineReducersContext(reducer___assign({}, context, { path: (context.path === '' ? key : context.path + '.' + key) })));
            if (typeof newSubReducer === 'function')
                subReducers[key] = newSubReducer;
        }
        var resultReducer = rootReducer;
        if (Object.keys(subReducers).length) {
            var combinedSubReducer_1 = simpleCombineReducers(subReducers);
            resultReducer = function (state, action) {
                var thisState = rootReducer(state, action);
                var subStates = combinedSubReducer_1(thisState, action);
                var combinedState = ComponentReducer.mergeState(thisState, subStates);
                return combinedState;
            };
        }
        return resultReducer;
    };
    ComponentReducer.mergeState = function (state, subStates) {
        if (Array.isArray(state) && Array.isArray(subStates)) {
            for (var i = 0; i < subStates.length; i++)
                state[i] = subStates[i];
            return state;
        }
        else {
            return reducer___assign({}, state, subStates);
        }
    };
    ComponentReducer.identityReducer = function (state) { return state; };
    return ComponentReducer;
}());


// CONCATENATED MODULE: ./src/components/component.ts
var component___assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};






var component_ComponentCreationContext = (function () {
    function ComponentCreationContext(initial) {
        this.visitedNodes = new Set();
        this.visitedTemplates = new Map();
        this.path = ROOT_COMPONENT_PATH;
        this.createdComponents = {};
        Object.assign(this, initial);
    }
    return ComponentCreationContext;
}());

var component_Component = (function () {
    function Component(store, template, context) {
        if (!componentTemplateInfo_ComponentTemplateInfo.getInfo(template))
            throw new Error("Argument '" + "template" + "' is not a component template. Did you forget to use the decorator?");
        Component.createSelf(this, store, template, context);
        context.createdComponents[context.path] = this;
        context.visitedTemplates.set(template, this);
        log.verbose("[Component] New " + template.constructor.name + " component created. Path: " + context.path);
        Component.createSubComponents(this, store, template, context);
    }
    Component.create = function (store, template, context) {
        context = Object.assign(new component_ComponentCreationContext(), context);
        componentTemplateInfo_ComponentTemplateInfo.getOrInitInfo(template);
        var ComponentClass = Component.getComponentClass(template);
        var component = new ComponentClass(store, template, context);
        return component;
    };
    Component.getComponentClass = function (template) {
        var info = componentTemplateInfo_ComponentTemplateInfo.getInfo(template);
        if (!info.componentClass) {
            info.componentClass = Component.createComponentClass(template);
        }
        return info.componentClass;
    };
    Component.createComponentClass = function (template) {
        var componentClassFactory = new Function('initCallback', "\"use strict\";return function " + template.constructor.name + "_ReduxAppComponent() { initCallback(this, arguments); }");
        var ComponentClass = componentClassFactory(function (self, args) { return Component.apply(self, args); });
        ComponentClass.prototype = Object.create(Component.prototype);
        ComponentClass.prototype.constructor = ComponentClass;
        var actions = actions_ComponentActions.createActions(template);
        Object.assign(ComponentClass.prototype, actions);
        return ComponentClass;
    };
    Component.createSelf = function (component, store, template, context) {
        defineProperties(component, template, [DescriptorType.Field, DescriptorType.Property]);
        var id = withId_ComponentId.getComponentId(context.parentTemplate, context.path);
        var selfInfo = componentInfo_ComponentInfo.initInfo(component, template, store.dispatch, id);
        var selfClassInfo = classInfo_ClassInfo.getOrInitInfo(component);
        var templateClassInfo = classInfo_ClassInfo.getInfo(template) || new classInfo_ClassInfo();
        selfClassInfo.ignoreState = templateClassInfo.ignoreState;
        selfInfo.reducer = reducer_ComponentReducer.createReducer(component, template);
    };
    Component.createSubComponents = function (treeNode, store, template, context) {
        if (isPrimitive(treeNode))
            return;
        if (context.visitedNodes.has(treeNode))
            return;
        context.visitedNodes.add(treeNode);
        var searchIn = template || treeNode;
        for (var _i = 0, _a = Object.keys(searchIn); _i < _a.length; _i++) {
            var key = _a[_i];
            var subPath = context.path + '.' + key;
            var subTemplate = searchIn[key];
            if (componentTemplateInfo_ComponentTemplateInfo.getInfo(subTemplate)) {
                if (context.visitedTemplates.has(subTemplate)) {
                    treeNode[key] = context.visitedTemplates.get(subTemplate);
                }
                else {
                    treeNode[key] = Component.create(store, subTemplate, component___assign({}, context, { parentTemplate: template, path: subPath }));
                }
            }
            else {
                Component.createSubComponents(treeNode[key], store, null, component___assign({}, context, { parentTemplate: null, path: subPath }));
            }
        }
    };
    return Component;
}());


// CONCATENATED MODULE: ./src/components/actions.ts




var actions_ComponentActions = (function () {
    function ComponentActions() {
    }
    ComponentActions.createActions = function (template) {
        var methods = getMethods(template);
        if (!methods)
            return undefined;
        var templateInfo = componentTemplateInfo_ComponentTemplateInfo.getInfo(template);
        var componentActions = {};
        Object.keys(methods).forEach(function (key) {
            componentActions[key] = function () {
                var payload = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    payload[_i] = arguments[_i];
                }
                if (!(this instanceof component_Component))
                    throw new Error("Component method invoked with non-Component as 'this'. " +
                        ("Component: " + template.constructor.name + ", ") +
                        ("Method: " + key + ", ") +
                        ("Bound 'this' argument is: " + this + "."));
                var oldMethod = methods[key];
                if (templateInfo.actions[key] || templateInfo.sequences[key]) {
                    var compInfo = componentInfo_ComponentInfo.getInfo(this);
                    var action = {
                        type: ComponentActions.getActionName(template, key),
                        id: (compInfo ? compInfo.id : undefined),
                        payload: payload
                    };
                    compInfo.dispatch(action);
                }
                if (!templateInfo.actions[key]) {
                    return oldMethod.call.apply(oldMethod, [this].concat(payload));
                }
            };
        });
        return componentActions;
    };
    ComponentActions.getActionName = function (template, methodName) {
        var className = template.constructor.name;
        var resolver = globalOptions.actionNameResolver;
        return resolver(className, methodName);
    };
    return ComponentActions;
}());


// CONCATENATED MODULE: ./src/components/utils.ts

function isInstanceOf(obj, type) {
    if (obj instanceof type)
        return true;
    var info = componentInfo_ComponentInfo.getInfo(obj);
    return !!(info && info.originalClass === type);
}

// CONCATENATED MODULE: ./src/components/index.ts





// CONCATENATED MODULE: ./src/index.ts
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "isInstanceOf", function() { return isInstanceOf; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "action", function() { return action_action; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "component", function() { return component_component; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "ignoreState", function() { return ignoreState; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "sequence", function() { return sequence; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "withId", function() { return withId; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "AppOptions", function() { return AppOptions; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "GlobalOptions", function() { return GlobalOptions; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "LogLevel", function() { return LogLevel; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "getMethods", function() { return getMethods; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "ReduxApp", function() { return reduxApp_ReduxApp; });







/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("redux");

/***/ })
/******/ ]);
});
//# sourceMappingURL=redux-app.js.map