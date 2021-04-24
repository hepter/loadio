import { Pool } from "./Pool";
import { poolMap } from "./PoolMap";
export function withPool(method, poolKey) {
    if (poolKey === void 0) { poolKey = "default"; }
    var poolResult = poolMap.find(function (item) { return item.poolKey === poolKey; });
    var pool = poolResult !== null && poolResult !== void 0 ? poolResult : new Pool(poolKey);
    if (!poolResult) {
        poolMap.push(pool);
    }
    var withPoolFunction = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        var promise = method.apply(void 0, params);
        pool.append(promise);
        return promise;
    };
    return withPoolFunction;
}
