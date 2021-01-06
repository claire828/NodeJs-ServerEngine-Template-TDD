import { expect } from "chai";
import express from "express";
import jwt from "jsonwebtoken";
import { fake } from "sinon";
import request from "supertest";
import {
  AuthType,
  IEndpointConfig,
  Method,
} from "../../configs/IEndpointConfig";
import Endpoint from "../../entities/endpoint/endpoint";
import { SECRET } from "../../middlewares/authJWT/authJWT";
const path = "/hi";
const func = (req, res, next) => {
  next();
};
let sayHi: IEndpointConfig;
let app: express.Application;

describe("entities - endpoint", () => {
  beforeEach(() => {
    // 每一次都要清空app，因為使用相同路徑的關係，會覆蓋相關資料
    sayHi = {
      path,
      method: Method.GET,
      middleWares: [],
      handler: (req: express.Request, res: express.Response) => {
        res.sendStatus(200);
      },
      validator: {},
      authType: AuthType.NONE,
    };
    app = express();
  });

  it("it should handle endpoints", async () => {
    const sayHiEndpoint = new Endpoint(sayHi);
    sayHiEndpoint.register(app);
    await request(app).get(path).expect(200);
  });

  it("it should accept request with validate shape", async () => {
    sayHi.validator = { age: { in: "query", isInt: true } };
    const sayHiEndpoint = new Endpoint(sayHi);
    sayHiEndpoint.register(app);
    await request(app).get(path).query({ age: 100 }).expect(200);
    await request(app).get(path).query({}).expect(400);
  });

  it("it should reject request with invalidate shape", async () => {
    sayHi.validator = { age: { in: "query", isInt: true } };
    const sayHiEndpoint = new Endpoint(sayHi);
    sayHiEndpoint.register(app);
    await request(app).get(path).query({ age: "hello" }).expect(400);
    await request(app).get(path).query({}).expect(400);
  });

  it("it should inject middleware", async () => {
    // 使用sinon的fake包裝function, 回傳的函數就可以用來偵測是否有被呼叫
    const middleware = fake(func);
    sayHi.middleWares.push(middleware);
    const sayHiEndpoint = new Endpoint(sayHi);
    sayHiEndpoint.register(app);
    await request(app).get(path).expect(200);
    // expect(middleware.called).to.be.true;
    expect(middleware.callCount).equal(1);
  });

  it("it should inject mutiple middlewares", async () => {
    const middlewares = [fake(func), fake(func)];
    sayHi.middleWares.push(...middlewares);
    const sayHiEndpoint = new Endpoint(sayHi);
    sayHiEndpoint.register(app);
    await request(app).get(path).expect(200);
    expect(middlewares[0].callCount).equal(1);
    expect(middlewares[1].callCount).equal(1);
  });

  it("it should authenticate JWT request", async () => {
    const token = jwt.sign(
      { name: "claire", exp: Math.floor(Date.now() / 1000) + 60 * 60 },
      SECRET
    );
    sayHi.authType = AuthType.JWT;
    const sayHiEndpoint = new Endpoint(sayHi);
    sayHiEndpoint.register(app);
    await request(app)
      .get(path)
      .set("Authorization", "Bearer " + token)
      .expect(200);
  });

  it("it should failed authenticate JWT request", async () => {
    const wrongToken = jwt.sign(
      { name: "claire", exp: Math.floor(Date.now() / 1000) + 60 * 60 },
      "fakesecret"
    );

    sayHi.authType = AuthType.JWT;
    const sayHiEndpoint = new Endpoint(sayHi);
    sayHiEndpoint.register(app);
    await request(app).get(path).expect(403);
    await request(app)
      .get(path)
      .set("Authorization", "Bearer " + wrongToken)
      .expect(401);
  });

  it("it should failed authenticate if the token expired or no expired time", async () => {
    const token = jwt.sign(
      { exp: Math.floor(Date.now() / 1000) - 60 * 60 },
      SECRET
    );
    const emptyTime = jwt.sign({}, SECRET);
    sayHi.authType = AuthType.JWT;
    const sayHiEndpoint = new Endpoint(sayHi);
    sayHiEndpoint.register(app);
    await request(app)
      .get(path)
      .set("Authorization", "Bearer " + token)
      .expect(401);

    await request(app)
      .get(path)
      .set("Authorization", "Bearer " + emptyTime)
      .expect(401);
  });

  it("it should authenticate HMAC request", async () => {
    // todo...
  });
});
