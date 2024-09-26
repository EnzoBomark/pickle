import { Option } from '../Option';

export type Result<T, E> = Ok<T, E> | Err<T, E>;

export type AsyncResult<T, E> = Async<T, E>;

type MaybePromise<T> = T | Promise<T>;

type ResultTypes<R> = {
  [K in keyof R]: R[K] extends Result<infer T, any> ? T : never;
};

type ResultErrors<R> = {
  [K in keyof R]: R[K] extends Result<any, infer U> ? U : never;
};

interface IResultType<Ok, Err> {
  /**
   * Returns the contained `Ok` or `Err` value.
   *
   * ```typescript
   * const x = Result.ok("foo").rawdog();
   * assert.equal(x, "foo");
   * ```
   *
   * ```typescript
   * const x = Result.err("foo").rawdog();
   * assert.equal(x, "foo");
   * ```
   */
  rawdog(): Ok | Err;

  /**
   * Returns the contained `Ok` value or a provided fallback.
   *
   * ```typescript
   * const x = Result.ok("foo").okOr("bar");
   * assert.equal(x, "foo");
   * ```
   *
   * ```typescript
   * const x = Result.err("foo").okOr("bar");
   * assert.equal(x, "bar");
   * ```
   */
  okOr<T>(fallback: T): Ok | T;

  /**
   * Returns the contained `Ok` value or a provided fallback.
   *
   * ```typescript
   * const x = Result.ok("foo").errorOr("bar");
   * assert.equal(x, "bar");
   * ```
   *
   * ```typescript
   * const x = Result.err("foo").errorOr("bar");
   * assert.equal(x, "foo");
   * ```
   */
  errorOr<T>(fallback: T): Err | T;

  /**
   * Returns the contained `Ok` value or a provided fallback.
   *
   * ```typescript
   * const x = Result.ok("foo").okOrElse(() => "bar");
   * assert.equal(x, "foo");
   * ```
   *
   * ```typescript
   * const x = Result.err("foo").okOrElse(() => "bar");
   * assert.equal(x, "bar");
   * ```
   */
  okOrElse<T>(fn: () => T): Ok | T;

  /**
   * Returns the contained `Err` value or a provided fallback.
   *
   * ```typescript
   * const x = Result.err("foo").errorOrElse(() => "bar");
   * assert.equal(x, "foo");
   * ```
   *
   * ```typescript
   * const x = Result.ok("foo").errorOrElse(() => "bar");
   * assert.equal(x, "bar");
   * ```
   */
  errorOrElse<T>(fn: () => T): Err | T;

  /**
   * Returns the contained `Ok` value or a provided fallback.
   *
   * ```typescript
   * const x = Result.ok("foo").okOrThrow((err) => new Error(err));
   * assert.equal(x, "foo");
   * ```
   *
   * ```typescript
   * const x = Result.err("foo").okOrThrow((err) => new Error(err)); // throws "foo"
   * ```
   */
  okOrThrow(fn: (error: Err) => Error): Ok;

  /**
   * Returns the contained `Ok` value or a provided fallback.
   *
   * ```typescript
   * const x = Result.ok("foo")x.errorOrThrow((ok) => new Error(ok)); // throws "foo"
   * ```
   *
   * ```typescript
   * const x = Result.err("foo").errorOrThrow((ok) => new Error(ok))
   * assert.equal(x, "foo");
   * ```
   */
  errorOrThrow(fn: (value: Ok) => Error): Err;

  /**
   * Converts the `Result` into a tuple.
   *
   * ```typescript
   * const x = Result.ok("foo").tuple();
   * assert.deepEqual(x, ["foo", null]);
   * ```
   *
   * ```typescript
   * const x = Result.err("foo").tuple();
   * assert.deepEqual(x, [null, "foo"]);
   * ```
   */
  tuple(): [Ok | null, Err | null];

