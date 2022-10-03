import { Form, PathElement, Setter } from '../types';
export declare function useFormFocus<T, K>(form: Form<T>, ...path: PathElement[]): [K, Setter<K>, Form<K>];
