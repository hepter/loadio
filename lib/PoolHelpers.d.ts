export declare function withPool<T extends (...params: any) => Promise<any>>(method: T, poolKey?: string): T;
