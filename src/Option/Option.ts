import { Result } from '~/Result';

export type Option<T> = Some<T> | None<T>;

type FalsyValue = false | null | undefined | 0 | 0n | '';

type MaybePromise<T> = T | Promise<T>;

type OptionTypes<R> = {
  [K in keyof R]: R[K] extends Option<infer T> ? T : never;
};

interface OptionType<Some> {
  /**
   * Returns the contained `Some` or `FalsyValue` value.
   *
   * ```typescript
   * const x = Option.some(10);
   * assert.equal(x.raw(), 10);
   *
   * const x = Option.none;
   * assert.equal(x.raw(), null);
   * ```
   */
  raw<T extends FalsyValue>(fallback: T): Some | T;

  /**
   * Returns the contained `Some` value or a provided fallback.
   *
   * ```typescript
   * const x = Option.some(10);
   * assert.equal(x.else(20), 10);
   *
   * const x = Option.none;
   * assert.equal(x.else(20), 20);
   * ```
   */
  else<T>(fallback: T): Some | T;

  /**
   * Returns the contained `Some` value or the provided `Option`.
   *
   * ```typescript
   * const x = Option.none;
   * const y = Option.some(20);
   * const z = x.or(y);
   * assert.equal(z.raw(), 20);
   *
   * const x = Option.some(10);
   * const y = Option.none;
   * const z = x.or(y);
   * assert.equal(z.raw(), 10);
   *
   * const x = Option.none;
   * const y = Option.none;
   * const z = x.or(y);
   * assert.equal(z.raw(), null);
   * ```
   */
  elseMap<T>(fn: () => T): Some | T;

  /**
   * Returns the contained `Some` value or the provided `Option`.
   *
   * ```typescript
   * const x = Option.none;
   * const y = Option.some(20);
   * const z = x.or(y);
   * assert.equal(z.raw(), 20);
   *
   * const x = Option.some(10);
   * const y = Option.none;
   * const z = x.or(y);
   * assert.equal(z.raw(), 10);
   *
   * const x = Option.none;
   * const y = Option.none;
   * const z = x.or(y);
   * assert.equal(z.raw(), null);
   * ```
   */
  or<OtherSome>(option: Option<OtherSome>): Option<Some | OtherSome>;

  /**
   * Maps a `Option<Some, None>` to `Option<NewSome, None>` by applying a function to a contained `Some` value, leaving an `None` value untouched.
   *
   * ```typescript
   * const x = Option.some(10);
   * const y = x.map((value) => value * 2);
   * assert.equal(y.raw(), 20);
   *
   * const x = Option.none;
   * const y = x.map((value) => value * 2);
   * assert.equal(y.raw(), null);
   * ```
   */
  map<NewSome>(fn: (some: Some) => NewSome): Option<NewSome>;
  map<NewSome>(fn: (some: Some) => Promise<NewSome>): Promise<Option<NewSome>>;

  /**
   * Maps a `Option<Some, None>` to `Option<NewSome, None>` by applying a function to a contained `Some` value, flattening the `None` value.
   *
   * ```typescript
   * const x = Option.some(10);
   * const y = x.flatMap((value) => Option.some(2).map((value) => value * 2));
   * assert.equal(y.raw(), 20);
   *
   * const x = Option.none;
   * const y = x.flatMap((value) => Option.some(2).map((value) => value * 2));
   * assert.equal(y.raw(), null);
   * ```
   */
  flatMap<NewSome>(fn: (some: Some) => Option<NewSome>): Option<NewSome>;
  flatMap<NewSome>(
    fn: (some: Some) => Promise<Option<NewSome>>
  ): Promise<Option<NewSome>>;

  /**
   * Returns an `Result` with a `Some` value or an `Err` value.
   *
   * ```typescript
   * const x = Option.some(10);
   * const y = Option.toResult('NaN');
   * assert.equal(Result.is(y), true);
   * assert.equal(y.raw(), 10);
   *
   * const x = Option.none;
   * const y = Option.toResult('NaN');
   * assert.equal(Result.is(y), true);
   * assert.equal(y.raw(), 'NaN');
   * ```
   * */
  toResult<Err>(error: Err): Result<Some, Err>;

