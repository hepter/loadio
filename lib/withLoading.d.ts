import React from "react";
export interface WithLoadingState {
    isLoading?: boolean;
    percentage?: number;
    runningTasks?: number;
    statusList?: {
        [key: string]: Omit<WithLoadingState, "statusList">;
    };
}
export declare type WithLoadingSettings = {
    /**
     * Use poolKey single or as an array. All loading statuses will store in the 'statusList' array with pool key except 'default' pool
     * Default is `'default'`.
     */
    poolKey?: string | Array<string>;
};
export declare function withLoading(settings?: WithLoadingSettings): <T extends WithLoadingState>(Component: React.ComponentType<T>) => React.ForwardRefExoticComponent<Pick<any, string | number | symbol> & React.RefAttributes<T>>;
