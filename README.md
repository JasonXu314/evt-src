## Description

A lightweight event source library modeled off of the nanoevents library

## Installation

```
npm i @nano-utils/event-src
```

or

```
yarn add @nano-utils/event-src
```

## Usage

```js
import { EventSrc } from '@nano-utils/event-src';

const src = new EventSrc();

src.on('MY_EVENT', (evt) => {
	console.log(`Foo: ${evt.foo}`);
});

src.dispatch('MY_EVENT', { foo: 'bar' }); // Foo: bar
```

This package comes fully typed:

```ts
import { EventSrc } from '@nano-utils/event-src';

type Events = {
	MY_EVENT: { foo: string };
};

const src = new EventSrc<Events>();

src.on('MY_EVENT', (evt) => {
	console.log(`Foo: ${evt.foo}`);
});

src.dispatch('MY_EVENT', { foo: 'baz' }); // Foo: baz
```

The type `Events` may also be declared as an interface
