export type HasTarget<K extends InputElement = InputElement> = {
    target: K | null;
};
export interface InputElement extends EventTarget {
    name: string;
    type: string;
    value: string;
    checked?: boolean;
}
export declare function wrapHandler<K extends InputElement, T extends HasTarget<K>>(setter: CallableFunction): (event: T) => void;
