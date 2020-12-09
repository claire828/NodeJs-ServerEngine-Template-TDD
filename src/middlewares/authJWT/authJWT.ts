import {Request, Response, NextFunction} from 'express';

export default function authJWT(req:Request, res:Response, next:NextFunction){
    console.log(`middleware: authHmac`);
    // 這邊做驗證
   return next();
}