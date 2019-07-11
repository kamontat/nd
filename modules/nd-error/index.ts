import ExceptionService from "./models/ExceptionService";
import Package from "./package.json";

/**
 * @example
 *    ExceptionService.warn.build(ERR_ABC)
 *    ExceptionService.build(ERR_ABC)
 *
 *    ExceptionService.warn.build(ERR_ABC).description("custom message").print().exit()
 *    ExceptionService.build(ERR_ABC).description("custom message").print().exit()
 *
 *    throw ExceptionService.build(ERR_ABC).description("custom message")
 *    throw ExceptionService.warn.build(ERR_ABC)
 *    throw ExceptionService.build(ERR_ABC)
 *
 */
export default ExceptionService;

export * from "./constants";

export { IException } from "./models/IException";
export { Package };
