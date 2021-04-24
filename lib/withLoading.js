var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import { poolMap } from "./PoolMap";
export function withLoading(settings) {
    if (settings === void 0) { settings = {}; }
    return function Hoc(Component) {
        var EnhancedWithLoading = /** @class */ (function (_super) {
            __extends(EnhancedWithLoading, _super);
            function EnhancedWithLoading() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.state = {
                    isLoading: false,
                    percentage: 0,
                    runningTasks: 0,
                    statusList: {}
                };
                _this.unsubscribeFuncList = [];
                _this.poolChanged = function (_a) {
                    var _b;
                    var key = _a.key, isLoading = _a.isLoading, percentage = _a.percentage, runningTasks = _a.runningTasks;
                    var statusList = _this.state.statusList;
                    var newState = { statusList: __assign({}, statusList) };
                    if (key === "default") {
                        if (_this.state.isLoading !== isLoading) {
                            newState = __assign(__assign({}, newState), { isLoading: isLoading });
                        }
                        if (_this.state.percentage !== percentage) {
                            newState = __assign(__assign({}, newState), { percentage: percentage });
                        }
                        if (_this.state.runningTasks !== runningTasks) {
                            newState = __assign(__assign({}, newState), { runningTasks: runningTasks });
                        }
                    }
                    else {
                        (_b = newState.statusList) !== null && _b !== void 0 ? _b : (newState.statusList = {});
                        newState.statusList[key] = {
                            isLoading: isLoading,
                            percentage: percentage,
                            runningTasks: runningTasks
                        };
                    }
                    _this.setState(newState);
                };
                return _this;
            }
            EnhancedWithLoading.prototype.componentDidMount = function () {
                var _this = this;
                var _a, _b;
                var defaultPool = poolMap.find(function (a) { return a.poolKey === "default"; });
                if (defaultPool === undefined) {
                    throw new TypeError('The value was promised to always be there!');
                }
                if (!settings.poolKey || typeof settings.poolKey === "string") {
                    var pool = (_a = poolMap.find(function (a) { return a.poolKey === settings.poolKey; })) !== null && _a !== void 0 ? _a : defaultPool;
                    this.unsubscribeFuncList.push(pool.subscribe(this.poolChanged));
                }
                else if ((_b = settings.poolKey) === null || _b === void 0 ? void 0 : _b.length) {
                    this.unsubscribeFuncList.push(defaultPool.subscribe(this.poolChanged));
                    settings.poolKey.forEach(function (key) {
                        var pool = poolMap.find(function (a) { return a.poolKey === key; });
                        if (!pool) {
                            throw new Error("withLoading initialize failed! '" + key + "' pool is not found or withPool not initialized yet");
                        }
                        _this.unsubscribeFuncList.push(pool.subscribe(_this.poolChanged));
                    });
                }
            };
            EnhancedWithLoading.prototype.componentWillUnmount = function () {
                this.unsubscribeFuncList.forEach(function (func) { return func(); });
            };
            EnhancedWithLoading.prototype.render = function () {
                var _a = this.props, forwardedRef = _a.forwardedRef, rest = __rest(_a, ["forwardedRef"]);
                var _b = this.state, isLoading = _b.isLoading, percentage = _b.percentage, runningTasks = _b.runningTasks, statusList = _b.statusList;
                return (_jsx(Component, __assign({ ref: forwardedRef, isLoading: isLoading, percentage: percentage, runningTasks: runningTasks, statusList: statusList }, rest), void 0));
            };
            return EnhancedWithLoading;
        }(React.PureComponent));
        return React.forwardRef(function (props, ref) {
            return _jsx(EnhancedWithLoading, __assign({ forwardedRef: ref }, props), void 0);
        });
    };
}
