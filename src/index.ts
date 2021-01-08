import IServerConfig from "./configs/IServerConfig";
import server from "./entities/server/server";

const config: IServerConfig = {
  port: +process.env.PORT,
  globalMiddlewares: [],
  errorMiddlewares: [],
  endpoints: [],
  initCallbacks: [],
  shutdownCallbacks: [],
};

const createServer = async () => {
  await new server(config).run();
};
createServer();
