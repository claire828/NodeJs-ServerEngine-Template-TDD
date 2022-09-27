import express from "express";
import { AuthType, IEndpointConfig } from "../../configs/IEndpointConfig";
import authHmac from "../../middlewares/authHmac/authHmac";
import authJWT from "../../middlewares/authJWT/authJWT";
import { validate } from "../../middlewares/validate/validate";

export default class Endpoint {
  private config: IEndpointConfig;
  private middlewares: any[] = [];

  constructor(conf: IEndpointConfig) {
    this.config = conf;
  }
  private initDecorate() {
    this.addAuth()
      .addValidator()
      .addMiddlewares()
      .registerHandler()
      .registerErrorCatcher()
      .registerLogHandler();
  }

  // 外部注入Server, 將之把所有裝飾器做註冊
  public register(app: express.Application) {
    this.initDecorate();
    app[this.config.method](this.config.path, ...this.middlewares);
  }

  // 先驗證類型 Auth
  private addAuth() {
    switch (this.config.authType) {
      case AuthType.HMAC:
        this.middlewares.push(authHmac);
        break;
      case AuthType.JWT:
        this.middlewares.push(authJWT);
        break;
    }

    return this;
  }

  // 驗證參數正確性 params - express validator schema
  private addValidator() {
    this.middlewares.push(...validate(this.config.validator));

    return this;
  }

  // 添加真正的middleware
  private addMiddlewares() {
    this.middlewares.push(...this.config.middleWares);

    return this;
  }

  // 註冊handler
  private registerHandler() {
    this.middlewares.push(this.config.handler);

    return this;
  }

  // 註冊Error catcher
  private registerErrorCatcher() {
    // TODO 做一個總錯誤處理得捕捉器
    return this;
  }

  // 註冊Log handler
  private registerLogHandler() {
    // TODO 做一個處理log紀錄的管理區 - log的部分都統一傳入某server進行儲存。
    return this;
  }
}