  /**
   * Returns an `Result` with a `Some` value or an `Err` value.
   *
   * ```typescript
   * const x = Option.some(10);
   * const y = Option.toResultMap(() => 'NaN');
   * assert.equal(Result.is(y), true);
   * assert.equal(y.raw(), 10);
   *
   * const x = Option.none;
   * const y = Option.toResultMap(() => 'NaN');
   * assert.equal(Result.is(y), true);
   * assert.equal(y.raw(), 'NaN');
   * ```
   * */
  toResultMap<Err>(fn: () => Err): Result<Some, Err>;
}

class Some<Some> implements OptionType<Some> {
  static readonly type = 'Some';
  readonly type = Some.type;
  readonly isSome = true;
  readonly isNone = false;
  constructor(readonly value: Some) {}

  raw<T extends FalsyValue>(fallback = null as T): Some {
    return this.value;
  }

  else<T>(fallback: T): Some {
    return this.value;
  }

  elseMap<T>(fn: () => T): Some {
    return this.value;
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

  toResult<Err>(error: Err): Result<Some, Err> {
    return Result.ok(this.value);
  }

  toResultMap<Err>(fn: () => Err): Result<Some, Err> {
    return Result.ok(this.value);
  }
}

class None<Some> implements OptionType<Some> {
  static readonly type = 'None';
  readonly type = None.type;
  readonly isSome = false;
  readonly isNone = true;
  constructor() {}

  raw<T extends FalsyValue>(fallback = null as T): T {
    return fallback;
  }

  else<Else>(fallback: Else): Else {
    return fallback;
  }

  elseMap<T>(fn: () => T): T {
    return fn();
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

  toResult<Err>(error: Err): Result<Some, Err> {
    return Result.err(error);
  }

  toResultMap<Err>(fn: () => Err): Result<Some, Err> {
    return Result.err(fn());
  }
}

/**
 * Returns `true` if `input` is an `Option`.
 *
 * ```typescript
 * const x = Option.some(10);
 * assert(Option.is(x));
 *
 * const y = Option.none;
 * assert(Option.is(y));
 * ```
 */
function is<Some>(input: unknown): input is Option<Some> {
  return input instanceof Some || input instanceof None;
}

/**
 * Returns an `Option` with an `Some` value.
 *
 * ```typescript
 * const x = Option.some(10);
 * assert(x.raw() === 10);
 * ```
 */
function some<Some>(value: Some): Option<Some> {
  return new Some(value);
}

/**
 * Returns an `Option` with an `None` value.
 *
 * ```typescript
 * const x = Option.none;
 * assert(x.raw() === null);
 * ```
 */
const none = new None() as Option<never>;

/**
 * Returns an `Option` with the option of a promise.
 *
 * ```typescript
 * const x = Option.safe(Promise.resolve(10));
 * assert(x.raw() === 10);
 *
 * const y = Option.safe(Promise.reject(new Error('no value')));
 * assert(y.raw() instanceof None);
 * ```
 */
async function safe<Some>(promise: Promise<Some>): Promise<Option<Some>> {
  return promise.then((value) => Option.some(value)).catch(() => Option.none);
}

/**
 * Returns an `Option` with all `Some` values or the first `None` value.
 *
 * ```typescript
 * const x = Option.some(10);
 * const y = Option.some(20);
 * const z = Option.all(x, y);
 * assert(z.raw() === [10, 20]);
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
 * const y = Option.some(20);
 * const z = Option.any(x, y);
 * assert(z.raw() === 20);
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
 * const x = Option.from(10);
 * assert(x.raw() === 10);
 *
 * const y = Option.from("");
 * assert(y.raw() === null);
 * ```
 */
function from<T>(value: T): Option<T> {
  return !value ? Option.none : Option.some(value);
}

export const Option = {
  is,
  some,
  none,
  safe,
  all,
  any,
  from,
};
