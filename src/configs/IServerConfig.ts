import Endpoint from "entities/endpoint/endpoint";

export default interface IServerCongig {
  port: number | string;
  globalMiddlewares: any[];
  errorMiddlewares: any[];
  endpoints: Endpoint[];
  initCallbacks: any[];
  shutdownCallbacks: any[];
}
