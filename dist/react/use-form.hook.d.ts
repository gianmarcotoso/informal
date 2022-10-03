import { DeepPartial, Form, MiddlewareFunction, Setter } from '../types';
export declare function useForm<T>(initialState?: DeepPartial<T>, middleware?: MiddlewareFunction<T>): [T, Setter<T>, Form<T>];
