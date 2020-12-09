import { AuthType, IEndpointConfig, Method } from "configs/IEndpointConfig";
import express from "express";
import { checkSchema, validationResult } from "express-validator";
import authHmac from "middlewares/authHmac/authHmac";
import authJWT from "middlewares/authJWT/authJWT";

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
    app[this.config.method].apply(this.config.path, ...this.middlewares);
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
    this.middlewares.push(checkSchema(this.config.validator));
    this.middlewares.push(validationResult(this.config.validator));

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
    // TODO 做一個處理log紀錄的管理區
    return this;
  }
}

// 整理一下思緒
// 我做的方式，當request直接進入Handler做驗證時，我會在此處理完，在res結束。
// 我的作法有個缺點，就是東西都會在裡面，不好被拆出去共用。 真的像是遊戲人出身的寫法。
// 原因：middleware的驗證應該是可重複利用的，因此最好使用添加器的方式將之做裝飾，就像是泡一杯拿鐵一樣可口。

// 裝飾法：用在通常後端的寫法，全部裝飾好，然後針對這個路徑來做註冊。
// 原本我的純走ＯＯ，比較屬於for 單個repository而生。
// 新的這種寫法，可以變成template運用，所以我推推
