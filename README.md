# Result and Option Utilities for TypeScript

The `Result` and `Option` utilities are designed to improve error handling and value management in TypeScript by providing a more functional approach. These utilities help you avoid common pitfalls associated with exceptions and null/undefined values.

## Purpose

Pickle draws inspiration from the error-handling patterns of languages like Rust, where Result and Option types enable more expressive and type-safe management of errors and uncertain values. While this implementation is not a direct 1:1 port from any specific language—given that JavaScript and TypeScript lack native support for Result and Option types—the goal is to introduce some of their advantages into your codebase. Designed to integrate seamlessly with TypeScript's type system, this library enhances the developer experience by improving the handling of errors and uncertain values.

For asynchronous tasks, Pickle provides an AsyncResult helper that wraps a Promise<Result<T, E>>, offering the same level of expressivity and control as a standard Result<T, E>.

### Table of contents

<details>
<summary>Result</summary>

- [Core](#result-core)
  - [unsafe](#unsafe)
  - [okOr](#okOr)
  - [okOrElse](#okOrElse)
  - [okOrThrow](#okOrThrow)
  - [errorOr](#errorOr)
  - [errorOrElse](#errorOrElse)
  - [errorOrThrow](#errorOrThrow)
  - [tuple](#tuple)
- [Pipable methods](#pipable-methods)
  - [or](#or)
  - [map](#map)
  - [flatMap](#flatMap)
  - [mapErr](#mapErr)
  - [flatMapErr](#flatMapErr)
  - [filter](#filter)
  - [toOption](#toOption)
  - [effect](#effect)
  - [effectErr](#effectErr)
  - [inspect](#inspect)
  - [inspectErr](#inspectErr)
- [Static methods](#static-methods)
  - [is](#is)
  - [ok](#ok)
  - [err](#err)
  - [safe](#safe)
  - [all](#all)
  - [any](#any)
  - [from](#from)
  - [fromNullable](#fromNullable)
  - [async](#async)
  </details>

<details>
<summary>Option</summary>

- [Core](#option-core)
  - [unsafe](#unsafe-1)
  - [someOr](#someOr)
  - [someOrElse](#someOrElse)
  - [someOrThrow](#someOrThrow)
  - [noneOr](#noneOr)
  - [noneOrElse](#noneOrElse)
  - [noneOrThrow](#noneOrThrow)
- [Pipable methods](#pipable-methods-1)
  - [or](#or-1)
  - [map](#map-1)
  - [flatMap](#flatMap-1)
  - [filter](#filter-1)
  - [toResult](#toResult)
  - [effect](#effect-1)
  - [effectNone](#effectNone)
  - [inspect](#inspect-1)
  - [inspectNone](#inspectNone)
- [Static methods](#static-methods-1)
  - [is](#is-1)
  - [some](#some)
  - [none](#none)
  - [safe](#safe-1)
  - [all](#all-1)
  - [any](#any-1)
  - [from](#from)
  - [fromNullable](#fromNullable-1)
  </details>

## Result

A Result represents either something good (`T`) or something not so good (`E`).
If we hold a value of type `Result<T, E>` we know it's either `Ok<T>` or
`Err<E>`.

### Result core

```typescript
import { Result } from '@bmrk/pickle';

function divide(x: number, by: number): Result<number, string> {
  return by === 0 ? Result.err('Division by zero') : Result.ok(x / by);
}

const okResult = divide(100, 20);
const errResult = divide(100, 0);
```

#### Unsafe

Returns the contained `Ok` or `Err` value.

```typescript
const res: number | string = okResult.unsafe();
assert.equal(res, 5);

const res: number | string = errResult.unsafe();
assert.equal(res, 'Division by zero');
```

#### OkOr

Returns the contained `Ok` value or a provided fallback.

```typescript
const res: number = okResult.okOr(0);
assert.equal(res, 5);

const res: number = errResult.okOr(0);
assert.equal(res, 0);
```

#### OkOrElse

Returns the contained `Ok` value or computes a fallback.

```typescript
const res: number = okResult.okOrElse(() => 0);
assert.equal(res, 5);

const res: number = errResult.okOrElse(() => 0);
assert.equal(res, 0);
```

#### OkOrThrow

Returns the contained `Ok` value or throws an error.

```typescript
const res: number = okResult.okOrThrow((err) => err);
assert.equal(res, 5);

const res: number = errResult.okOrThrow((err) => err); // Throws "Division by zero"
```

#### ErrorOr

Returns the contained `Err` value or a provided fallback.

```typescript
const res: string = okResult.errorOr('Succesfully divided');
assert.equal(res, 'Succesfully divided');

const res: string = errResult.errorOr('Succesfully divided');
assert.equal(res, 'Division by zero');
```

#### ErrorOrElse

Returns the contained `Err` value or computes a fallback.

```typescript
const res: string = okResult.errorOrElse(() => 'Succesfully divided');
assert.equal(res, 'Succesfully divided');

const res: string = errResult.errorOrElse(() => 'Succesfully divided');
assert.equal(res, 'Division by zero');
```

#### ErrorOrThrow

Returns the contained `Err` value or throws an error.

```typescript
const res: string = okResult.errorOrThrow(() => 'Expected division by zero!'); // Throws "Expected division by zero!"

const res: string = errResult.errorOrThrow(() => 'Expected division by zero!');
assert.equal(res, 'Division by zero');
```

#### Tuple

Converts the `Result` into a tuple.

```typescript
const [ok, err] = okResult.tuple();
assert.equal(ok, 5);
assert.equal(err, null);

const [ok, err] = errResult.tuple();
assert.equal(ok, null);
assert.equal(err, 'Division by zero');
```

### Pipable methods

#### Or

Returns the contained `Ok` value or the provided `Result`.

```typescript
const res: Result<number, string> = okResult.or(Result.ok(0));
assert.equal(res.unsafe(), 5);

const res: Result<number, string> = errResult.or(Result.ok(0));
assert.equal(res.unsafe(), 0);
```

#### Map

Maps a `Result<Ok, Err>` to `Result<NewOk, Err>` by applying a function to a contained `Ok` value, leaving an `Err` value untouched.

```typescript
const res: Result<number, string> = okResult.map((num) => num * 2);
assert.equal(res.unsafe(), 10);

const res: Result<number, string> = errResult.map((num) => num * 2);
assert.equal(res.unsafe(), 'Division by zero');
```

#### FlatMap

Maps a `Result<Ok, Err>` to `Result<NewOk, Err>` by applying a function to a contained `Ok` value, flattening the `Err` value.

```typescript
const res: Result<number, string> = okResult.flatMap((num) =>
  Result.ok(num * 2)
);
assert.equal(res.unsafe(), 10);

const res: Result<number, string> = errResult.flatMap((num) =>
  Result.ok(num * 2)
);
assert.equal(res.unsafe(), 'Division by zero');
```

#### MapErr

Maps a `Result<Ok, Err>` to `Result<Ok, NewErr>` by applying a function to a contained `Err` value, leaving an `Ok` value untouched.

```typescript
const res: Result<number, string> = okResult.mapErr((err) => `Error: ${err}`);
assert.equal(res.unsafe(), 5);

const res: Result<number, string> = errResult.mapErr((err) => `Error: ${err}`);
assert.equal(res.unsafe(), 'Error: Division by zero');
```

#### FlatMapErr

Maps a `Result<Ok, Err>` to `Result<Ok, NewErr>` by applying a function to a contained `Err` value, flattening the `Ok` value.

```typescript
const res: Result<number, string> = okResult.flatMapErr((err) =>
  Result.err(`Error: ${err}`)
);
assert.equal(res.unsafe(), 5);

const res: Result<number, string> = errResult.flatMapErr((err) =>
  Result.err(`Error: ${err}`)
);
assert.equal(res.unsafe(), 'Error: Division by zero');
```

#### Filter

Converts the `Result` into an `Option`.

```typescript
const res: Option<number> = okResult.filter((num) => num === 5);
assert.equal(res.isSome, true);
assert.equal(res.unsafe(), 5);

const res: Option<number> = okResult.filter((num) => num === 10);
assert.equal(res.isNone, true);
assert.equal(res.unsafe(), null);
```

#### ToOption

Converts the `Result` into an `Option`.

```typescript
const res: Option<number> = okResult.toOption();
assert.equal(res.isSome, true);
assert.equal(res.unsafe(), 5);

const res: Option<number> = errResult.toOption();
assert.equal(res.isNone, true);
assert.equal(res.unsafe(), null);
```

#### Effect

Perform side-effects from the `Ok` value without changing the result.

```typescript
const res = okResult.effect((num) => nitification(num)); // Fire and forget the notification function
assert.equal(res.unsafe(), 5);

const res = errResult.effect((num) => nitification(num)); // Does execute the notification function
assert.equal(res.unsafe(), 'Division by zero');
```

#### EffectErr

Perform side-effects from the `Err` value without changing the result.

```typescript
const res = okResult.effectErr((err) => notification(err)); // Does not execute the notification function
assert.equal(res.unsafe(), 5);

const res = errResult.effectErr((err) => notification(err)); // Fire and forget the notification function
assert.equal(res.unsafe(), 'Division by zero');
```

#### Inspect

Inspects the `Ok` value.

```typescript
const res = okResult.inspect((num) => console.log(num)); // Logs 5
assert.equal(res.unsafe(), 5);

const res = errResult.inspect((num) => console.log(num)); // Does not log
assert.equal(res.unsafe(), 'Division by zero');
```

#### InspectErr

Inspects the `Err` value.

```typescript
const res = okResult.inspectErr((err) => console.log(err)); // Does not log
assert.equal(res.unsafe(), 5);

const res = errResult.inspectErr((err) => console.log(err)); // Logs "Division by zero"
assert.equal(res.unsafe(), 'Division by zero');
```

### Static methods

#### Is

Returns `true` if `input` is a `Result`.

```typescript
const res: boolean = Result.is(okResult);
assert.equal(res, true);
```

#### Ok

Returns a `Result` with an `Ok` value.

```typescript
const res: Result<number, never> = Result.ok(5);
assert.equal(res.unsafe(), 5);
```

#### Err

Returns a `Result` with an `Err` value.

```typescript
const res: Result<never, string> = Result.err('Error');
assert.equal(res.unsafe(), 'Error');
```

#### Safe

Returns a `Result` with the result of a promise.

```typescript
const res: Result<number, string> = Result.safe(Promise.resolve(5));
assert.equal(res.unsafe(), 5);

const res: Result<number, string> = Result.safe(Promise.reject('Error'));
assert.equal(res.unsafe(), 'Error');
```

#### All

Returns a `Result` with an array of `Ok` values or the first `Err` value.

```typescript
const res: Result<[number, number], never> = Result.all(
  Result.ok(1),
  Result.ok(2)
);
assert.deepEqual(res.unsafe(), [1, 2]);

const res: Result<[number, never], string> = Result.all(
  Result.ok(1),
  Result.err('Error')
);
assert.equal(res.unsafe(), 'Error');
```

#### Any

Returns a `Result` with the first `Ok` value or an array of `Err` values.

```typescript
const res: Result<number, [never, string]> = Result.any(
  Result.ok(1),
  Result.err('Error')
);
assert.equal(res.unsafe(), 1);

const res: Result<never, [string, string]> = Result.any(
  Result.err('Error 1'),
  Result.err('Error 2')
);
assert.deepEqual(res.unsafe(), ['Error 1', 'Error 2']);
```

#### From

Returns a `Result` with an `Ok` value if `value` is truthy, otherwise an `Err` value.

```typescript
const res: Result<number, string> = Result.from(5);
assert.equal(res.isOk, true);

const res: Result<number, string> = Result.from(0);
assert.equal(res.isErr, true);
```

#### FromNullable

Returns a `Result` with an `Ok` value if `value` is not null, otherwise an `Err` value.

```typescript
const res: Result<number, string> = Result.fromNullable(5);
assert.equal(res.isOk, true);

const res: Result<number, string> = Result.fromNullable(null);
assert.equal(res.isErr, true);
```

#### Async

Returns `AsyncResult`.

```typescript
const res: Result<number, string> = await Result.async(
  Promise.resolve(Result.ok(5))
).map((num) => num * 2);
assert.equal(res.unsafe(), 10);
```

## Option

An Option represents either something, or nothing. If we hold a value of type `Option<T>`, we know it is either `Some<T>` or `None`.

### Option core

```typescript
import { Option } from '@bmrk/pickle';

function divide(x: number, by: number): Option<number> {
  return by === 0 ? Option.none : Option.some(x / by);
}

const someOption = divide(100, 20);
const noneOption = divide(100, 0);
```

#### Unsafe

Returns the contained `Some` or `None` value.

```typescript
const res: number = someOption.unsafe();
assert.equal(res, 5);

const res: number = noneOption.unsafe();
assert.equal(res, null);
```

#### SomeOr

Returns the contained `Some` value or a provided fallback.

```typescript
const res: number = someOption.someOr(0);
assert.equal(res, 5);

const res: number = noneOption.someOr(0);
assert.equal(res, 0);
```

#### SomeOrElse

Returns the contained `Some` value or computes a fallback.

```typescript
const res: number = someOption.someOrElse(() => 0);
assert.equal(res, 5);

const res: number = noneOption.someOrElse(() => 0);
assert.equal(res, 0);
```

#### SomeOrThrow

Returns the contained `Some` value or throws an error.

```typescript
const res: number = someOption.someOrThrow(() => 'Division by zero!');
assert.equal(res, 5);

const res: number = noneOption.someOrThrow(() => 'Division by zero!'); // Throws "Division by zero!"
```

#### NoneOr

Returns the contained `None` value or a provided fallback.

```typescript
const res: number = someOption.noneOr(0);
assert.equal(res, 0);

const res: number = noneOption.noneOr(0);
assert.equal(res, 0);
```

#### NoneOrElse

Returns the contained `None` value or computes a fallback.

```typescript
const res: number = someOption.noneOrElse(() => 0);
assert.equal(res, 0);

const res: number = noneOption.noneOrElse(() => 0);
assert.equal(res, 0);
```

#### NoneOrThrow

Returns the contained `None` value or throws an error.

```typescript
const res: number = someOption.noneOrThrow(() => 'Expected division by zero!'); // Throws "Expected division by zero!"

const res: number = noneOption.noneOrThrow(() => 'Expected division by zero!');
assert.equal(res, 0);
```

### Pipable methods

#### Or

Returns the contained `Some` value or the provided `Option`.

```typescript
const res: Option<number> = someOption.or(Some(0));
assert.equal(res.unsafe(), 5);

const res: Option<number> = noneOption.or(Some(0));
assert.equal(res.unsafe(), 0);
```

#### Map

Maps a `Option<Some, None>` to `Option<NewSome, None>` by applying a function to a contained `Some` value, leaving an `None` value untouched.

```typescript
const res: Option<number> = someOption.map((num) => num * 2);
assert.equal(res.unsafe(), 10);

const res: Option<number> = noneOption.map((num) => num * 2);
assert.equal(res.unsafe(), null);
```

#### FlatMap

Maps a `Option<Some, None>` to `Option<NewSome, None>` by applying a function to a contained `Some` value, flattening the `None` value.

```typescript
const res: Option<number> = someOption.flatMap((num) => Some(num * 2));
assert.equal(res.unsafe(), 10);

const res: Option<number> = noneOption.flatMap((num) => Some(num * 2));
assert.equal(res.unsafe(), null);
```

#### Filter

Returns an `Option` with a `Some` value or an `None` value.

```typescript
const res: Option<number> = someOption.filter((num) => num === 5);
assert.equal(res.unsafe(), 5);

const res: Option<number> = someOption.filter((num) => num === 10);
assert.equal(res.unsafe(), null);
```

#### ToResult

Converts the `Option` into a `Result`.

```typescript
const res: Result<number, string> = someOption.toResult('No value');
assert.equal(res.unsafe(), 5);

const res: Result<number, string> = noneOption.toResult('No value');
assert.equal(res.unsafe(), 'No value');
```

#### Effect

Perform side-effects from the `Some` value without changing the option.

```typescript
const res = someOption.effect((num) => notification(num)); // Fire and forget the notification function
assert.equal(res.unsafe(), 5);

const res = noneOption.effect((num) => notification(num)); // Does not execute the notification function
assert.equal(res.unsafe(), null);
```

#### EffectNone

Perform side-effects if the option is `None` without changing the option.

```typescript
const res = someOption.effectNone(() => notification()); // Does not execute the notification function
assert.equal(res.unsafe(), 5);

const res = noneOption.effectNone(() => notification()); // Fire and forget the notification function
assert.equal(res.unsafe(), null);
```

#### Inspect

Inspects the `Some` value.

```typescript
const res = someOption.inspect((num) => console.log(num)); // Logs 5
assert.equal(res.unsafe(), 5);

const res = noneOption.inspect((num) => console.log(num)); // Does not log
assert.equal(res.unsafe(), null);
```

#### InspectNone

Inspects if the option is `None`.

```typescript
const res = someOption.inspectNone(() => console.log('No value')); // Does not log
assert.equal(res.unsafe(), 5);

const res = noneOption.inspectNone(() => console.log('No value')); // Logs "No value"
assert.equal(res.unsafe(), null);
```

### Static methods

#### Is

Returns `true` if `input` is an `Option`.

```typescript
const res: boolean = Option.is(someOption);
assert.equal(res, true);
```

#### Some

Returns an `Option` with a `Some` value.

```typescript
const res: Option<number> = Some(5);
assert.equal(res.unsafe(), 5);
```

#### None

Returns an `Option` with a `None` value.

```typescript
const res: Option<number> = None;
assert.equal(res.unsafe(), null);
```

#### Safe

Returns an `Option` with the result of a promise.

```typescript
const res: Option<number> = Option.safe(Promise.resolve(5));
assert.equal(res.unsafe(), 5);

const res: Option<number> = Option.safe(Promise.reject('Error'));
assert.equal(res.unsafe(), null);
```

#### All

Returns an `Option` with an array of `Some` values or the first `None` value.

```typescript
const res: Option<number[]> = Option.all(Some(1), Some(2));
assert.deepEqual(res.unsafe(), [1, 2]);

const res: Option<number[]> = Option.all(Some(1), None);
assert.equal(res.unsafe(), null);
```

#### Any

Returns an `Option` with the first `Some` value or an array of `None` values.

```typescript
const res: Option<number> = Option.any(Some(1), None);
assert.equal(res.unsafe(), 1);

const res: Option<number> = Option.any(None, None);
assert.equal(res.unsafe(), null);
```

#### From

Returns an `Option` with a value.

```typescript
const res: Option<number> = Option.from(5);
assert.equal(res.unsafe(), 5);
```

#### FromNullable

Returns an `Option` with a value if it is not `null`.

```typescript
const res: Option<number> = Option.fromNullable(5);
assert.equal(res.unsafe(), 5);

const res: Option<number> = Option.fromNullable(null);
assert.equal(res.unsafe(), null);
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## License

This project is licensed under the MIT License.

## Special Thanks

Special thanks to my friend [Emric](https://github.com/Istanful) for the name suggestion.
"To remove rust chemically, the workpieces can be pickled."
