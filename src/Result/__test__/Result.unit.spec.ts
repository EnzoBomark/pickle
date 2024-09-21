import { Result } from '../Result';

describe('Result', () => {
  describe('raw', () => {
    it('returns the ok value', () => {
      const mayFail1: Result<number, 'error1'> = Result.ok(1);
      const result = mayFail1.raw();

      expect(result).toBe(1);
    });

    it('returns the error value', () => {
      const mayFail1: Result<number, 'error1'> = Result.err('error1');
      const result = mayFail1.raw();

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

  describe('else', () => {
    it('returns the value for an Ok result', () => {
      const mayFail1: Result<number, 'error1'> = Result.ok(1);
      const result = mayFail1.else(0);

      expect(result).toBe(1);
    });

    it('returns the fallback for an Err result', () => {
      const mayFail1: Result<number, 'error1'> = Result.err('error1');
      const result = mayFail1.else(0);

      expect(result).toBe(0);
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

    it('returns first result Err result', () => {
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

      expect(result.isErr && result.error).toBeInstanceOf(Error);
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

  describe('Result.async', () => {
    describe('raw', () => {
      it('returns the ok or err value', async () => {
        const mayFail1: Result<number, 'error1'> = Result.ok(1);
        const result = await Result.async(Promise.resolve(mayFail1)).raw();

        expect(result).toEqual(1);
      });
    });

    describe('then', () => {
      it('can be awaited', async () => {
        const mayFail1: Result<number, 'error1'> = Result.ok(1);
        const asyncResult = Result.async(Promise.resolve(mayFail1));
        const result = await asyncResult;

        expect(result.isOk && result.value).toEqual(1);
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
  });
});
