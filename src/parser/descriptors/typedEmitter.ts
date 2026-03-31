import EventEmitter from 'stream';

export abstract class TypedEventEmitter<T extends Record<string, any>> extends EventEmitter {
	constructor() {
		super();
	}

	//@ts-expect-error We are forcing the type system to understand that the event names are keys of T and the listener arguments are of type T[K]
	addListener<K extends keyof T>(event: K | (string & {}), listener: (args: T[K]) => void) {
		return super.addListener(event as string, listener);
	}
	//@ts-expect-error We are forcing the type system to understand that the event names are keys of T and the listener arguments are of type T[K]
	emit<K extends keyof T>(event: K | (string & {}), ...data: T[K][]) {
		return super.emit(event as string, ...data);
	}
	//@ts-expect-error We are forcing the type system to understand that the event names are keys of T and the listener arguments are of type T[K]
	on<K extends keyof T>(event: K | (string & {}), listener: (args: T[K]) => void) {
		return super.on(event as string, listener);
	}
	//@ts-expect-error We are forcing the type system to understand that the event names are keys of T and the listener arguments are of type T[K]
	once<K extends keyof T>(event: K, listener: (args: T[K]) => void) {
		return super.once(event as string, listener);
	}
	//@ts-expect-error We are forcing the type system to understand that the event names are keys of T and the listener arguments are of type T[K]
	off<K extends keyof T>(event: K, listener: (args: T[K]) => void) {
		return super.off(event as string, listener);
	}
	//@ts-expect-error We are forcing the type system to understand that the event names are keys of T and the listener arguments are of type T[K]
	removeListener<K extends keyof T>(event: K, listener: (args: T[K]) => void) {
		return super.removeListener(event as string, listener);
	}
	//@ts-expect-error We are forcing the type system to understand that the event names are keys of T and the listener arguments are of type T[K]
	removeAllListeners<K extends keyof T>(event: K) {
		return super.removeAllListeners(event as string);
	}
}
