import { Option } from '../Option';

describe('Option', () => {
  describe('unsafe', () => {
    it('returns the value for a Some option', () => {
      const mayExist1: Option<number> = Option.some(1);
      const option = mayExist1.unsafe();

      expect(option).toBe(1);
    });

    it('returns the null for an None option', () => {
      const mayExist1: Option<number> = Option.none;
      const option = mayExist1.unsafe();

      expect(option).toBe(null);
    });

    it('returns the falsy for an None option', () => {
      const mayExist1: Option<number> = Option.none;
      const option = mayExist1.unsafe(0);

      expect(option).toBe(0);
    });
  });

  describe('someOr', () => {
    it('returns the value for a Some option', () => {
      const mayExist1: Option<number> = Option.some(1);
      const option = mayExist1.someOr(0);

      expect(option).toBe(1);
    });

    it('returns the fallback for an None option', () => {
      const mayExist1: Option<number> = Option.none;
      const option = mayExist1.someOr(0);

      expect(option).toBe(0);
    });
  });

  describe('noneOr', () => {
    it('returns the value for a Some option', () => {
      const mayExist1: Option<number> = Option.some(1);
      const option = mayExist1.noneOr(0);

      expect(option).toBe(0);
    });

    it('returns the fallback for an None option', () => {
      const mayExist1: Option<number> = Option.none;
      const option = mayExist1.noneOr(0);

      expect(option).toBe(null);
    });
  });

  describe('someOrElse', () => {
    it('returns the value for a Some option', () => {
      const mayExist1: Option<number> = Option.some(1);
      const option = mayExist1.someOrElse(() => 0);

      expect(option).toBe(1);
    });

    it('returns the fallback for an None option', () => {
      const mayExist1: Option<number> = Option.none;
      const option = mayExist1.someOrElse(() => 0);

      expect(option).toBe(0);
    });
  });

  describe('noneOrElse', () => {
    it('returns the value for a Some option', () => {
      const mayExist1: Option<number> = Option.some(1);
      const option = mayExist1.noneOrElse(() => 0);

      expect(option).toBe(0);
    });

    it('returns the fallback for an None option', () => {
      const mayExist1: Option<number> = Option.none;
      const option = mayExist1.noneOrElse(() => 0);

      expect(option).toBe(null);
    });
  });

  describe('someOrThrow', () => {
    it('returns the value for a Some option', () => {
      const mayExist1: Option<number> = Option.some(1);
      const option = mayExist1.someOrThrow(new Error('error'));

      expect(option).toBe(1);
    });

    it('throws the error for an None option', () => {
      const mayExist1: Option<number> = Option.none;

      try {
        mayExist1.someOrThrow(new Error('error'));
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('noneOrThrow', () => {
    it('throws the error for a Some option', () => {
      const mayExist1: Option<number> = Option.some(1);

      try {
        mayExist1.noneOrThrow(new Error('error'));
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    it('returns the null for an None option', () => {
      const mayExist1: Option<number> = Option.none;

      const option = mayExist1.noneOrThrow(new Error('error'));

      expect(option).toBe(null);
    });
  });

  describe('or', () => {
    it('returns first option Some option', () => {
      const mayExist1: Option<number> = Option.some(1);
      const mayExist2: Option<number> = Option.some(2);
      const mayExist3: Option<number> = Option.some(3);
      const option = mayExist1.or(mayExist2).or(mayExist3);

      expect(option.isSome && option.value).toBe(1);
    });

    it('returns first option Some option', () => {
      const mayExist1: Option<number> = Option.none;
      const mayExist2: Option<number> = Option.some(2);
      const mayExist3: Option<number> = Option.some(3);
      const option = mayExist1.or(mayExist2).or(mayExist3);

      expect(option.isSome && option.value).toBe(2);
    });

    it('returns last option None option', () => {
      const mayExist1: Option<number> = Option.none;
      const mayExist2: Option<number> = Option.none;
      const mayExist3: Option<number> = Option.none;
      const option = mayExist1.or(mayExist2).or(mayExist3);

      expect(option.isNone).toBe(true);
    });
  });

  describe('map', () => {
    it('maps over a Some option', () => {
      const mayExist1: Option<number> = Option.some(1);
      const option = mayExist1.map((value) => value + 1);

      expect(option.isSome && option.value).toEqual(2);
    });

    it('does not map over an None option', () => {
      const mayExist1: Option<number> = Option.none;
      const option = mayExist1.map((value) => value + 1);

      expect(option.isNone).toEqual(true);
    });
  });

  describe('flatMap', () => {
    it('maps over a Some option', () => {
      const mayFail1: Option<number> = Option.some(1);
      const mayFail2: Option<number> = Option.some(2);
      const option = mayFail1.flatMap(() => mayFail2);

      expect(option.isSome && option.value).toBe(2);
    });

    it('does not map over an None option', () => {
      const mayFail1: Option<number> = Option.none;
      const mayFail2: Option<number> = Option.some(2);
      const option = mayFail1.flatMap(() => mayFail2);

      expect(option.isNone).toEqual(true);
    });

    it('does not map over an None option', () => {
      const mayFail1: Option<number> = Option.some(1);
      const mayFail2: Option<number> = Option.none;
      const option = mayFail1.flatMap(() => mayFail2);

      expect(option.isNone).toEqual(true);
    });
  });

  describe('filter', () => {
    it('returns a Some for a Some result that passes the predicate', () => {
      const mayExist1: Option<number> = Option.some(1);
      const option = mayExist1.filter((value) => value === 1);

      expect(option.isSome && option.value).toBe(1);
    });

    it('returns a None for a Some result that does not pass the predicate', () => {
      const mayExist1: Option<number> = Option.some(1);
      const option = mayExist1.filter((value) => value === 2);

      expect(option.isNone).toBe(true);
    });
  });

  describe('toResult', () => {
    it('returns an Ok result for a Some option', () => {
      const mayExist1: Option<number> = Option.some(1);
      const result = mayExist1.toResult('error');

      expect(result.isOk && result.value).toBe(1);
    });

    it('returns an Err result for an None option', () => {
      const mayExist1: Option<number> = Option.none;
      const result = mayExist1.toResult('error');

      expect(result.isErr && result.error).toBe('error');
    });
  });

  describe('effect', () => {
    it('executes a side effect for a Some option', () => {
      const mayExist1: Option<number> = Option.some(1);
      const doSomething = jest.fn();
      mayExist1.effect((v) => doSomething(v));

      expect(mayExist1.isSome && mayExist1.value).toBe(1);
      expect(doSomething).toHaveBeenCalledWith(1);
    });

    it('does not execute a side effect for a None value', () => {
      const mayExist1: Option<number> = Option.none;
      const doSomething = jest.fn();
      mayExist1.effect((v) => doSomething(v));

      expect(mayExist1.isNone).toBe(true);
      expect(doSomething).not.toHaveBeenCalled();
    });
  });

  describe('effectNone', () => {
    it('does not execute a side effect for a Some value', () => {
      const mayExist1: Option<number> = Option.some(1);
      const doSomething = jest.fn();
      mayExist1.effectNone(() => doSomething());

      expect(mayExist1.isSome && mayExist1.value).toBe(1);
      expect(doSomething).not.toHaveBeenCalled();
    });

    it('executes a side effect for a None option', () => {
      const mayExist1: Option<number> = Option.none;
      const doSomething = jest.fn();
      mayExist1.effectNone(() => doSomething());

      expect(mayExist1.isNone).toBe(true);
      expect(doSomething).toHaveBeenCalled();
    });
  });

  describe('inspect', () => {
    it('inspects the value for a Some option', () => {
      const mayExist1: Option<number> = Option.some(1);
      const log = jest.fn();
      mayExist1.inspect(log);

      expect(mayExist1.isSome && mayExist1.value).toBe(1);
      expect(log).toHaveBeenCalledWith(1);
    });

    it('inspects the value for an None option', () => {
      const mayExist1: Option<number> = Option.none;
      const log = jest.fn();
      mayExist1.inspect(log);

      expect(mayExist1.isNone).toBe(true);
      expect(log).not.toHaveBeenCalled();
    });
  });

  describe('inspectNone', () => {
    it('inspects the value for a Some option', () => {
      const mayExist1: Option<number> = Option.some(1);
      const log = jest.fn();
      mayExist1.inspectNone(log);

      expect(mayExist1.isSome && mayExist1.value).toBe(1);
      expect(log).not.toHaveBeenCalled();
    });

    it('inspects the value for an None option', () => {
      const mayExist1: Option<number> = Option.none;
      const log = jest.fn();
      mayExist1.inspectNone(log);

      expect(mayExist1.isNone).toBe(true);
      expect(log).toHaveBeenCalled();
    });
  });

  describe('Option.some', () => {
    it('creates a Some option', () => {
      const option = Option.some('success');

      expect(option.isSome && option.value).toBe('success');
    });
  });

  describe('Option.none', () => {
    it('creates an None option', () => {
      const option = Option.none;

      expect(option.isNone).toBe(true);
    });
  });

  describe('Option.safe', () => {
    it('returns a Some option for from a resolved promise', async () => {
      const mayFail1: Promise<number> = Promise.resolve(1);
      const option = await Option.safe(mayFail1);

      expect(option.isSome && option.value).toBe(1);
    });

    it('returns an Err option for from a rejected promise', async () => {
      const mayFail1: Promise<number> = Promise.reject('error');
      const option = await Option.safe(mayFail1);

      expect(option.isNone).toBe(true);
    });
  });

  describe('Option.all', () => {
    it('returns all Some options', () => {
      const mayFail1: Option<number> = Option.some(1);
      const mayFail2: Option<number> = Option.some(2);
      const option = Option.all(mayFail1, mayFail2);

      expect(option.isSome && option.value).toEqual([1, 2]);
    });

    it('returns the first Err option', () => {
      const mayFail1: Option<number> = Option.some(1);
      const mayFail2: Option<number> = Option.none;
      const option = Option.all(mayFail1, mayFail2);

      expect(option.isNone).toEqual(true);
    });
  });

  describe('Option.any', () => {
    it('returns the first Some option', () => {
      const mayFail1: Option<number> = Option.none;
      const mayFail2: Option<number> = Option.some(2);
      const option = Option.any(mayFail1, mayFail2);

      expect(option.isSome && option.value).toBe(2);
    });

    it('returns all Err options', () => {
      const mayFail1: Option<number> = Option.none;
      const mayFail2: Option<number> = Option.none;
      const option = Option.any(mayFail1, mayFail2);

      expect(option.isNone).toEqual(true);
    });
  });

  describe('Option.from', () => {
    it('returns a Some option for a truthy value', () => {
      const option = Option.from(1);

      expect(option.isSome && option.value).toBe(1);
    });

    it('returns an None option for a falsy value', () => {
      const option = Option.from(null);

      expect(option.isNone).toBe(true);
    });
  });

  describe('Option.fromNullable', () => {
    it('returns a Some option for a truthy value', () => {
      const option = Option.fromNullable(1);

      expect(option.isSome && option.value).toBe(1);
    });

    it('returns an None option for a falsy value', () => {
      const option = Option.fromNullable(null);

      expect(option.isNone).toBe(true);
    });
  });
});
