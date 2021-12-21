import { expect } from "chai";
import express from "express";
import faker from "faker";
import jwt from "jsonwebtoken";
import { fake } from "sinon";
import request from "supertest";
import {
  AuthType,
  IEndpointConfig,
  Method,
} from "../../configs/IEndpointConfig";
import Endpoint from "../../entities/endpoint/endpoint";
import signPayload from "../../utils/hmac/signPayload/signPayload";

const path = "/hi";
const func = (req:express.Request, res:express.Response, next:express.NextFunction) => {
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
      {
        name: faker.lorem.word(),
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
      },
      process.env.JWT_SECRET
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
      {
        name: faker.lorem.word(),
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
      },
      faker.lorem.word()
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
      process.env.JWT_SECRET
    );
    const emptyTime = jwt.sign({}, process.env.JWT_SECRET);
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
    const fakepayload = { name: faker.lorem.word() };
    const data = signPayload(fakepayload);
    sayHi.authType = AuthType.HMAC;
    const sayHindpoint = new Endpoint(sayHi);
    sayHindpoint.register(app);
    await request(app).get(path).query(data).expect(200);
  });

  it("it should failed authenticate HMAC request if the payload is wong", async () => {
    const data = signPayload({});
    data.payload = { age: 10 };
    sayHi.authType = AuthType.HMAC;
    const sayHindpoint = new Endpoint(sayHi);
    sayHindpoint.register(app);
    await request(app).get(path).query(data).expect(400);
  });
});