  /**
   * Returns the contained `Ok` value or the provided `Result`.
   *
   * ```typescript
   * const x = Result.err("foo");
   * const y = Result.ok("bar");
   * const z = x.or(y).rawdog();
   * assert.equal(z, "bar");
   * ```
   *
   * ```typescript
   * const x = Result.ok("foo");
   * const y = Result.err("bar");
   * const z = x.or(y).rawdog();
   * assert.equal(z, "foo");
   * ```
   *
   * ```typescript
   * const x = Result.err("foo");
   * const y = Result.err("bar");
   * const z = x.or(y).rawdog();
   * assert.equal(z, "bar");
   * ```
   */
  or<OtherOk, OtherErr>(
    result: Result<OtherOk, OtherErr>
  ): Result<Ok | OtherOk, OtherErr>;

  /**
   * Maps a `Result<Ok, Err>` to `Result<NewOk, Err>` by applying a function to a contained `Ok` value, leaving an `Err` value untouched.
   *
   * ```typescript
   * const x = Result.ok("foo")
   *   .map((value) => value + "bar")
   *   .rawdog();
   * assert.equal(x, "foobar");
   * ```
   *
   * ```typescript
   * const x = Result.err("foo")
   *   .map((value) => value + "bar")
   *   .rawdog();
   * assert.equal(x, "foo");
   * ```
   */
  map<NewOk>(fn: (ok: Ok) => NewOk): Result<NewOk, Err>;
  map<NewOk>(fn: (ok: Ok) => Promise<NewOk>): Promise<Result<NewOk, Err>>;

  /**
   * Maps a `Result<Ok, Err>` to `Result<NewOk, Err>` by applying a function to a contained `Ok` value, flattening the `Err` value.
   *
   * ```typescript
   * const x = Result.ok("foo")
   *   .flatMap((value) => Result.ok(value + "bar"))
   *   .rawdog();
   * assert.equal(x, "foobar");
   * ```
   *
   * ```typescript
   * const x = Result.err("foo")
   *  .flatMap((value) => Result.ok(value + "bar")
   *  .rawdog();
   * assert.equal(x, "foo");
   * ```
   */
  flatMap<NewOk, NewErr>(
    fn: (ok: Ok) => Result<NewOk, NewErr>
  ): Result<NewOk, Err | NewErr>;
  flatMap<NewOk, NewErr>(
    fn: (ok: Ok) => Promise<Result<NewOk, NewErr>>
  ): Promise<Result<NewOk, Err | NewErr>>;

  /**
   * Maps a `Result<Ok, Err>` to `Result<Ok, NewErr>` by applying a function to a contained `Err` value, leaving an `Ok` value untouched.
   *
   * ```typescript
   * const x = Result.err("foo")
   *   .mapErr((value) => value + "bar")
   *   .rawdog();
   * assert.equal(x, "foobar");
   * ```
   *
   * ```typescript
   * const x = Result.ok("foo")
   *   .mapErr((value) => value + "bar")
   *   .rawdog();
   * assert.equal(x, "foo");
   * ```
   */
  mapErr<NewErr>(fn: (error: Err) => NewErr): Result<Ok, NewErr>;
  mapErr<NewErr>(
    fn: (error: Err) => Promise<NewErr>
  ): Promise<Result<Ok, NewErr>>;

  /**
   * Maps a `Result<Ok, Err>` to `Result<Ok, NewErr>` by applying a function to a contained `Err` value, flattening the `Ok` value.
   *
   * ```typescript
   * const x = Result.err("foo")
   *   .flatMapErr((value) => Result.err(value + "bar"))
   *   .rawdog();
   * assert.equal(x, "foobar");
   * ```
   *
   * ```typescript
   * const x = Result.ok("foo")
   *   .flatMapErr((value) => Result.err(value + "bar"))
   *   .rawdog();
   * assert.equal(x, "foo");
   * ```
   */
  flatMapErr<NewOk, NewErr>(
    fn: (error: Err) => Result<NewOk, NewErr>
  ): Result<Ok | NewOk, NewErr>;
  flatMapErr<NewOk, NewErr>(
    fn: (error: Err) => Promise<Result<NewOk, NewErr>>
  ): Promise<Result<Ok | NewOk, NewErr>>;

