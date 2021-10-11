import { EventMap, EvtListener, FullEventMap, HostEventSource, ListenerMap, Unsubscriber } from './types';

export class EventSrc<T extends EventMap> {
	/**
	 * The listeners registered on this source
	 */
	private _listeners: ListenerMap<T>;

	/**
	 * Creates a new event source
	 * @param evts The events you want this to handle
	 */
	constructor() {
		this._listeners = {} as ListenerMap<T>;
	}

	/**
	 * Adds a listener to the event
	 * @param event the event to listen to
	 * @param listener the listener to add
	 * @returns the listener
	 */
	public on<E extends keyof T>(event: E, listener: EvtListener<T[E]>): Unsubscriber {
		if (!this._listeners[event]) {
			this._listeners[event] = [];
		}

		this._listeners[event].push(listener);
		return () => {
			this._listeners[event] = this._listeners[event].filter((l) => l !== listener);
		};
	}

	/**
	 * Triggers the listeners for the event
	 * @param event the event to trigger
	 */
	public dispatch<E extends keyof T>(event: E, ...data: T[E] extends undefined ? [] : [T[E]]): void {
		if (data.length > 1) {
			throw new Error('All events must take only 1 parameter');
		}

		this._listeners[event].forEach((listener: EvtListener<T[E]>) => listener(...data));
	}

	public static fromSrc<T extends FullEventMap, S extends HostEventSource<T>>(src: S, events: (keyof T)[]): EventSrc<T> {
		const newEvtSrc = new EventSrc<T>();

		events.forEach(<K extends keyof T>(eventName: K) => {
			// @ts-ignore no clue why ts fucks up here, but it should work nonetheless
			src.addEventListener(eventName, (evt) => newEvtSrc.dispatch(eventName, evt));
		});

		return newEvtSrc;
	}
}
