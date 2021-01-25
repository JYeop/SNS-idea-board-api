export const ERRORS: {
  [x: string]: {code: number; message: string}
} = {
  REQUEST_FAILED: { code: 400, message: 'REQUEST_FAILED' },
  TOKEN_EXPIRED: { code: 401, message: 'TOKEN_EXPIRED' },
  INVALID_TOKEN: { code: 402, message: 'INVALID_TOKEN' },
  MISSING_REQUIRED_ARGUMENTS: { code: 403, message: 'MISSING_REQUIRED_ARGUMENTS' },
  // 404는 not found 용도
  SENDING_SMS_FAILED: { code: 405, message: 'SENDING_SMS_FAILED' },
  VERIFY_WITH_SMS_FAILED: { code: 406, message: 'VERIFY_WITH_SMS_FAILED' }
}