  /**
   * Converts the `Result` into an `Option`.
   *
   * ```typescript
   * const x = Result.ok("foo")
   *   .toOption();
   * assert.equal(x.isSome, true);
   * ```
   *
   * ```typescript
   * const x = Result.err("foo")
   *   .toOption();
   * assert.equal(x.isNone, true);
   */
  toOption(): Option<Ok>;

  /**
   * Inspects the `Ok` value.
   *
   * ```typescript
   * const x = Result.ok("foo");
   * x.inspect((value) => console.log(value)); // logs "foo"
   * ```
   */
  inspect: (fn: (value: Ok) => void) => Result<Ok, Err>;

  /**
   * Inspects the `Err` value.
   *
   * ```typescript
   * const x = Result.err("foo");
   * x.inspectErr((error) => console.error(error)); // logs "foo"
   * ```
   */
  inspectErr: (fn: (error: Err) => void) => Result<Ok, Err>;
}

class Ok<Ok, Err> implements IResultType<Ok, Err> {
  static readonly type = 'Ok';
  readonly type = Ok.type;
  readonly isOk = true;
  readonly isErr = false;
  constructor(readonly value: Ok) {}

  rawdog(): Ok {
    return this.value;
  }

  okOr<T>(fallback: T): Ok | T {
    return this.value;
  }

  errorOr<T>(fallback: T): Err | T {
    return fallback;
  }

  okOrElse<T>(fn: () => T): Ok | T {
    return this.value;
  }

  errorOrElse<T>(fn: () => T): Err | T {
    return fn();
  }

  okOrThrow(fn: (error: Err) => Error): Ok {
    return this.value;
  }

  errorOrThrow(fn: (value: Ok) => Error): Err {
    throw fn(this.value);
  }

  tuple(): [Ok, null] {
    return [this.value, null];
  }

  or<OtherOk, OtherErr>(
    result: Result<OtherOk, OtherErr>
  ): Result<Ok | OtherOk, OtherErr> {
    // @ts-expect-error - this result error will never happen
    return this;
  }

  map<NewOk>(fn: (ok: Ok) => NewOk): Result<NewOk, Err>;
  map<NewOk>(fn: (ok: Ok) => Promise<NewOk>): Promise<Result<NewOk, Err>>;
  map<NewOk>(fn: (ok: Ok) => NewOk): MaybePromise<Result<NewOk, Err>> {
    return new Ok(fn(this.value));
  }

  flatMap<NewOk, NewErr>(
    fn: (ok: Ok) => Result<NewOk, NewErr>
  ): Result<NewOk, Err | NewErr>;
  flatMap<NewOk, NewErr>(
    fn: (ok: Ok) => Promise<Result<NewOk, NewErr>>
  ): Promise<Result<NewOk, Err | NewErr>>;
  flatMap<NewOk, NewErr>(
    fn: (ok: Ok) => MaybePromise<Result<NewOk, NewErr>>
  ): MaybePromise<Result<NewOk, Err | NewErr>> {
    return fn(this.value);
  }

  mapErr<NewErr>(fn: (value: Err) => NewErr): Result<Ok, NewErr>;
  mapErr<NewErr>(
    fn: (value: Err) => Promise<NewErr>
  ): Promise<Result<Ok, NewErr>>;
  mapErr<NewErr>(fn: (value: Err) => NewErr): MaybePromise<Result<Ok, NewErr>> {
    // @ts-expect-error - no error to map over
    return this;
  }

  flatMapErr<NewOk, NewErr>(
    fn: (error: Err) => Result<NewOk, NewErr>
  ): Result<Ok | NewOk, NewErr>;
  flatMapErr<NewOk, NewErr>(
    fn: (error: Err) => Promise<Result<NewOk, NewErr>>
  ): Promise<Result<Ok | NewOk, NewErr>>;
  flatMapErr<NewOk, NewErr>(
    fn: (error: Err) => MaybePromise<Result<NewOk, NewErr>>
  ): MaybePromise<Result<Ok | NewOk, NewErr>> {
    // @ts-expect-error - no error to map over
    return this;
  }

  toOption(): Option<Ok> {
    return Option.some(this.value);
  }

