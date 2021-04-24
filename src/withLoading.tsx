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
            const [defaultStatus, setDefaultStatus] = React.useState<Omit<WithLoadingState, "statusList">>({});
            const [statusList, setStatusList] = React.useState<Record<string, Omit<WithLoadingState, "statusList">>>({});
            const [unsubscribeFuncList] = React.useState<Function[]>([]);
            useEffect(() => {
                const poolChanged = (params: StatusCallback) => {
                    if (
                        (settings?.poolKey?.length && settings.poolKey.indexOf(params.key) > -1) ||
                        (typeof settings.poolKey === "string" && params.key === (settings.poolKey ?? "default"))
                    ) {
                        if (params.key === "default") {
                            let newState: WithLoadingState = defaultStatus;
                            if (params.isLoading !== defaultStatus.isLoading) {
                                newState = { ...newState, isLoading: params.isLoading };
                            }
                            if (params.percentage !== defaultStatus.percentage) {
                                newState = { ...newState, percentage: params.percentage };
                            }
                            if (params.runningTasks !== defaultStatus.runningTasks) {
                                newState = { ...newState, runningTasks: params.runningTasks };
                            }
                            setDefaultStatus(newState);
                        } else {
                            statusList[params.key] = { ...params }
                            setStatusList({ ...statusList })
                        }
                    }
                }
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
                    isLoading={defaultStatus.isLoading}
                    percentage={defaultStatus.percentage}
                    runningTasks={defaultStatus.runningTasks}
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





