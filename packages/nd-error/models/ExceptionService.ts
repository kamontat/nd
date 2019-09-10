import Exception from "./Exception";
import { IExceptionState } from "./IExceptionState";

const builder = (opt: { warn: boolean }) => {
  return {
    cast<T extends Error>(e: T, opts?: { base?: IExceptionState }): Exception {
      return opt.warn ? Exception.cast(e, opts).warn : Exception.cast(e, opts);
    },
    build(code: IExceptionState, description?: string) {
      return new Exception(code, description, !opt.warn);
    },
  };
};

export default {
  warn: {
    ...builder({ warn: true }),
  },
  ...builder({ warn: false }),
};
