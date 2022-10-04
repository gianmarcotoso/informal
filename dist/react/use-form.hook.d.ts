import { DeepPartial, Form, Producer, Setter } from '../types';
export declare function useForm<T>(initialState?: DeepPartial<T>, middleware?: Producer<T>): [T, Setter<T>, Form<T>];
