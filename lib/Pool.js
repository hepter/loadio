var Pool = /** @class */ (function () {
    function Pool(poolKey) {
        var _this = this;
        this.poolList = [];
        this.subscribeList = [];
        this.taskCount = 0;
        this.promiseFinisher = function (promise) { return function () {
            _this.poolList = _this.poolList.filter(function (item) { return item !== promise; });
            _this.notifyStatus();
        }; };
        this.notifyStatus = function () {
            _this.subscribeList.forEach(function (func) {
                var paramObj = {
                    key: _this.poolKey,
                    isLoading: _this.poolList.length !== 0,
                    percentage: parseInt((100 - (100 * (_this.poolList.length / _this.taskCount))).toFixed()),
                    runningTasks: _this.poolList.length
                };
                if (_this.poolList.length === 0) {
                    _this.taskCount = 0;
                }
                func(paramObj);
            });
        };
        this.poolKey = poolKey;
    }
    Pool.prototype.subscribe = function (callback) {
        var _this = this;
        this.subscribeList.push(callback);
        return function () {
            _this.subscribeList = _this.subscribeList.filter(function (item) { return item !== callback; });
        };
    };
    Pool.prototype.append = function (promise) {
        promise.finally(this.promiseFinisher(promise));
        this.poolList.push(promise);
        this.taskCount++;
        this.notifyStatus();
    };
    return Pool;
}());
export { Pool };
