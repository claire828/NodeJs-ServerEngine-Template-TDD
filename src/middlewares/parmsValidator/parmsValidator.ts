
import {Request, Response, NextFunction} from 'express';
import {validationResult} from 'express-validator';

export function parmsValidator(req:Request, res:Response, next:NextFunction){
    const result = validationResult(req);
    if(result.isEmpty()) return next();

    // TODO call error log
    return res.status(400).json({ errors: result.array() });
}

