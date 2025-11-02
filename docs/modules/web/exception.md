<img src="https://kekse.biz/github.php?draw&text=`Error`&override=github:v4" />

# `Error` (JavaScript's **Exception**)

At this moment I'm extending this base class with just one function:

* **`isError(... _args)`**

## Testing types
This is just a short hint: I **never** use the regular `instanceof` operator
but rather my `Reflect.is()` or `Reflect.was()` functions (not documentation yet)!

The reason is the 'context', which could change - e.g. with Frames, etc.. so I'm
testing the names instead (`.constructor.name` or `.name`, sometimes)!

## Events
Like within [Node.js](https://nodejs.org/) (as far as I remember/know..) the
`error` event is something special..

My solution is my [`Event`](./event.md) extension `.emitError(..)`.

This way one either catches and handles the `error` events, or the error will
be thrown (as usual here, either via global `error()` function, or via `throw`
if no such function is available.

See also the [Event](./event.md).

## Error function
Once I decided to use my own (global) `error()` function instead of always use
the regular `throw` .. for some reasons.

I'm using it most times.. but maybe it's just an option (for you)? I'm not sure atm.. xD~

