import { useEffect, useState } from 'react';
import { Pool, PoolCallbackParams } from "./Pool";
import { PoolManager } from "./PoolManager";

/** 
 * Returns information about the target pool with hook
 * @param poolKey  Unique pool key. Default value is `'default'`
 * @returns Pool status
 */
export function useStatus(poolKey: string = "default"): PoolCallbackParams {
    const [pool, setPool] = useState<Pool | null>(null);
    const [status, setStatus] = useState({
        isLoading: false,
        percentage: 0,
        runningTasks: 0,
        totalQueuedTask: 0
    });

    useEffect(() => {
        setPool(PoolManager.get(poolKey));
    }, [poolKey]);
    useEffect(() => {
        return pool?.subscribe((params) => {
            setStatus(params)
        })
    }, [pool]);
    return status as PoolCallbackParams;
}