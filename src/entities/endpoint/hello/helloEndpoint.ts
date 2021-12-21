import express from "express";
import { AuthType, IEndpointConfig, Method } from "../../../configs/IEndpointConfig.js";
import Endpoint from "../endpoint.js";



 // create endpoint
 const path = "/hello";
 const sayHi: IEndpointConfig = {
   path,
   method: Method.GET,
   middleWares: [],
   handler: (req: express.Request, res: express.Response) => {
     res.sendStatus(200);
   },
   validator: {},
   authType: AuthType.NONE,
 };



 export const helloEndpoint = new Endpoint(sayHi);