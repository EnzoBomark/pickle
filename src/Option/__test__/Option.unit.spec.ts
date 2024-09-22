import { Option } from '../Option';

describe('Option', () => {
  describe('raw', () => {
    it('returns the value for an Some option', () => {
      const mayExist1: Option<number> = Option.some(1);
      const option = mayExist1.raw();

      expect(option).toBe(1);
    });

    it('returns the null for an None option', () => {
      const mayExist1: Option<number> = Option.none;
      const option = mayExist1.raw();

      expect(option).toBe(null);
    });

    it('returns the falsy for an None option', () => {
      const mayExist1: Option<number> = Option.none;
      const option = mayExist1.raw(0);

      expect(option).toBe(0);
    });
  });

  describe('else', () => {
    it('returns the value for an Some option', () => {
      const mayExist1: Option<number> = Option.some(1);
      const option = mayExist1.else(0);

      expect(option).toBe(1);
    });

    it('returns the fallback for an None option', () => {
      const mayExist1: Option<number> = Option.none;
      const option = mayExist1.else(0);

      expect(option).toBe(0);
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
    it('maps over an Some option', () => {
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
    it('maps over an Some option', () => {
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

  describe('Option.some', () => {
    it('creates an Some option', () => {
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
    it('returns an Some option for from a resolved promise', async () => {
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
    it('returns an Some option for a truthy value', () => {
      const option = Option.from(1);

      expect(option.isSome && option.value).toBe(1);
    });

    it('returns an None option for a falsy value', () => {
      const option = Option.from(null);

      expect(option.isNone).toBe(true);
    });
  });
});
