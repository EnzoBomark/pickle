export type Result<A, E> = Ok<A, E> | Err<A, E>;

type MaybePromise<T> = T | Promise<T>;

type ResultTypes<R> = {
  [K in keyof R]: R[K] extends Result<infer T, any> ? T : never;
};

type ResultErrors<R> = {
  [K in keyof R]: R[K] extends Result<any, infer U> ? U : never;
};

class Ok<TOk, TErr> {
  static readonly type = 'Ok';
  readonly type = Ok.type;
  readonly isOk = true;
  readonly isErr = false;
  constructor(readonly value: TOk) {}

  raw(): TOk {
    return this.value;
  }

  tuple(): [TOk, null] {
    return [this.value, null];
  }

  else<TElse>(fallback: TElse): TOk {
    return this.value;
  }

  or<TOtherOk, TOtherErr>(
    fallback: Result<TOtherOk, TOtherErr>
  ): Result<TOk | TOtherOk, TOtherErr> {
    // @ts-expect-error - this result error will never happen
    return this;
  }

  map<TNewOk>(callback: (value: TOk) => TNewOk): Result<TNewOk, TErr>;
  map<TNewOk>(
    callback: (value: TOk) => Promise<TNewOk>
  ): Promise<Result<TNewOk, TErr>>;
  map<TNewOk>(
    callback: (value: TOk) => TNewOk
  ): MaybePromise<Result<TNewOk, TErr>> {
    return new Ok(callback(this.value));
  }

  flatMap<TNewOk, TNewErr>(
    callback: (value: TOk) => Result<TNewOk, TNewErr>
  ): Result<TNewOk, TErr | TNewErr>;
  flatMap<TNewOk, TNewErr>(
    callback: (value: TOk) => Promise<Result<TNewOk, TNewErr>>
  ): Promise<Result<TNewOk, TErr | TNewErr>>;
  flatMap<TNewOk, TNewErr>(
    callback: (value: TOk) => MaybePromise<Result<TNewOk, TNewErr>>
  ): MaybePromise<Result<TNewOk, TErr | TNewErr>> {
    return callback(this.value);
  }

  mapErr<TNewErr>(callback: (error: TErr) => TNewErr): Result<TOk, TNewErr> {
    // @ts-expect-error - no error to map over
    return this;
  }

  async mapAsync<TNewOk>(
    callback: (value: TOk) => Promise<TNewOk>
  ): Promise<Result<TNewOk, TErr>> {
    return new Ok(await callback(this.value));
  }
}

class Err<TOk, TErr> {
  static readonly type = 'Err';
  readonly type = Err.type;
  readonly isOk = false;
  readonly isErr = true;
  constructor(readonly error: TErr) {}

  raw(): TErr {
    return this.error;
  }

  tuple(): [null, TErr] {
    return [null, this.error];
  }

  else<TElse>(fallback: TElse): TElse {
    return fallback;
  }

  or<TOtherOk, TOtherErr>(
    fallback: Result<TOtherOk, TOtherErr>
  ): Result<TOk | TOtherOk, TOtherErr> {
    return fallback;
  }

  map<TNewOk>(callback: (value: TOk) => TNewOk): Result<TNewOk, TErr>;
  map<TNewOk>(
    callback: (value: TOk) => Promise<TNewOk>
  ): Promise<Result<TNewOk, TErr>>;
  map<TNewOk>(
    callback: (value: TOk) => TNewOk
  ): MaybePromise<Result<TNewOk, TErr>> {
    // @ts-expect-error - no value to map over
    return this;
  }

  flatMap<TNewOk, TNewErr>(
    callback: (value: TOk) => Promise<Result<TNewOk, TNewErr>>
  ): Promise<Result<TNewOk, TErr | TNewErr>>;
  flatMap<TNewOk, TNewErr>(
    callback: (value: TOk) => Result<TNewOk, TNewErr>
  ): Result<TNewOk, TErr | TNewErr>;
  flatMap<TNewOk, TNewErr>(
    callback: (value: TOk) => MaybePromise<Result<TNewOk, TNewErr>>
  ): MaybePromise<Result<TNewOk, TErr | TNewErr>> {
    // @ts-expect-error - no value to map over
    return this;
  }

  mapErr<TNewErr>(callback: (value: TErr) => TNewErr): Result<TOk, TNewErr> {
    return new Err(callback(this.error));
  }
}

/**
 * A utility for checking if a value is a `Result`.
 */
function is<TOk, TErr>(input: unknown): input is Result<TOk, TErr> {
  return input instanceof Ok || input instanceof Err;
}

/**
 * Create a new `Ok` result.
 */
function ok<TOk>(value: TOk): Result<TOk, never> {
  return new Ok(value);
}

/**
 * Create a new `Err` result.
 */
function err<TErr>(error: TErr): Result<never, TErr> {
  return new Err(error);
}

/**
 * Take a promise and return a `Result` of the promise's value.
 */
async function safe<TOk>(promise: Promise<TOk>): Promise<Result<TOk, Error>> {
  return promise
    .then((value) => Result.ok(value))
    .catch((error) =>
      error instanceof Error
        ? Result.err(error)
        : Result.err(new Error('unexpected error'))
    );
}

/**
 * Take an array of results and return an array of the values of the results or the first error.
 */
function all<TResults extends Result<unknown, unknown>[]>(
  ...results: TResults
): Result<ResultTypes<TResults>, ResultErrors<TResults>[number]> {
  const values = [];
  for (const result of results) {
    if (result.isErr) {
      return result as Result<never, ResultErrors<TResults>[number]>;
    }

    values.push(result.value);
  }

  return Result.ok(values) as Result<ResultTypes<TResults>, never>;
}

/**
 * Take an array of results and return the first ok result or an array of errors.
 */
function any<TResults extends Result<unknown, unknown>[]>(
  ...results: TResults
): Result<ResultTypes<TResults>[number], ResultErrors<TResults>> {
  const errors = [];
  for (const result of results) {
    if (result.isOk) {
      return result as Result<ResultTypes<TResults>[number], never>;
    }

    errors.push(result.error);
  }

  return Result.err(errors) as Result<never, ResultErrors<TResults>>;
}

function async<TOk, TErr>(result: MaybePromise<Result<TOk, TErr>>) {
  const raw = async () => {
    const awaited = await result;
    return awaited.raw();
  };

  const then = async (resolve: (result: Result<TOk, TErr>) => void) => {
    resolve(await result);
  };

  const map = <TNewOk>(callback: (value: TOk) => MaybePromise<TNewOk>) => {
    const nextPromise = async () => {
      const awaited = await result;
      const [promise, error] = awaited.map(async (ok) => callback(ok)).tuple();
      return promise ? Result.ok(await promise) : Result.err(error);
    };

    return async(nextPromise());
  };

  const flatMap = <TNewOk, TNewErr>(
    callback: (value: TOk) => Promise<Result<TNewOk, TNewErr>>
  ) => {
    const nextPromise = async () => {
      const awaited = await result;
      return awaited.flatMap(async (ok) => callback(ok));
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
