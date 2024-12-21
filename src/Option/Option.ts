import { Result } from '../Result';

export type Option<T> = Some<T> | None<T>;

type FalsyValue = false | null | undefined | 0 | 0n | '';

type MaybePromise<T> = T | Promise<T>;

type OptionTypes<R> = {
  [K in keyof R]: R[K] extends Option<infer T> ? T : never;
};

interface IOptionType<Some> {
  /**
   * Returns the contained `Some` or `None` value.
   *
   * ```typescript
   * const x = Option.some('foo').unsafe();
   * assert.equal(x, 'foo');
   * ```
   *
   * ```typescript
   * const x = Option.none.unsafe();
   * assert.equal(x, null);
   * ```
   */
  unsafe<Falsy extends FalsyValue>(fallback: Falsy): Some | Falsy; // Will probably be renamed to `unsafe` in the future

  /**
   * Returns the contained `Some` value or a provided fallback.
   *
   * ```typescript
   * const x = Option.some('foo').someOr('bar');
   * assert.equal(x, 'foo');
   * ```
   *
   * ```typescript
   * const x = Result.none.someOr('bar');
   * assert.equal(x, 'bar');
   * ```
   */
  someOr<T>(fallback: T): Some | T;

  /**
   * Returns null value or a provided fallback.
   *
   * ```typescript
   * const x = Option.some('foo').noneOr('bar');
   * assert.equal(x, 'bar');
   * ```
   *
   * ```typescript
   * const x = Option.none.noneOr('bar');
   * assert.equal(x, null);
   * ```
   */
  noneOr<T>(fallback: T): null | T;

  /**
   * Returns the contained `Some` value or a provided fallback.
   *
   * ```typescript
   * const x = Option.some('foo').someOrElse(() => 'bar');
   * assert.equal(x, 'foo');
   * ```
   *
   * ```typescript
   * const x = Option.none.someOrElse(() => 'bar');
   * assert.equal(x, 'bar');
   * ```
   */
  someOrElse<T>(fn: () => T): Some | T;

  /**
   * Returns the contained `Some` value or a provided fallback.
   *
   * ```typescript
   * const x = Option.some('foo').noneOrElse(() => 'bar');
   * assert.equal(x, 'bar');
   * ```
   *
   * ```typescript
   * const x = Option.none.noneOrElse(() => 'bar');
   * assert.equal(x, null);
   * ```
   */
  noneOrElse<T>(fn: () => T): null | T;

  /**
   * Returns the contained `Some` value or throws an error.
   *
   * ```typescript
   * const x = Option.some('foo').someOrThrow(new Error('no value'));
   * assert.equal(x, 'foo');
   * ```
   *
   * ```typescript
   * Option.none.someOrThrow(new Error('no value')) // throws Error('no value')
   * ```
   */
  someOrThrow(error: unknown): Some;

  /**
   * Returns the contained `Some` value or throws an error.
   *
   * ```typescript
   * Option.none.noneOrThrow(new Error('no value')) // throws Error('no value')
   * ```
   *
   * ```typescript
   * const x = Option.some('foo').noneOrThrow(new Error('no value'));
   * assert.equal(x, 'foo');
   * ```
   */
  noneOrThrow(error: unknown): null;

  /**
   * Returns the contained `Some` value or the provided `Option`.
   *
   * ```typescript
   * const x = Option.none;
   * const y = Option.some('bar');
   * const z = x.or(y).unsafe();
   * assert.equal(z, 'bar');
   *
   * const x = Option.some('foo');
   * const y = Option.none;
   * const z = x.or(y).unsafe();
   * assert.equal(z, 'foo');
   *
   * const x = Option.none;
   * const y = Option.none;
   * const z = x.or(y).unsafe();
   * assert.equal(z, null);
   * ```
   */
  or<OtherSome>(option: Option<OtherSome>): Option<Some | OtherSome>;

  /**
   * Maps a `Option<Some, None>` to `Option<NewSome, None>` by applying a function to a contained `Some` value, leaving an `None` value untouched.
   *
   * ```typescript
   * const x = Option.some('foo').
   *   .map((value) => value + 'bar');
   *   .unsafe();
   * assert.equal(x, 'foobar');
   * ```
   * const x = Option.none
   *   .map((value) => value + 'bar')
   *   .unsafe();
   * assert.equal(x, null);
   * ```
   */
  map<NewSome>(fn: (some: Some) => NewSome): Option<NewSome>;
  map<NewSome>(fn: (some: Some) => Promise<NewSome>): Promise<Option<NewSome>>;

