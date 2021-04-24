import React, { useEffect } from "react";
import { Pool, StatusCallback } from "./Pool";
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
        function EnhancedWithLoading({ forwardedRef, ...rest }: { forwardedRef: React.Ref<T> }) {
            const [isLoading, setIsLoading] = React.useState(false);
            const [percentage, setPercentage] = React.useState(0);
            const [runningTasks, setRunningTasks] = React.useState(0);
            const [statusList, setStatusList] = React.useState<Record<string, Omit<WithLoadingState, "statusList">>>({});
            const [unsubscribeFuncList] = React.useState<Function[]>([]);

            const poolChanged = (params: StatusCallback) => {
                if (
                    (settings?.poolKey?.length && settings.poolKey.indexOf(params.key) > -1) ||
                    (typeof settings.poolKey === "string" && params.key === (settings.poolKey ?? "default"))
                ) {
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
            }
            useEffect(() => {
                var defaultPool = poolMap.find(a => a.poolKey === "default");
                if (defaultPool === undefined) {
                    throw new TypeError('The value was promised to always be there!');
                }

                unsubscribeFuncList.push(Pool.subscribe(poolChanged))

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





