import { PoolManager } from "./PoolManager";


export function withPool<T extends (...params: any) => Promise<any>>(method: T, poolKey: string = "default") {

    let pool = PoolManager.get(poolKey) 
    const withPoolFunction = (...params: any[]) => {
        let promise = method(...params);
        pool.append(promise);
        return promise;
    }
    return withPoolFunction as T;
}