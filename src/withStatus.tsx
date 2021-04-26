import React, { useEffect } from "react";
import { PoolCallbackParams } from "./Pool";
import { PoolManager } from "./PoolManager";


export interface WithStatusCallbackParams extends Omit<PoolCallbackParams, "key"> {
}
export interface WithStatusState extends WithStatusCallbackParams {
    /**
     * Pool status key-value pair list except 'default' 
     */
    statusList?: { [key: string]: Omit<WithStatusState, "statusList"> }
}
export type WithStatusSettings = {

    /**
     * Use poolKey single or as an array. All loading statuses will store in the 'statusList' array with pool key except 'default' pool
     * Default is `'default'`.
     */
    poolKey?: string | Array<string>,
}

export function withStatus<T extends WithStatusState>(Component: React.ComponentType<T>, settings?: WithStatusSettings) {
    let s = settings ?? { poolKey: "default" };
    function EnhancedWithStatus({ forwardedRef, ...rest }: { forwardedRef: React.Ref<T> }) {
        const [defaultStatus, setDefaultStatus] = React.useState<WithStatusCallbackParams>({
            isLoading: false,
            percentage: 0,
            runningTasks: 0,
            totalQueuedTask: 0
        });
        const [statusList, setStatusList] = React.useState<Record<string, WithStatusCallbackParams>>({});
        useEffect(() => {
            const poolChanged = (params: PoolCallbackParams) => {
                if (params.key === "default") {
                    let newState: WithStatusState = defaultStatus;
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

            let unsubscribe = PoolManager.subscribe(poolChanged, s.poolKey);
            return unsubscribe;
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        return (
            <Component
                ref={forwardedRef}
                statusList={statusList}
                {...defaultStatus}
                {...rest as T}
            />
        );
    }

    return React.forwardRef<T>((props, ref) => {
        return <EnhancedWithStatus forwardedRef={ref} {...props} />;
    });
};





