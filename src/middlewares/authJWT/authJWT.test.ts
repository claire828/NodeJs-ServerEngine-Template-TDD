import express from "express";
import jwt from "jsonwebtoken";
import { fake } from "sinon";
import request from "supertest";
import authJWT from "./authJWT";

describe("entities - authJWT", () => {
  const next = fake();

  it("it should handle JWT", async () => {
    /*
    ts中有點麻煩，想一下可以怎樣快速new出一個request來處理
    const app = express();
    const token = jwt.sign({ name: "claire" }, process.env.JWT_SECRET);
    const req: express.Request = {
      headers: { authorization: `bearer ${process.env.JWT_SECRET}` },
    };
    authJWT(req, undefined, next);*/
  });
});
