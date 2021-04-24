import React, { useEffect } from "react";
import { StatusCallback } from "./Pool";
import { poolMap } from "./PoolMap";


export interface WithLoadingState {
    isLoading?: boolean,
    percentage?: number,
    runningTasks?: number
    statusList?: { [key: string]: Omit<WithLoadingState, "statusList"> }
}
export type WithLoadingSettings = {

    /**
     * Use poolKey single or as an array. All loading statuses will store in the 'statusList' array with pool key except 'default' pool
     * Default is `'default'`.
     */
    poolKey?: string | Array<string>,
}

export function withLoading(settings: WithLoadingSettings = {}) {
    return function Hoc<T extends WithLoadingState>(Component: React.ComponentType<T>) {

        const [isLoading, setIsLoading] = React.useState(false);
        const [percentage, setPercentage] = React.useState(0);
        const [runningTasks, setRunningTasks] = React.useState(0);
        const [statusList, setStatusList] = React.useState<Record<string, Omit<WithLoadingState, "statusList">>>({});
        const [unsubscribeFuncList] = React.useState<Function[]>([]);

        function EnhancedWithLoading({ forwardedRef, ...rest }: {forwardedRef: React.Ref<T>}) {

            const poolChanged = (params: StatusCallback) => {
                if (params.key === "default") {
                    if (params.isLoading !== isLoading) {
                        setIsLoading(params.isLoading);
                    }
                    if (params.percentage !== percentage) {
                        setPercentage(params.percentage);
                    }
                    if (params.runningTasks !== runningTasks) {
                        setRunningTasks(params.runningTasks);
                    }
                } else {
                    statusList[params.key] = { ...params }
                    setStatusList({ ...statusList })
                }
            }
            useEffect(() => {
                var defaultPool = poolMap.find(a => a.poolKey === "default");
                if (defaultPool === undefined) {
                    throw new TypeError('The value was promised to always be there!');
                }

                if (!settings.poolKey || typeof settings.poolKey === "string") {
                    var pool = poolMap.find(a => a.poolKey === settings.poolKey) ?? defaultPool;
                    unsubscribeFuncList.push(pool.subscribe(poolChanged))
                } else if (settings.poolKey?.length) {
                    unsubscribeFuncList.push(defaultPool.subscribe(poolChanged))
                    settings.poolKey.forEach(key => {
                        var pool = poolMap.find(a => a.poolKey === key)
                        if (!pool) {
                            throw new Error(`withLoading initialize failed! '${key}' pool is not found or withPool not initialized yet`)
                        }
                        unsubscribeFuncList.push(pool.subscribe(poolChanged))
                    })
                }
                return () => unsubscribeFuncList.forEach(func => func());
            }, []);

            return (
                <Component
                    ref={forwardedRef}
                    isLoading={isLoading}
                    percentage={percentage}
                    runningTasks={runningTasks}
                    statusList={statusList}
                    {...rest as T}
                />
            );
        }

        return React.forwardRef<T, any>((props, ref) => {
            return <EnhancedWithLoading forwardedRef={ref} {...props} />;
        });
    };
}





