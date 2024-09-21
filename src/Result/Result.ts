export type Result<T, E> = Ok<T, E> | Err<T, E>;

type MaybePromise<T> = T | Promise<T>;

type ResultTypes<R> = {
  [K in keyof R]: R[K] extends Result<infer T, any> ? T : never;
};

type ResultErrors<R> = {
  [K in keyof R]: R[K] extends Result<any, infer U> ? U : never;
};

interface IResult<Ok, Err> {
  /**
   * Returns the contained `Ok` or `Err` value.
   *
   * ```typescript
   * const x = Result.ok(10);
   * assert.equal(x.raw(), 10);
   *
   * const x = Result.err(20);
   * assert.equal(x.raw(), 20);
   * ```
   */
  raw(): Ok | Err;

  /**
   * Converts the `Result` into a tuple.
   *
   * ```typescript
   * const x = Result.ok(10);
   * assert.deepEqual(x.tuple(), [10, null]);
   *
   * const x = Result.err(20);
   * assert.deepEqual(x.tuple(), [null, 20]);
   * ```
   */
  tuple(): [Ok | null, Err | null];

  /**
   * Returns the contained `Ok` value or a provided fallback.
   *
   * ```typescript
   * const x = Result.ok(10);
   * assert.equal(x.else(20), 10);
   *
   * const x = Result.err(10);
   * assert.equal(x.else(20), 20);
   * ```
   */
  else<T>(fallback: T): Ok | T;

  /**
   * Returns the contained `Ok` value or the provided `Result`.
   *
   * ```typescript
   * const x = Result.err(10);
   * const y = Result.ok(20);
   * const z = x.or(y);
   * assert.equal(z.raw(), 20);
   * ```
   */
  or<OtherOk, OtherErr>(
    result: Result<OtherOk, OtherErr>
  ): Result<Ok | OtherOk, OtherErr>;

  /**
   * Maps a `Result<Ok, Err>` to `Result<NewOk, Err>` by applying a function to a contained `Ok` value, leaving an `Err` value untouched.
   *
   * ```typescript
   * const x = Result.ok(10);
   * const y = x.map((value) => value * 2);
   * assert.equal(y.raw(), 20);
   * ```
   */
  map<NewOk>(fn: (ok: Ok) => NewOk): Result<NewOk, Err>;
  map<NewOk>(fn: (ok: Ok) => Promise<NewOk>): Promise<Result<NewOk, Err>>;

  /**
   * Maps a `Result<Ok, Err>` to `Result<NewOk, Err>` by applying a function to a contained `Ok` value, flattening the `Err` value.
   *
   * ```typescript
   * const x = Result.ok(10);
   * const y = x.flatMap((value) => value * 2);
   * assert.equal(y.raw(), 20);
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
   * const x = Result.err(10);
   * const y = x.mapErr((value) => value * 2);
   * assert.equal(y.raw(), 20);
   * ```
   */
  mapErr<NewErr>(fn: (error: Err) => NewErr): Result<Ok, NewErr>;
}

class Ok<Ok, Err> implements IResult<Ok, Err> {
  static readonly type = 'Ok';
  readonly type = Ok.type;
  readonly isOk = true;
  readonly isErr = false;
  constructor(readonly value: Ok) {}

  raw(): Ok {
    return this.value;
  }

  tuple(): [Ok, null] {
    return [this.value, null];
  }

  else<T>(fallback: T): Ok {
    return this.value;
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

  mapErr<NewErr>(fn: (error: Err) => NewErr): Result<Ok, NewErr> {
    // @ts-expect-error - no error to map over
    return this;
  }
}

class Err<Ok, Err> implements IResult<Ok, Err> {
  static readonly type = 'Err';
  readonly type = Err.type;
  readonly isOk = false;
  readonly isErr = true;
  constructor(readonly error: Err) {}

  raw(): Err {
    return this.error;
  }

  tuple(): [null, Err] {
    return [null, this.error];
  }

  else<Else>(fallback: Else): Else {
    return fallback;
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

  mapErr<NewErr>(fn: (value: Err) => NewErr): Result<Ok, NewErr> {
    return new Err(fn(this.error));
  }
}

/**
 * Returns `true` if `input` is a `Result`.
 *
 * ```typescript
 * const x = Result.ok(10);
 * assert(Result.is(x));
 *
 * const y = Result.err(20);
 * assert(Result.is(y));
 * ```
 */
function is<Ok, Err>(input: unknown): input is Result<Ok, Err> {
  return input instanceof Ok || input instanceof Err;
}

/**
 * Returns a `Result` with an `Ok` value.
 *
 * ```typescript
 * const x = Result.ok(10);
 * assert(x.raw() === 10);
 * ```
 */
function ok<Ok>(value: Ok): Result<Ok, never> {
  return new Ok(value);
}

/**
 * Returns a `Result` with an `Err` value.
 *
 * ```typescript
 * const x = Result.err(10);
 * assert(x.raw() === 10);
 * ```
 */
function err<Err>(error: Err): Result<never, Err> {
  return new Err(error);
}

/**
 * Returns a `Result` with the result of a promise.
 *
 * ```typescript
 * const x = Result.safe(Promise.resolve(10));
 * assert(x.raw() === 10);
 *
 * const y = Result.safe(Promise.reject(new Error('error')));
 * assert(y.raw() instanceof Error);
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
 * const x = Result.ok(10);
 * const y = Result.ok(20);
 * const z = Result.all(x, y);
 * assert(z.raw() === [10, 20]);
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
 * const x = Result.err(10);
 * const y = Result.ok(20);
 * const z = Result.any(x, y);
 * assert(z.raw() === 20);
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
 * Returns a `Result` with the result of a promise.
 *
 * ```typescript
 * const x = await Result.async(Promise.resolve(Result.ok(10)));
 * assert(x.raw() === 10);
 * ```
 */
function async<Ok, Err>(result: MaybePromise<Result<Ok, Err>>) {
  const raw = async () => {
    const awaited = await result;
    return awaited.raw();
  };

  const then = async (resolve: (result: Result<Ok, Err>) => void) => {
    resolve(await result);
  };

  const map = <NewOk>(fn: (value: Ok) => MaybePromise<NewOk>) => {
    const nextPromise = async () => {
      const awaited = await result;
      const [promise, error] = awaited.map(async (ok) => fn(ok)).tuple();
      return promise ? Result.ok(await promise) : Result.err(error);
    };

    return async(nextPromise());
  };

  const flatMap = <NewOk, NewErr>(
    fn: (value: Ok) => Promise<Result<NewOk, NewErr>>
  ) => {
    const nextPromise = async () => {
      const awaited = await result;
      return awaited.flatMap(async (ok) => fn(ok));
    };

    return async(nextPromise());
  };

  return {
    raw,
    then,
    map,
    flatMap,
  };
}

export const Result = {
  is,
  ok,
  err,
  safe,
  all,
  any,
  async,
};
