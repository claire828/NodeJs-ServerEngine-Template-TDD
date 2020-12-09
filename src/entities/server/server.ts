import express from "express";
import http from "http";
import iServerConfig from "../../configs/IServerConfig";

// TODO 未來可以加入https伺服器，根據憑證決定創建立
export default class Server {
	public config: iServerConfig;
	private app: express.Application;
	private server: http.Server;

	constructor (conf: iServerConfig) {
		this.config = conf;
		this.app = express();
		this.checkEnvironment();
		this.registerMiddlewares();
		this.registerEndpoints();
	}

	private checkEnvironment () {
		// 這邊觀察一下不合法的話他會吐什麼東西出來
		// envalid.cleanEnv(process.env,{ port:envalid.port()});
		// 強型別的時候，根本不需要再check config的內容是否合法，因為他絕對是合法的。
	}

	private registerMiddlewares () {
		// apply global middlewares
		// TODO middleware有分path/function這兩種
		this.config.globalMiddlewares.forEach((middleware) => {
			this.app.use(middleware);
		});
	}

	private registerEndpoints () {
		this.config.endpoints.forEach((endpoint) => {
			endpoint.register(this.app);
		});
	}
	public async run () {
		// promise.all = 執行這些function
		await Promise.all(this.config.initCallbacks.map((callback) => callback()));
		// new promise. 等這個function內的call back被執行才結束
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

	public async shutdown () {
		return new Promise((resolve) => {
			this.server.on("close", async (error: any) => {
				if (error) console.log(`error:${error}`);

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