  /**
   * Maps a `Option<Some, None>` to `Option<NewSome, None>` by applying a function to a contained `Some` value, flattening the `None` value.
   *
   * ```typescript
   * const x = Option.some('foo')
   *   .flatMap((value) => Option.some(value + 'bar'))
   *   .unsafe();
   * assert.equal(x, 'foobar');
   * ```
   *
   * ```typescript
   * const x = Option.none
   *   .flatMap((value) => Option.some(value + 'bar'))
   *   .unsafe();
   * assert.equal(x, null);
   * ```
   */
  flatMap<NewSome>(fn: (some: Some) => Option<NewSome>): Option<NewSome>;
  flatMap<NewSome>(
    fn: (some: Some) => Promise<Option<NewSome>>
  ): Promise<Option<NewSome>>;

  /**
   * Returns an `Option` with a `Some` value or an `None` value.
   *
   * ```typescript
   * const x = Option.some('foo')
   *   .filter((value) => value === 'foo')
   *   .unsafe();
   * assert.equal(x, 'foo');
   * ```
   *
   * ```typescript
   * const x = Option.some('foo')
   *   .filter((value) => value === 'bar')
   *   .unsafe();
   * assert.equal(x, null);
   * */
  filter(fn: (some: Some) => boolean): Option<Some>;

  /**
   * Returns an `Result` with a `Some` value or an `Err` value.
   *
   * ```typescript
   * const x = Option.some('foo').toResult('bar');
   * assert.equal(Result.is(x), true);
   * assert.equal(x.unsafe(), 'foo');
   * ```
   *
   * ```typescript
   * const x = Option.none.toResult('bar');
   * assert.equal(Result.is(x), true);
   * assert.equal(x.unsafe(), 'bar');
   * ```
   * */
  toResult<Err>(error: Err): Result<Some, Err>;

  /**
   * Perform side-effects from the `Some` value without changing the option.
   *
   * ```typescript
   * const x = Option.ok('foo');
   * x.effect((value) => notification(value));
   * ```
   */
  effect: (fn: (value: Some) => void) => Option<Some>;

  /**
   * Perform side-effects if the option is `None` without changing the option.
   *
   * ```typescript
   * const x = Option.ok('foo');
   * x.effectNone(() => notification("no value"));
   * ```
   */
  effectNone: (fn: () => void) => Option<Some>;
}

class Some<Some> implements IOptionType<Some> {
  static readonly type = 'Some';
  readonly type = Some.type;
  readonly isSome = true;
  readonly isNone = false;
  constructor(readonly value: Some) {}

  unsafe<Falsy extends FalsyValue>(): Some {
    return this.value;
  }

  someOr<T>(fallback: T): Some | T {
    return this.value;
  }

  noneOr<T>(fallback: T): null | T {
    return fallback;
  }

  someOrElse<T>(fn: () => T): Some | T {
    return this.value;
  }

  noneOrElse<T>(fn: () => T): null | T {
    return fn();
  }

  someOrThrow(error: unknown): Some {
    return this.value;
  }

  noneOrThrow(error: unknown): null {
    throw error;
  }

  or<OtherSome>(option: Option<OtherSome>): Option<Some | OtherSome> {
    return this;
  }

  map<NewSome>(fn: (some: Some) => NewSome): Option<NewSome>;
  map<NewSome>(fn: (some: Some) => Promise<NewSome>): Promise<Option<NewSome>>;
  map<NewSome>(fn: (some: Some) => NewSome): MaybePromise<Option<NewSome>> {
    return new Some(fn(this.value));
  }

  flatMap<NewSome>(fn: (some: Some) => Option<NewSome>): Option<NewSome>;
  flatMap<NewSome>(
    fn: (some: Some) => Promise<Option<NewSome>>
  ): Promise<Option<NewSome>>;
  flatMap<NewSome>(
    fn: (some: Some) => MaybePromise<Option<NewSome>>
  ): MaybePromise<Option<NewSome>> {
    return fn(this.value);
  }

  filter(fn: (some: Some) => boolean): Option<Some> {
    return fn(this.value) ? this : Option.none;
  }

  toResult<Err>(error: Err): Result<Some, Err> {
    return Result.ok(this.value);
  }

  effect(fn: (value: Some) => void): Option<Some> {
    fn(this.value);
    return this;
  }

  effectNone = (): this => {
    return this;
  };
}

class None<Some> implements IOptionType<Some> {
  static readonly type = 'None';
  readonly type = None.type;
  readonly isSome = false;
  readonly isNone = true;
  constructor() {}

  unsafe<T extends FalsyValue>(fallback = null as T): T {
    return fallback;
  }

  someOr<T>(fallback: T): Some | T {
    return fallback;
  }

  noneOr<T>(fallback: T): null | T {
    return null;
  }

  someOrElse<T>(fn: () => T): Some | T {
    return fn();
  }

  noneOrElse<T>(fn: () => T): null | T {
    return null;
  }

  someOrThrow(error: unknown): Some {
    throw error;
  }

  noneOrThrow(error: unknown): null {
    return null;
  }

  or<OtherSome>(option: Option<OtherSome>): Option<Some | OtherSome> {
    return option;
  }

