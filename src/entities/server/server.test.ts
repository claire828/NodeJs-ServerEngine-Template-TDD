import { expect } from "chai";
import express from "express";
import supertest from "supertest";
import {
  AuthType,
  IEndpointConfig,
  Method,
} from "../../configs/IEndpointConfig";
import iServerConfig from "../../configs/IServerConfig";
import Endpoint from "../../entities/endpoint/endpoint";
import server from "./server";

describe("entities - server", () => {
  before(() => {
    console.log(`test before`);
  });

  it("it shoule init and shutdown", async () => {
    const config: iServerConfig = {
      port: 3001,
      globalMiddlewares: [],
      errorMiddlewares: [],
      endpoints: [],
      initCallbacks: [],
      shutdownCallbacks: [],
    };
    const app = new server(config);
    await app.run();
    console.log("run server");
    expect(app.config).equal(config);
    await app.shutdown();
    console.log("close server");
  });

  it("it should handle endpoints", async () => {
    const path = "/hi";
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
    const sayHiEndpoint = new Endpoint(sayHi);
    const config: iServerConfig = {
      port: 3001,
      globalMiddlewares: [],
      errorMiddlewares: [],
      endpoints: [sayHiEndpoint],
      initCallbacks: [],
      shutdownCallbacks: [],
    };

    const instance = new server(config);
    await instance.run();
    await supertest(instance.appInst).get(path).query({ age: 100 }).expect(200);
    expect(instance.config).equal(config);
    await instance.shutdown();
    console.log("handle endpoint");
  });
});
