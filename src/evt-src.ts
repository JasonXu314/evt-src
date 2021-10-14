import { EventMap, EvtListener, HostEventMap, HostEventSource, KeyOf, ListenerMap, Unsubscriber } from './types';

export class EventSrc<T extends EventMap<E>, E extends string = KeyOf<T>> {
	/**
	 * The listeners registered on this source
	 */
	private _listeners: ListenerMap<T>;

	/**
	 * Creates a new event source
	 */
	constructor() {
		this._listeners = {} as ListenerMap<T>;
	}

	/**
	 * Adds a listener to the event
	 * @param event the event to listen to
	 * @param listener the listener to add
	 * @returns an unsubscriber, for removing the listener
	 */
	public on<E extends KeyOf<T>>(event: E, listener: EvtListener<T[E]>): Unsubscriber {
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
	 * @param data the data to pass to the listener (if it accepts data)
	 */
	public dispatch<E extends KeyOf<T>>(event: E, ...data: T[E]): void {
		this._listeners[event]?.forEach((listener) => listener(...data));
	}

	/**
	 * Creates an event source which listens to the given events on the underlying source and dispatches them upon receipt
	 * @param src the underlying event source
	 * @param events the events on the underlying source to listen to
	 * @returns an event source wrapping the given source
	 */
	public static wrap<T extends HostEventMap<E>, E extends KeyOf<T> = KeyOf<T>>(src: HostEventSource<T>, events: E[]): EventSrc<T> {
		const newEvtSrc = new EventSrc<T>();

		events.forEach((eventName) => {
			src.addEventListener(eventName, (...evt: T[E]) => newEvtSrc.dispatch(eventName, ...evt));
		});

		return newEvtSrc;
	}
}
