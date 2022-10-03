import { DeepPartial, Form, MiddlewareFunction } from './types';
export declare function createForm<T>(initialState?: DeepPartial<T>, middleware?: MiddlewareFunction<T>): Form<T>;
