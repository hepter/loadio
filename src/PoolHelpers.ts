import { Pool } from "./Pool";
import { poolMap } from "./PoolMap";



export function withPool<T extends (...params: any) => Promise<any>>(method: T, poolKey: string = "default") {

    let poolResult = poolMap.find(item => item.poolKey === poolKey);
    let pool = poolResult ?? new Pool(poolKey);
    if (!poolResult) {
        poolMap.push(pool)
    }
    const withPoolFunction = (...params: any[]) => {
        let promise = method(...params);
        pool.append(promise);
        return promise;
    }
    return withPoolFunction as T;
}