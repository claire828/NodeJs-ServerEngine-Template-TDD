import cors from "cors";
import express from "express";
import http from "http";
import morgan from "morgan";
import iServerConfig from "../../configs/IServerConfig";

const ACCESS_LOG = JSON.stringify({
  method: ":method",
  status: ":status",
  url: ":url",
  "http-version": ":http-version",
  ip: ":remote-addr",
  "user-agent": ":user-agent",
  "content-length": ":res[content-length]",
  referrer: ":referrer",
  "response-time": ":response-time",
  severity: "DEBUG",
  message: ":method :url [:status]",
});

// TODO 未來可以加入https伺服器，根據憑證決定創建立
export default class Server {
  public config: iServerConfig;
  private app: express.Application;
  private server: http.Server;

  public get appInst() {
    return this.app;
  }

  constructor(conf: iServerConfig) {
    this.config = conf;
    this.app = express();
    this.registerDefaultMiddlewares();
    this.registerMiddlewares();
    this.registerEndpoints();
  }

  //// parse body params and attache them to req.body
  private registerDefaultMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors());
    this.app.use(morgan(ACCESS_LOG));
  }

  private registerMiddlewares() {
    this.config.globalMiddlewares.forEach((middleware) => {
      this.app.use(middleware);
    });
  }

  private registerEndpoints() {
    this.config.endpoints.forEach((endpoint) => {
      endpoint.register(this.app);
    });
  }
  public async run() {
    // promise.all = 執行這些function
    await Promise.all(this.config.initCallbacks.map((callback) => callback()));
    // new promise = 等這個function內的call back被執行才結束
    await new Promise(
      (resolve) =>
        (this.server = this.app.listen(this.config.port, () => {
          console.log(
            `⚡️[server]: Server is running at http://localhost:${this.config.port}`
          );
          resolve();
        }))
    );
  }

  public async shutdown() {
    return new Promise((resolve) => {
      this.server.on("close", async (error: any) => {
        if (error) console.log(`server shutdown error:${error}`);

        await Promise.all(
          this.config.shutdownCallbacks.map((callback) => callback())
        );
        console.log(`⚡️[server]: Server is shutdown`);
        resolve();
      });
      this.server.close();
    });
  }
}
