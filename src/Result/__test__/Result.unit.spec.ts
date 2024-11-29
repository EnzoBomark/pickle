import { Result } from '../Result';

describe('Result', () => {
  describe('unsafe', () => {
    it('returns the ok value', () => {
      const mayFail1: Result<number, 'error1'> = Result.ok(1);
      const result = mayFail1.unsafe();

      expect(result).toBe(1);
    });

    it('returns the error value', () => {
      const mayFail1: Result<number, 'error1'> = Result.err('error1');
      const result = mayFail1.unsafe();

      expect(result).toBe('error1');
    });
  });

  describe('okOr', () => {
    it('returns the value for an Ok result', () => {
      const mayFail1: Result<number, 'error1'> = Result.ok(1);
      const result = mayFail1.okOr(0);

      expect(result).toBe(1);
    });

    it('returns the fallback for an Err result', () => {
      const mayFail1: Result<number, 'error1'> = Result.err('error1');
      const result = mayFail1.okOr(0);

      expect(result).toBe(0);
    });
  });

  describe('errorOr', () => {
    it('returns the fallback for an Ok result', () => {
      const mayFail1: Result<number, 'error1'> = Result.ok(1);
      const result = mayFail1.errorOr('error0');

      expect(result).toBe('error0');
    });

    it('returns the error for an Err result', () => {
      const mayFail1: Result<number, 'error1'> = Result.err('error1');
      const result = mayFail1.errorOr('error0');

      expect(result).toBe('error1');
    });
  });

  describe('okOrElse', () => {
    it('returns the value for an Ok result', () => {
      const mayFail1: Result<number, 'error1'> = Result.ok(1);
      const result = mayFail1.okOrElse(() => 0);

      expect(result).toBe(1);
    });

    it('returns the fallback for an Err result', () => {
      const mayFail1: Result<number, 'error1'> = Result.err('error1');
      const result = mayFail1.okOrElse(() => 0);

      expect(result).toBe(0);
    });
  });

  describe('errorOrElse', () => {
    it('returns the fallback for an Ok result', () => {
      const mayFail1: Result<number, 'error1'> = Result.ok(1);
      const result = mayFail1.errorOrElse(() => 'error0');

      expect(result).toBe('error0');
    });

    it('returns the error for an Err result', () => {
      const mayFail1: Result<number, 'error1'> = Result.err('error1');
      const result = mayFail1.errorOrElse(() => 'error0');

      expect(result).toBe('error1');
    });
  });

  describe('okOrThrow', () => {
    it('returns the value for an Ok result', () => {
      const mayFail1: Result<number, 'error1'> = Result.ok(1);
      const result = mayFail1.okOrThrow(() => new Error('error'));

      expect(result).toBe(1);
    });

    it('throws an error for an Err result', () => {
      const mayFail1: Result<number, 'error1'> = Result.err('error1');

      try {
        mayFail1.okOrThrow(() => new Error('error'));
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('errorOrThrow', () => {
    it('throws an error for an Ok result', () => {
      const mayFail1: Result<number, 'error1'> = Result.ok(1);

      try {
        mayFail1.errorOrThrow(() => new Error('error'));
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    it('returns the error for an Err result', () => {
      const mayFail1: Result<number, 'error1'> = Result.err('error1');
      const result = mayFail1.errorOrThrow(() => new Error('error'));

      expect(result).toBe('error1');
    });
  });

  describe('tuple', () => {
    it('returns a tuple for an Ok result', () => {
      const mayFail1: Result<number, 'error1'> = Result.ok(1);
      const [ok, err] = mayFail1.tuple();

      expect(ok).toBe(1);
      expect(err).toBeNull();
    });

    it('returns a tuple for an Err result', () => {
      const mayFail1: Result<number, 'error1'> = Result.err('error1');
      const [ok, err] = mayFail1.tuple();

      expect(ok).toBeNull();
      expect(err).toBe('error1');
    });
  });

  describe('or', () => {
    it('returns first result Ok result', () => {
      const mayFail1: Result<number, 'error1'> = Result.ok(1);
      const mayFail2: Result<number, 'error2'> = Result.ok(2);
      const mayFail3: Result<number, 'error3'> = Result.ok(3);
      const result = mayFail1.or(mayFail2).or(mayFail3);

      expect(result.isOk && result.value).toBe(1);
    });

    it('returns first result Ok result', () => {
      const mayFail1: Result<number, 'error1'> = Result.err('error1');
      const mayFail2: Result<number, 'error2'> = Result.ok(2);
      const mayFail3: Result<number, 'error3'> = Result.ok(3);
      const result = mayFail1.or(mayFail2).or(mayFail3);

      expect(result.isOk && result.value).toBe(2);
    });

    it('returns last result Err result', () => {
      const mayFail1: Result<number, 'error1'> = Result.err('error1');
      const mayFail2: Result<number, 'error2'> = Result.err('error2');
      const mayFail3: Result<number, 'error3'> = Result.err('error3');
      const result = mayFail1.or(mayFail2).or(mayFail3);

      expect(result.isErr && result.error).toBe('error3');
    });
  });

  describe('map', () => {
    it('maps over an Ok result', () => {
      const mayFail1: Result<number, 'error1'> = Result.ok(1);
      const result = mayFail1.map((value) => value + 1);

      expect(result.isOk && result.value).toEqual(2);
    });

    it('does not map over an Err result', () => {
      const mayFail1: Result<number, 'error1'> = Result.err('error1');
      const result = mayFail1.map((value) => value + 1);

      expect(result.isErr && result.error).toEqual('error1');
    });
  });

  describe('flatMap', () => {
    it('maps over an Ok result', () => {
      const mayFail1: Result<number, 'error1'> = Result.ok(1);
      const mayFail2: Result<number, 'error2'> = Result.ok(2);
      const result = mayFail1.flatMap(() => mayFail2);

      expect(result.isOk && result.value).toBe(2);
    });

    it('does not map over an Err result', () => {
      const mayFail1: Result<number, 'error1'> = Result.err('error1');
      const mayFail2: Result<number, 'error2'> = Result.ok(2);
      const result = mayFail1.flatMap(() => mayFail2);

      expect(result.isErr && result.error).toEqual('error1');
    });

    it('does not map over an Err result', () => {
      const mayFail1: Result<number, 'error1'> = Result.ok(1);
      const mayFail2: Result<number, 'error2'> = Result.err('error2');
      const result = mayFail1.flatMap(() => mayFail2);

      expect(result.isErr && result.error).toEqual('error2');
    });
  });

  describe('mapErr', () => {
    it('maps over an Err result', () => {
      const mayFail1: Result<number, 'error1'> = Result.err('error1');
      const result = mayFail1.mapErr((error) => `new ${error}`);

      expect(result.isErr && result.error).toEqual('new error1');
    });

    it('does not map over an Ok result', () => {
      const mayFail1: Result<number, 'error1'> = Result.ok(1);
      const result = mayFail1.mapErr((error) => `new ${error}`);

      expect(result.isOk && result.value).toEqual(1);
    });
  });

  describe('flatMapErr', () => {
    it('maps over an Err result', () => {
      const mayFail1: Result<number, 'error1'> = Result.err('error1');
      const mayFail2: Result<number, 'error2'> = Result.err('error2');
      const result = mayFail1.flatMapErr(() => mayFail2);

      expect(result.isErr && result.error).toEqual('error2');
    });

    it('does not map over an Ok result', () => {
      const mayFail1: Result<number, 'error1'> = Result.ok(1);
      const mayFail2: Result<number, 'error2'> = Result.err('error2');
      const result = mayFail1.flatMapErr(() => mayFail2);

      expect(result.isOk && result.value).toEqual(1);
    });
  });

  describe('filter', () => {
    it('returns a Some for an Ok result that passes the predicate', () => {
      const mayFail1: Result<number, 'error1'> = Result.ok(1);
      const result = mayFail1.filter((value) => value === 1);

      expect(result.isSome && result.value).toBe(1);
    });

    it('returns a None for an Ok result that does not pass the predicate', () => {
      const mayFail1: Result<number, 'error1'> = Result.ok(1);
      const result = mayFail1.filter((value) => value !== 1);

      expect(result.isNone).toBe(true);
    });
  });

  describe('toOption', () => {
    it('returns a Some for an Ok result', () => {
      const mayFail1: Result<number, 'error1'> = Result.ok(1);
      const option = mayFail1.toOption();

      expect(option.isSome && option.value).toBe(1);
    });

    it('returns a None for an Err result', () => {
      const mayFail1: Result<number, 'error1'> = Result.err('error1');
      const option = mayFail1.toOption();

      expect(option.isNone).toBe(true);
    });
  });

  describe('effect', () => {
    it('executes a side effect for an Ok result', () => {
      const mayFail1: Result<number, 'error1'> = Result.ok(1);
      const doSomething = jest.fn();
      mayFail1.effect((v) => doSomething(v));

      expect(mayFail1.isOk && mayFail1.value).toBe(1);
      expect(doSomething).toHaveBeenCalledWith(1);
    });

    it('does not execute a side effect for an Err result', () => {
      const mayFail1: Result<number, 'error1'> = Result.err('error1');
      const doSomething = jest.fn();
      mayFail1.effect((v) => doSomething(v));

      expect(mayFail1.isErr && mayFail1.error).toBe('error1');
      expect(doSomething).not.toHaveBeenCalled();
    });
  });

  describe('effectErr', () => {
    it('executes a side effect for an Err result', () => {
      const mayFail1: Result<number, 'error1'> = Result.err('error1');
      const doSomething = jest.fn();
      mayFail1.effectErr((e) => doSomething(e));

      expect(mayFail1.isErr && mayFail1.error).toBe('error1');
      expect(doSomething).toHaveBeenCalledWith('error1');
    });

    it('does not execute a side effect for an Ok result', () => {
      const mayFail1: Result<number, 'error1'> = Result.ok(1);
      const doSomething = jest.fn();
      mayFail1.effectErr((e) => doSomething(e));

      expect(mayFail1.isOk && mayFail1.value).toBe(1);
      expect(doSomething).not.toHaveBeenCalled();
    });
  });

  describe('Result.ok', () => {
    it('creates an Ok result', () => {
      const result = Result.ok('success');

      expect(result.isOk && result.value).toBe('success');
    });
  });

  describe('Result.err', () => {
    it('creates an Err result', () => {
      const result = Result.err('error');

      expect(result.isErr && result.error).toBe('error');
    });
  });

  describe('Result.safe', () => {
    it('returns an Ok result for from a resolved promise', async () => {
      const mayFail1: Promise<number> = Promise.resolve(1);
      const result = await Result.safe(mayFail1);

      expect(result.isOk && result.value).toBe(1);
    });

    it('returns an Err result for from a rejected promise', async () => {
      const mayFail1: Promise<number> = Promise.reject('error');
      const result = await Result.safe(mayFail1);

      expect(result.isErr && result.error).toBe('error');
    });
  });

  describe('Result.all', () => {
    it('returns all Ok results', () => {
      const mayFail1: Result<number, 'error1'> = Result.ok(1);
      const mayFail2: Result<number, 'error2'> = Result.ok(2);
      const result = Result.all(mayFail1, mayFail2);

      expect(result.isOk && result.value).toEqual([1, 2]);
    });

    it('returns the first Err result', () => {
      const mayFail1: Result<number, 'error1'> = Result.ok(1);
      const mayFail2: Result<number, 'error2'> = Result.err('error2');
      const result = Result.all(mayFail1, mayFail2);

      expect(result.isErr && result.error).toBe('error2');
    });
  });

  describe('Result.any', () => {
    it('returns the first Ok result', () => {
      const mayFail1: Result<number, 'error1'> = Result.err('error1');
      const mayFail2: Result<number, 'error2'> = Result.ok(2);
      const result = Result.any(mayFail1, mayFail2);

      expect(result.isOk && result.value).toBe(2);
    });

    it('returns all Err results', () => {
      const mayFail1: Result<number, 'error1'> = Result.err('error1');
      const mayFail2: Result<number, 'error2'> = Result.err('error2');
      const result = Result.any(mayFail1, mayFail2);

      expect(result.isErr && result.error).toEqual(['error1', 'error2']);
    });
  });

  describe('Result.from', () => {
    it('returns an Ok result for a truthy value', () => {
      const result = Result.from(1, 'error');

      expect(result.isOk && result.value).toBe(1);
    });

    it('returns an Err result for a falsy value', () => {
      const result = Result.from(0, 'error');

      expect(result.isErr && result.error).toBe('error');
    });
  });

  describe('Result.fromNullable', () => {
    it('returns an Ok result for a non-null value', () => {
      const result = Result.fromNullable(1, 'error');

      expect(result.isOk && result.value).toBe(1);
    });

    it('returns an Err result for a null value', () => {
      const result = Result.fromNullable(null, 'error');

      expect(result.isErr && result.error).toBe('error');
    });
  });

  describe('Result.async', () => {
    describe('then', () => {
      it('can be awaited', async () => {
        const mayFail1: Result<number, 'error1'> = Result.ok(1);
        const asyncResult = Result.async(Promise.resolve(mayFail1));
        const result = await asyncResult;

        expect(result.isOk && result.value).toEqual(1);
      });
    });

    describe('unsafe', () => {
      it('returns the ok or err value', async () => {
        const mayFail1: Result<number, 'error1'> = Result.ok(1);
        const result = await Result.async(Promise.resolve(mayFail1)).unsafe();

        expect(result).toEqual(1);
      });
    });

    describe('okOr', () => {
      it('returns the value for an Ok result', async () => {
        const mayFail1: Result<number, 'error1'> = Result.ok(1);
        const result = await Result.async(Promise.resolve(mayFail1)).okOr(0);

        expect(result).toBe(1);
      });

      it('returns the fallback for an Err result', async () => {
        const mayFail1: Result<number, 'error1'> = Result.err('error1');
        const result = await Result.async(Promise.resolve(mayFail1)).okOr(0);

        expect(result).toBe(0);
      });
    });

    describe('errorOr', () => {
      it('returns the fallback for an Ok result', async () => {
        const mayFail1: Result<number, 'error1'> = Result.ok(1);
        const result = await Result.async(Promise.resolve(mayFail1)).errorOr(
          'error0'
        );

        expect(result).toBe('error0');
      });

      it('returns the error for an Err result', async () => {
        const mayFail1: Result<number, 'error1'> = Result.err('error1');
        const result = await Result.async(Promise.resolve(mayFail1)).errorOr(
          'error0'
        );

        expect(result).toBe('error1');
      });
    });

    describe('okOrElse', () => {
      it('returns the value for an Ok result', async () => {
        const mayFail1: Result<number, 'error1'> = Result.ok(1);
        const result = await Result.async(Promise.resolve(mayFail1)).okOrElse(
          () => 0
        );

        expect(result).toBe(1);
      });

      it('returns the fallback for an Err result', async () => {
        const mayFail1: Result<number, 'error1'> = Result.err('error1');
        const result = await Result.async(Promise.resolve(mayFail1)).okOrElse(
          () => 0
        );

        expect(result).toBe(0);
      });
    });

    describe('errorOrElse', () => {
      it('returns the fallback for an Ok result', async () => {
        const mayFail1: Result<number, 'error1'> = Result.ok(1);
        const result = await Result.async(
          Promise.resolve(mayFail1)
        ).errorOrElse(() => 'error0');

        expect(result).toBe('error0');
      });

      it('returns the error for an Err result', async () => {
        const mayFail1: Result<number, 'error1'> = Result.err('error1');
        const result = await Result.async(
          Promise.resolve(mayFail1)
        ).errorOrElse(() => 'error0');

        expect(result).toBe('error1');
      });
    });

    describe('okOrThrow', () => {
      it('returns the value for an Ok result', async () => {
        const mayFail1: Result<number, 'error1'> = Result.ok(1);
        const result = await Result.async(Promise.resolve(mayFail1)).okOrThrow(
          () => new Error('error')
        );

        expect(result).toBe(1);
      });

      it('throws an error for an Err result', async () => {
        const mayFail1: Result<number, 'error1'> = Result.err('error1');

        Result.async(Promise.resolve(mayFail1))
          .okOrThrow(() => new Error('error'))
          .catch((error) => {
            expect(error).toBeInstanceOf(Error);
          });
      });
    });

    describe('errorOrThrow', () => {
      it('throws an error for an Ok result', async () => {
        const mayFail1: Result<number, 'error1'> = Result.ok(1);

        Result.async(Promise.resolve(mayFail1))
          .errorOrThrow(() => new Error('error'))
          .catch((error) => {
            expect(error).toBeInstanceOf(Error);
          });
      });

      it('returns the error for an Err result', async () => {
        const mayFail1: Result<number, 'error1'> = Result.err('error1');
        const result = await Result.async(
          Promise.resolve(mayFail1)
        ).errorOrThrow(() => new Error('error'));

        expect(result).toBe('error1');
      });
    });

    describe('map', () => {
      it('maps over an Ok result', async () => {
        const mayFail1: Result<number, 'error1'> = Result.ok(1);

        const result = await Result.async(Promise.resolve(mayFail1))
          .map((value) => value + 1)
          .map((value) => `value: ${value}`);

        expect(result.isOk && result.value).toEqual('value: 2');
      });
    });

    describe('flatMap', () => {
      it('maps over an Ok result', async () => {
        const mayFail1: Result<number, 'error1'> = Result.ok(1);
        const mayFail2: Result<number, 'error2'> = Result.ok(2);
        const mayFail3: Result<number, 'error3'> = Result.ok(3);

        const result = await Result.async(Promise.resolve(mayFail1))
          .flatMap(() => Promise.resolve(mayFail2))
          .flatMap(() => Promise.resolve(mayFail3));

        expect(result.isOk && result.value).toEqual(3);
      });

      it('does not map over an Err result', async () => {
        const mayFail1: Result<number, 'error1'> = Result.err('error1');
        const mayFail2: Result<number, 'error2'> = Result.ok(2);
        const mayFail3: Result<number, 'error3'> = Result.ok(3);

        const result = await Result.async(Promise.resolve(mayFail1))
          .flatMap(() => Promise.resolve(mayFail2))
          .flatMap(() => Promise.resolve(mayFail3));

        expect(result.isErr && result.error).toEqual('error1');
      });

      it('does not map over an Err result', async () => {
        const mayFail1: Result<number, 'error1'> = Result.ok(1);
        const mayFail2: Result<number, 'error2'> = Result.err('error2');
        const mayFail3: Result<number, 'error3'> = Result.ok(3);

        const result = await Result.async(Promise.resolve(mayFail1))
          .flatMap(() => Promise.resolve(mayFail2))
          .flatMap(() => Promise.resolve(mayFail3));

        expect(result.isErr && result.error).toEqual('error2');
      });
    });

    describe('mapErr', () => {
      it('maps over an Err result', async () => {
        const mayFail1: Result<number, 'error1'> = Result.err('error1');

        const result = await Result.async(Promise.resolve(mayFail1)).mapErr(
          (error) => `new ${error}`
        );

        expect(result.isErr && result.error).toEqual('new error1');
      });

      it('does not map over an Ok result', async () => {
        const mayFail1: Result<number, 'error1'> = Result.ok(1);

        const result = await Result.async(Promise.resolve(mayFail1)).mapErr(
          (error) => `new ${error}`
        );

        expect(result.isOk && result.value).toEqual(1);
      });
    });

    describe('flatMapErr', () => {
      it('maps over an Err result', async () => {
        const mayFail1: Result<number, 'error1'> = Result.err('error1');
        const mayFail2: Result<number, 'error2'> = Result.err('error2');

        const result = await Result.async(Promise.resolve(mayFail1)).flatMapErr(
          () => Promise.resolve(mayFail2)
        );

        expect(result.isErr && result.error).toEqual('error2');
      });

      it('does not map over an Ok result', async () => {
        const mayFail1: Result<number, 'error1'> = Result.ok(1);
        const mayFail2: Result<number, 'error2'> = Result.err('error2');

        const result = await Result.async(Promise.resolve(mayFail1)).flatMapErr(
          () => Promise.resolve(mayFail2)
        );

        expect(result.isOk && result.value).toEqual(1);
      });
    });

    describe('toOption', () => {
      it('returns a Some for an Ok result', async () => {
        const mayFail1: Result<number, 'error1'> = Result.ok(1);

        const option = await Result.async(Promise.resolve(mayFail1)).toOption();

        expect(option.isSome && option.value).toBe(1);
      });

      it('returns a None for an Err result', async () => {
        const mayFail1: Result<number, 'error1'> = Result.err('error1');

        const option = await Result.async(Promise.resolve(mayFail1)).toOption();

        expect(option.isNone).toBe(true);
      });
    });
  });
});