  map<NewSome>(fn: (some: Some) => NewSome): Option<NewSome>;
  map<NewSome>(fn: (some: Some) => Promise<NewSome>): Promise<Option<NewSome>>;
  map<NewSome>(fn: (some: Some) => NewSome): MaybePromise<Option<NewSome>> {
    // @ts-expect-error - no value to map over
    return this;
  }

  flatMap<NewSome>(
    fn: (some: Some) => Promise<Option<NewSome>>
  ): Promise<Option<NewSome>>;
  flatMap<NewSome>(fn: (some: Some) => Option<NewSome>): Option<NewSome>;
  flatMap<NewSome>(
    fn: (some: Some) => MaybePromise<Option<NewSome>>
  ): MaybePromise<Option<NewSome>> {
    // @ts-expect-error - no value to map over
    return this;
  }

  filter(fn: (some: Some) => boolean): Option<Some> {
    return this;
  }

  toResult<Err>(error: Err): Result<Some, Err> {
    return Result.err(error);
  }

  effect(fn: (value: Some) => void): Option<Some> {
    return this;
  }

  effectNone = (fn: () => void): this => {
    fn();
    return this;
  };
}

/**
 * Returns `true` if `input` is an `Option`.
 *
 * ```typescript
 * const x = Option.some("foo");
 * assert.equal(Option.is(x) === true);
 * ```
 *
 * ```typescript
 * const x = Option.none;
 * assert.equal(Option.is(x) === true);
 * ```
 */
function is<Some>(input: unknown): input is Option<Some> {
  return input instanceof Some || input instanceof None;
}

/**
 * Returns an `Option` with an `Some` value.
 *
 * ```typescript
 * const x = Option.some("foo").unsafe();
 * assert.equal(x === "foo");
 * ```
 */
function some<Some>(value: Some): Option<Some> {
  return new Some(value);
}

/**
 * Returns an `Option` with an `None` value.
 *
 * ```typescript
 * const x = Option.none.unsafe();
 * assert.equal(x === null);
 * ```
 */
const none = new None() as Option<never>;

/**
 * Returns an `Option` with the option of a promise.
 *
 * ```typescript
 * const x = Option.safe(Promise.resolve("foo")).unsafe();
 * assert.equal(x === "foo");
 * ```
 *
 * ```typescript
 * const x = Option.safe(Promise.reject(new Error('no value'))).unsafe();
 * assert.equal(x instanceof None);
 * ```
 */
function safe<Some>(fn: () => Promise<Some>): Promise<Option<Some>>;
function safe<Some>(fn: () => Some): Option<Some>;
function safe<Some>(fn: () => MaybePromise<Some>): MaybePromise<Option<Some>> {
  try {
    const result = fn();
    if (result instanceof Promise) {
      return result.then(some).catch(() => none) as Promise<Option<Some>>;
    }

    return some(result);
  } catch (_) {
    return none;
  }
}

/**
 * Returns an `Option` with all `Some` values or the first `None` value.
 *
 * ```typescript
 * const x = Option.some("foo");
 * const y = Option.some("bar");
 * const z = Option.all(x, y).unsafe();
 * assert.deepEqual(z === ["foo", "bar"]);
 * ```
 */
function all<Options extends Option<unknown>[]>(
  ...options: Options
): Option<OptionTypes<Options>> {
  const values = [];
  for (const option of options) {
    if (option.isNone) {
      return option as Option<never>;
    }

    values.push(option.value);
  }

  return Option.some(values) as Option<OptionTypes<Options>>;
}

/**
 * Returns an `Option` with the first `Some` value or all `None` values.
 *
 * ```typescript
 * const x = Option.none;
 * const y = Option.some("bar");
 * const z = Option.any(x, y).unsafe();
 * assert(z === "bar");
 * ```
 */
function any<Options extends Option<unknown>[]>(
  ...options: Options
): Option<OptionTypes<Options>[number]> {
  for (const option of options) {
    if (option.isSome) {
      return option as Option<OptionTypes<Options>[number]>;
    }
  }

  return Option.none as Option<never>;
}

/**
 * Returns an `Option` with a value.
 *
 * ```typescript
 * const x = Option.from("foo");
 * assert(x.isSome === true);
 * ```
 *
 * ```typescript
 * const x = Option.from('');
 * assert(x.isNone === true);
 * ```
 */
function from<T>(value: T): Option<T> {
  return !value ? Option.none : Option.some(value);
}

/**
 * Returns an `Option` with a `Some` value if the value is not `null`.
 *
 * ```typescript
 * const x = Option.fromNullable("foo");
 * assert(x.isSome === true);
 * ```
 *
 * ```typescript
 * const x = Option.fromNullable(null);
 * assert(x.isNone === true);
 * ```
 */
function fromNullable<T>(value: T): Option<T> {
  return value === null ? Option.none : Option.some(value);
}

export const Option = Object.freeze({
  is,
  some,
  none,
  safe,
  all,
  any,
  from,
  fromNullable,
});

export { some, none };
