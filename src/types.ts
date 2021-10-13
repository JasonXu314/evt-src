export type Primitives = string | number | boolean | symbol | ((...args: any) => any);
export type EventArg = Primitives | { [key: Key]: EventArg } | EventArg[];
export type Key = string | number | symbol;

export interface HostEventSource<T extends HostEventMap<E>, E extends Key = keyof T> {
	addEventListener<K extends keyof T>(type: K, listener: (...evt: T[K]) => any): void;
	removeEventListener<K extends keyof T>(type: K, listener: (...evt: T[K]) => any): void;
}

export type EventMap<E extends Key> = { [K in E]: EventArg[] };
export type HostEventMap<E extends Key> = Record<E, [EventArg]>;

export type EvtListener<T extends EventArg[]> = (...evt: T) => any;

export type Unsubscriber = () => void;

export type ListenerMap<T extends EventMap<E>, E extends Key = keyof T> = {
	[event in E]: EvtListener<T[event]>[];
};
