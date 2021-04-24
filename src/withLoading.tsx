import React from "react";
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


        class EnhancedWithLoading extends React.PureComponent<any, WithLoadingState> {
            state = {
                isLoading: false,
                percentage: 0,
                runningTasks: 0,
                statusList: {}
            }
            unsubscribeFuncList: Function[] = []
            componentDidMount() {
                var defaultPool = poolMap.find(a => a.poolKey === "default");
                if (defaultPool === undefined) {
                    throw new TypeError('The value was promised to always be there!');
                }

                if (!settings.poolKey || typeof settings.poolKey === "string") {
                    var pool = poolMap.find(a => a.poolKey === settings.poolKey) ?? defaultPool;
                    this.unsubscribeFuncList.push(pool.subscribe(this.poolChanged))
                } else if (settings.poolKey?.length) {
                    this.unsubscribeFuncList.push(defaultPool.subscribe(this.poolChanged))
                    settings.poolKey.forEach(key => {
                        var pool = poolMap.find(a => a.poolKey === key)
                        if (!pool) {
                            throw new Error(`withLoading initialize failed! '${key}' pool is not found or withPool not initialized yet`)
                        }

                        this.unsubscribeFuncList.push(pool.subscribe(this.poolChanged))
                    })

                }
            }
            poolChanged = ({ key, isLoading, percentage, runningTasks }: StatusCallback) => {
                const { statusList } = this.state;
                let newState: WithLoadingState = { statusList: { ...statusList } }



                if (key === "default") {
                    if (this.state.isLoading !== isLoading) {
                        newState = { ...newState, isLoading };
                    }
                    if (this.state.percentage !== percentage) {
                        newState = { ...newState, percentage };
                    }
                    if (this.state.runningTasks !== runningTasks) {
                        newState = { ...newState, runningTasks };
                    }
                } else {

                    newState.statusList ??= {};
                    newState.statusList[key] = {
                        isLoading,
                        percentage,
                        runningTasks
                    }
                }

                this.setState(newState)
            }
            componentWillUnmount() {
                this.unsubscribeFuncList.forEach(func => func());
            }
            render() {
                const { forwardedRef, ...rest } = this.props;
                const { isLoading, percentage, runningTasks, statusList } = this.state
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
        }

        return React.forwardRef<T, any>((props, ref) => {
            return <EnhancedWithLoading forwardedRef={ref} {...props} />;
        });
    };
}