  inspect = (fn: (value: Ok) => void): this => {
    fn(this.value);
    return this;
  };

  inspectErr = (): this => {
    return this;
  };
}

class Err<Ok, Err> implements IResultType<Ok, Err> {
  static readonly type = 'Err';
  readonly type = Err.type;
  readonly isOk = false;
  readonly isErr = true;
  constructor(readonly error: Err) {}

  rawdog(): Err {
    return this.error;
  }

  okOr<T>(fallback: T): Ok | T {
    return fallback;
  }

  errorOr<T>(fallback: T): Err | T {
    return this.error;
  }

  okOrElse<T>(fn: () => T): Ok | T {
    return fn();
  }

  errorOrElse<T>(fn: () => T): Err | T {
    return this.error;
  }

  okOrThrow(fn: (error: Err) => Error): Ok {
    throw fn(this.error);
  }

  errorOrThrow(fn: (value: Ok) => Error): Err {
    return this.error;
  }

  tuple(): [null, Err] {
    return [null, this.error];
  }

  or<OtherOk, OtherErr>(
    result: Result<OtherOk, OtherErr>
  ): Result<Ok | OtherOk, OtherErr> {
    return result;
  }

  map<NewOk>(fn: (ok: Ok) => NewOk): Result<NewOk, Err>;
  map<NewOk>(fn: (ok: Ok) => Promise<NewOk>): Promise<Result<NewOk, Err>>;
  map<NewOk>(fn: (ok: Ok) => NewOk): MaybePromise<Result<NewOk, Err>> {
    // @ts-expect-error - no value to map over
    return this;
  }

  flatMap<NewOk, NewErr>(
    fn: (ok: Ok) => Promise<Result<NewOk, NewErr>>
  ): Promise<Result<NewOk, Err | NewErr>>;
  flatMap<NewOk, NewErr>(
    fn: (ok: Ok) => Result<NewOk, NewErr>
  ): Result<NewOk, Err | NewErr>;
  flatMap<NewOk, NewErr>(
    fn: (ok: Ok) => MaybePromise<Result<NewOk, NewErr>>
  ): MaybePromise<Result<NewOk, Err | NewErr>> {
    // @ts-expect-error - no value to map over
    return this;
  }

  mapErr<NewErr>(fn: (value: Err) => NewErr): Result<Ok, NewErr>;
  mapErr<NewErr>(
    fn: (value: Err) => Promise<NewErr>
  ): Promise<Result<Ok, NewErr>>;
  mapErr<NewErr>(fn: (value: Err) => NewErr): MaybePromise<Result<Ok, NewErr>> {
    return new Err(fn(this.error));
  }

  flatMapErr<NewOk, NewErr>(
    fn: (error: Err) => Result<NewOk, NewErr>
  ): Result<Ok | NewOk, NewErr>;
  flatMapErr<NewOk, NewErr>(
    fn: (error: Err) => Promise<Result<NewOk, NewErr>>
  ): Promise<Result<Ok | NewOk, NewErr>>;
  flatMapErr<NewOk, NewErr>(
    fn: (error: Err) => MaybePromise<Result<NewOk, NewErr>>
  ): MaybePromise<Result<Ok | NewOk, NewErr>> {
    return fn(this.error);
  }

  toOption(): Option<Ok> {
    return Option.none;
  }

  inspect = (): this => {
    return this;
  };

  inspectErr = (fn: (error: Err) => void): this => {
    fn(this.error);
    return this;
  };
}

interface IAsyncResultType<Ok, Err> {
  /**
   * Returns the awaited `Result`.
   *
   * ```typescript
   * Result.async(Promise.resolve(Result.ok("foo"))
   *   .then((result) => assert(Result.is(x) === true));
   * ```
   */
  then: (resolve: (result: Result<Ok, Err>) => void) => void;

  /**
   * Returns the contained `Ok` or `Err` value.
   *
   * ```typescript
   * Result.async(Promise.resolve(Result.ok("foo"))
   *   .rawdog()
   *   .then((x) => assert(x === "foo"))
   * ```
   *
   * ```typescript
   * Result.async(Promise.resolve(Result.err("bar"))
   *   .rawdog()
   *   .then((x) => assert(x === "bar"))
   * ```
   */
  rawdog: () => Promise<Ok | Err>;

