export type Primitives = string | number | boolean | symbol | ((...args: any) => any);
export type EventArg = Primitives | { [key: string | number | symbol]: EventArg } | EventArg[];
export type KeyOf<T> = Extract<keyof T, string>;

export interface HostEventSource<T extends HostEventMap<E>, E extends string = KeyOf<T>> {
	addEventListener<K extends KeyOf<T>>(type: K, listener: (...evt: T[K]) => any): void;
	removeEventListener<K extends KeyOf<T>>(type: K, listener: (...evt: T[K]) => any): void;
}

export type EventMap<E extends string> = { [K in Extract<E, string>]: EventArg[] };
export type HostEventMap<E extends string> = { [K in Extract<E, string>]: [EventArg] };

export type EvtListener<T extends EventArg[]> = (...evt: T) => any;

export type Unsubscriber = () => void;

export type ListenerMap<T extends EventMap<E>, E extends string = KeyOf<T>> = {
	[event in KeyOf<T>]: EvtListener<T[event]>[];
};
