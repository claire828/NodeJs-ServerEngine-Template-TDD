import express from "express";
import jwt from "jsonwebtoken";
import { fake } from "sinon";
import request from "supertest";
import authJWT from "./authJWT";

describe("entities - authJWT", () => {
  const SECRET = "helloiamclaire";
  const next = fake();

  it("it should handle JWT", async () => {
    /*
    ts中有點麻煩，想一下可以怎樣快速new出一個request來處理
    const app = express();
    const token = jwt.sign({ name: "claire" }, SECRET);
    const req: express.Request = {
      headers: { authorization: `bearer ${SECRET}` },
    };
    authJWT(req, undefined, next);*/
  });
});