  /**
   * Returns the contained `Ok` value or the provided fallback.
   *
   * ```typescript
   * Result.async(Promise.resolve(Result.ok("foo"))
   *   .okOr("bar")
   *   .then((x) => assert(x === "foo"));
   * ```
   *
   * ```typescript
   * Result.async(Promise.resolve(Result.err("foo"))
   *   .okOr("bar")
   *   .then((x) => assert(x === "bar"));
   * ```
   */
  okOr: <T>(fallback: T) => Promise<Ok | T>;

  /**
   * Returns the contained `Err` value or the provided fallback.
   *
   * ```typescript
   * Result.async(Promise.resolve(Result.err("foo"))
   *   .errorOr("bar")
   *   .then((x) => assert(x === "foo"));
   * ```
   *
   * ```typescript
   * Result.async(Promise.resolve(Result.ok("foo"))
   *   .errorOr("bar")
   *   .then((x) => assert(x === "bar"));
   * ```
   */
  errorOr: <T>(fallback: T) => Promise<Err | T>;

  /**
   * Returns the contained `Ok` value or a provided fallback.
   *
   * ```typescript
   * Result.async(Promise.resolve(Result.ok("foo"))
   *   .okOrElse(() => "bar")
   *   .then((x) => assert(x === "foo"));
   * ```
   *
   * ```typescript
   * Result.async(Promise.resolve(Result.err("foo"))
   *   .okOrElse(() => "bar")
   *   .then((x) => assert(x === "bar"));
   * ```
   */
  okOrElse: <T>(fn: () => T) => Promise<Ok | T>;

  /**
   * Returns the contained `Err` value or a provided fallback.
   *
   * ```typescript
   * Result.async(Promise.resolve(Result.err("foo"))
   *   .errorOrElse(() => "bar")
   *   .then((x) => assert(x === "foo"));
   * ```
   *
   * ```typescript
   * Result.async(Promise.resolve(Result.ok("foo"))
   *   .errorOrElse(() => "bar")
   *   .then((x) => assert(x === "bar"));
   * ```
   */
  errorOrElse: <T>(fn: () => T) => Promise<Err | T>;

  /**
   * Returns the contained `Ok` or throws the provided error.
   *
   * ```typescript
   * Result.async(Promise.resolve(Result.ok("foo"))
   *   .okOrThrow(() => new Error("bar"))
   *   .then((x) => assert(x === "foo"));
   * ```
   *
   * ```typescript
   * Result.async(Promise.resolve(Result.err("foo"))
   *   .okOrThrow(() => new Error("bar"))
   *   .catch((x) => assert(x.message === "bar"));
   * ```
   */
  okOrThrow: (fn: (error: Err) => Error) => Promise<Ok>;

  /**
   * Returns the contained `Err` or throws the provided error.
   *
   * ```typescript
   * Result.async(Promise.resolve(Result.err("foo"))
   *   .errorOrThrow(() => new Error("bar"))
   *   .then((x) => assert(x === "foo"));
   * ```
   *
   * ```typescript
   * Result.async(Promise.resolve(Result.ok("foo"))
   *   .errorOrThrow(() => new Error("bar"))
   *   .catch((x) => assert(x.message === "bar"));
   * ```
   */
  errorOrThrow: (fn: (value: Ok) => Error) => Promise<Err>;

  /**
   * Converts the `Result` into a tuple.
   *
   * ```typescript
   * Result.async(Promise.resolve(Result.ok(10))
   *   .tuple()
   *   .then((x) => assert.deepEqual(x, [10, null]));
   * ```
   *
   * ```typescript
   * Result.async(Promise.resolve(Result.err("foo"))
   *   .tuple()
   *   .then((x) => assert.deepEqual(x, [null, "foo"]));
   * ```
   */
  tuple: () => Promise<[Ok | null, Err | null]>;

