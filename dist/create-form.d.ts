import { DeepPartial, Form, Producer } from './types';
export declare function createForm<T>(initialState?: DeepPartial<T>, middleware?: Producer<T>): Form<T>;
