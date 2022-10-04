import { Form, Selector, Setter } from '../types';
export declare function useFormSelector<T>(form: Form<T>, selector: Selector<T>): [any, Setter<T>, Form<T>];
