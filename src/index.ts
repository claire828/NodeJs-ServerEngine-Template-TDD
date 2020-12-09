import iServerConfig from "./configs/IServerConfig";
import server from "./entities/server/server";

const config: iServerConfig = {
  port: 3001,
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