  /**
   * Maps a `Promise<Result<Ok, Err>>` to `Promise<Result<NewOk, Err>>` by applying a function to a contained `Ok` value, leaving an `Err` value untouched.
   *
   * ```typescript
   * Result.async(Promise.resolve(Result.ok("foo")))
   *   .map((value) => value + "bar")
   *   .map((value) => `value: ${value}`)
   *   .then((x) => assert(x.rawdog() === "value: foobar"));
   * ```
   *
   * ```typescript
   * Result.async(Promise.resolve(Result.err("foo")))
   *   .map((value) => value + "bar")
   *   .map((value) => `value: ${value}`)
   *   .then((x) => assert(x.rawdog() === "foo"));
   * ```
   */
  map: <NewOk>(
    fn: (value: Ok) => MaybePromise<NewOk>
  ) => AsyncResult<NewOk, Err>;

  /**
   * Maps a `Promise<Result<Ok, Err>>` to `Promise<Result<NewOk, Err>>` by applying a function to a contained `Ok` value, flattening the `Err` value.
   *
   * ```typescript
   * Result.async(Promise.resolve(Result.ok("foo")))
   *   .flatMap((value) => Promise.resolve(Result.ok(value + "bar")))
   *   .flatMap((value) => Promise.resolve(Result.ok(`value: ${value}`))
   *   .then((x) => assert(x.rawdog() === "value: foobar"));
   * ```
   *
   * ```typescript
   * Result.async(Promise.resolve(Result.err("foo")))
   *   .flatMap((value) => Promise.resolve(Result.ok(value + "bar")))
   *   .flatMap((value) => Promise.resolve(Result.ok(`value: ${value}`))
   *   .then((x) => assert(x.rawdog() === "foo"));
   * ```
   */
  flatMap: <NewOk, NewErr>(
    fn: (value: Ok) => MaybePromise<Result<NewOk, NewErr>>
  ) => AsyncResult<NewOk, Err | NewErr>;

  /**
   * Maps a `Promise<Result<Ok, Err>>` to `Promise<Result<Ok, NewErr>>` by applying a function to a contained `Err` value, leaving an `Ok` value untouched.
   *
   * ```typescript
   * Result.async(Promise.resolve(Result.err("foo")))
   *   .mapErr((value) => value + "bar")
   *   .mapErr((value) => `value: ${value}`)
   *   .then((x) => assert(x.rawdog() === "value: foobar"));
   * ```
   *
   * ```typescript
   * Result.async(Promise.resolve(Result.ok("foo")))
   *   .mapErr((value) => value + "bar")
   *   .mapErr((value) => `value: ${value}`)
   *   .then((x) => assert(x.rawdog() === "foo"));
   * ```
   */
  mapErr: <NewErr>(
    fn: (error: Err) => MaybePromise<NewErr>
  ) => AsyncResult<Ok, NewErr>;

  /**
   * Maps a `Promise<Result<Ok, Err>>` to `Promise<Result<Ok, NewErr>>` by applying a function to a contained `Err` value, flattening the `Ok` value.
   *
   * ```typescript
   * Result.async(Promise.resolve(Result.err("foo")))
   *   .flatMapErr((value) => Promise.resolve(Result.err(value + "bar")))
   *   .flatMapErr((value) => Promise.resolve(Result.err(`value: ${value}`))
   *   .then((x) => assert(x.rawdog() === "value: foobar"));
   * ```
   *
   * ```typescript
   * Result.async(Promise.resolve(Result.ok("foo")))
   *   .flatMapErr((value) => Promise.resolve(Result.err(value + "bar")))
   *   .flatMapErr((value) => Promise.resolve(Result.err(`value: ${value}`))
   *   .then((x) => assert(x.rawdog() === "foo"));
   * ```
   */
  flatMapErr: <NewOk, NewErr>(
    fn: (error: Err) => MaybePromise<Result<NewOk, NewErr>>
  ) => AsyncResult<Ok | NewOk, NewErr>;

