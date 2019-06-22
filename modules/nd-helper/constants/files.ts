declare var __COMPILE_DATE__: string;

export const TMP = `/tmp/nd-${__COMPILE_DATE__}`;

export const LOG = `${TMP}/logs`;

export const TMP_A = `${TMP}/TA-${Math.random()
  .toString(36)
  .substring(7)}-${+new Date()}`;

export const TMP_B = `${TMP}/TB-${Math.random()
  .toString(36)
  .substring(7)}-${+new Date()}`;

export const LOG_A = `${LOG}/LA-${Math.random()
  .toString(36)
  .substring(7)}-${+new Date()}`;

export const LOG_B = `${LOG}/LB-${Math.random()
  .toString(36)
  .substring(7)}-${+new Date()}`;
