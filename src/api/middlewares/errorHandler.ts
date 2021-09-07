import { NextFunction, Request, Response } from 'express';
import HttpException from '../lib/exception';
import { HttpStatusCode } from '../util/statusCodes';
 
function errorMiddleware(error: HttpException, request: Request, response: Response, next: NextFunction) {
  const status = error.status || HttpStatusCode.INTERNAL_SERVER;
  const message = error.message || 'Something went wrong';
  response
    .status(status)
    .json({
      status,
      message,
    });
    return;
}
 
export default errorMiddleware;