  /**
   * Converts the `Promise<Result<Ok, Err>>` into an `Option`.
   *
   * ```typescript
   * Result.async(Promise.resolve(Result.ok("foo"))
   *   .toOption()
   *   .then((x) => assert(x.isSome === true));
   * ```
   *
   * ```typescript
   * Result.async(Promise.resolve(Result.err("foo"))
   *   .toOption()
   *   .then((x) => assert(x.isNone === true));
   * ```
   */
  toOption: () => Promise<Option<Ok>>;

  /**
   * Inspects the `Ok` value.
   *
   * ```typescript
   * Result.async(Promise.resolve(Result.ok("foo"))
   *   .inspect((value) => console.log(value))
   *   .then((x) => assert(x.rawdog() === "foo"));
   * ```
   */
  inspect: (fn: (value: Ok) => void) => AsyncResult<Ok, Err>;

  /**
   * Inspects the `Err` value.
   *
   * ```typescript
   * Result.async(Promise.resolve(Result.err("foo"))
   *   .inspectErr((error) => console.error(error))
   *   .then((x) => assert(x.rawdog() === "foo"));
   * ```
   */
  inspectErr: (fn: (error: Err) => void) => AsyncResult<Ok, Err>;
}

class Async<Ok, Err> implements IAsyncResultType<Ok, Err> {
  constructor(private result: MaybePromise<Result<Ok, Err>>) {}

  async then(resolve: (result: Result<Ok, Err>) => void) {
    resolve(await this.result);
  }

  async rawdog() {
    const awaited = await this.result;
    return awaited.rawdog();
  }

  async okOr<T>(fallback: T) {
    const awaited = await this.result;
    return awaited.okOr(fallback);
  }

  async errorOr<T>(fallback: T) {
    const awaited = await this.result;
    return awaited.errorOr(fallback);
  }

  async okOrElse<T>(fn: () => T) {
    const awaited = await this.result;
    return awaited.okOrElse(fn);
  }

  async errorOrElse<T>(fn: () => T) {
    const awaited = await this.result;
    return awaited.errorOrElse(fn);
  }

  async okOrThrow(fn: (error: Err) => Error) {
    const awaited = await this.result;
    return awaited.okOrThrow(fn);
  }

  async errorOrThrow(fn: (value: Ok) => Error) {
    const awaited = await this.result;
    return awaited.errorOrThrow(fn);
  }

  async tuple() {
    const awaited = await this.result;
    return awaited.tuple();
  }

  map<NewOk>(fn: (value: Ok) => MaybePromise<NewOk>) {
    const nextPromise = async () => {
      const awaited = await this.result;
      const [promise, error] = awaited.map(async (ok) => fn(ok)).tuple();
      return promise ? Result.ok(await promise) : Result.err(error);
    };

    return Result.async(nextPromise());
  }

  flatMap<NewOk, NewErr>(
    fn: (value: Ok) => MaybePromise<Result<NewOk, NewErr>>
  ) {
    const nextPromise = async () => {
      const awaited = await this.result;
      return awaited.flatMap(async (ok) => fn(ok));
    };

    return Result.async(nextPromise());
  }

  mapErr<NewErr>(fn: (error: Err) => MaybePromise<NewErr>) {
    const nextPromise = async () => {
      const awaited = await this.result;
      const [ok, promise] = awaited.mapErr(async (err) => fn(err)).tuple();
      return promise ? Result.err(await promise) : Result.ok(ok);
    };

    return Result.async(nextPromise());
  }

  flatMapErr<NewOk, NewErr>(
    fn: (error: Err) => MaybePromise<Result<NewOk, NewErr>>
  ) {
    const nextPromise = async () => {
      const awaited = await this.result;
      return awaited.flatMapErr(async (err) => fn(err));
    };

    return Result.async(nextPromise());
  }

  async toOption() {
    const awaited = await this.result;
    return awaited.toOption();
  }

  inspect(fn: (value: Ok) => void) {
    Promise.resolve(this.result).then((awaited) => awaited.inspect(fn));
    return this;
  }

  inspectErr(fn: (error: Err) => void) {
    Promise.resolve(this.result).then((awaited) => awaited.inspectErr(fn));
    return this;
  }
}

/**
 * Returns `true` if `input` is a `Result`.
 *
 * ```typescript
 * const x = Result.ok("foo");
 * assert(Result.is(x) === true);
 * ```
 *
 * ```typescript
 * const x = Result.err("bar");
 * assert(Result.is(x) === true);
 * ```
 */
function is<Ok, Err>(input: unknown): input is Result<Ok, Err> {
  return input instanceof Ok || input instanceof Err;
}

/**
 * Returns a `Result` with an `Ok` value.
 *
 * ```typescript
 * const x = Result.ok("foo");
 * assert(x.rawdog() === "foo");
 * ```
 *
 * ```typescript
 * const x = Result.ok();
 * assert(x.rawdog() === null);
 * ```
 */
function ok(): Result<null, never>;
function ok<Ok>(value: Ok): Result<Ok, never>;
function ok<Ok>(value?: Ok): Result<Ok | null, never> {
  return new Ok(value ?? null);
}

/**
 * Returns a `Result` with an `Err` value.
 *
 * ```typescript
 * const x = Result.err("foo");
 * assert(x.rawdog() === "foo");
 * ```
 */
function err<Err>(error: Err): Result<never, Err> {
  return new Err(error);
}

/**
 * Returns a `Result` with the result of a promise.
 *
 * ```typescript
 * const x = Result.safe(Promise.resolve("foo"));
 * assert(x.rawdog() === 10);
 * ```
 *
 * ```typescript
 * const x = Result.safe(Promise.reject(new Error('bar')));
 * assert(x.rawdog() instanceof Error);
 * ```
 */
async function safe<Ok>(promise: Promise<Ok>): Promise<Result<Ok, Error>> {
  return promise
    .then((value) => Result.ok(value))
    .catch((error) =>
      error instanceof Error
        ? Result.err(error)
        : Result.err(new Error('unexpected error'))
    );
}

/**
 * Returns a `Result` with all `Ok` values or the first `Err` value.
 *
 * ```typescript
 * const x = Result.ok("foo");
 * const y = Result.ok("bar");
 * const z = Result.all(x, y);
 * assert(z.rawdog() === ["foo", "bar"]);
 * ```
 *
 * ```typescript
 * const x = Result.ok("foo");
 * const y = Result.err("bar");
 * const z = Result.all(x, y);
 * assert(z.rawdog() === "bar");
 * ```
 */
function all<Results extends Result<unknown, unknown>[]>(
  ...results: Results
): Result<ResultTypes<Results>, ResultErrors<Results>[number]> {
  const values = [];
  for (const result of results) {
    if (result.isErr) {
      return result as Result<never, ResultErrors<Results>[number]>;
    }

    values.push(result.value);
  }

  return Result.ok(values) as Result<ResultTypes<Results>, never>;
}

/**
 * Returns a `Result` with the first `Ok` value or all `Err` values.
 *
 * ```typescript
 * const x = Result.ok("foo");
 * const y = Result.ok("bar");
 * const z = Result.any(x, y);
 * assert(z.rawdog() === "foo");
 * ```
 *
 * ```typescript
 * const x = Result.err("foo");
 * const y = Result.ok("bar");
 * const z = Result.any(x, y);
 * assert(z.rawdog() === "bar");
 * ```
 *
 * ```typescript
 * const x = Result.err("foo");
 * const y = Result.err("bar");
 * const z = Result.any(x, y);
 * assert(z.rawdog() === ["foo", "bar"]);
 * ```
 */
function any<Results extends Result<unknown, unknown>[]>(
  ...results: Results
): Result<ResultTypes<Results>[number], ResultErrors<Results>> {
  const errors = [];
  for (const result of results) {
    if (result.isOk) {
      return result as Result<ResultTypes<Results>[number], never>;
    }

    errors.push(result.error);
  }

  return Result.err(errors) as Result<never, ResultErrors<Results>>;
}

/**
 * Returns `AsyncResult`
 */
function async<Ok, Err>(
  result: MaybePromise<Result<Ok, Err>>
): AsyncResult<Ok, Err> {
  return new Async(result);
}

export const Result = Object.freeze({
  is,
  ok,
  err,
  safe,
  all,
  any,
  async,
});
