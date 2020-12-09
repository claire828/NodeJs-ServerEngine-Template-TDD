import { expect } from "chai";
import iServerConfig from "../../configs/IServerConfig";
import server from "./server";

describe("entities - server", () => {
  before(() => {
    console.log(`test before`);
  });

  it("it shoule init and shutdown", async () => {
    const config: iServerConfig = {
      port: 3001,
      globalMiddlewares: [],
      errorMiddlewares: [],
      endpoints: [],
      initCallbacks: [],
      shutdownCallbacks: [],
    };
    const app = new server(config);
    await app.run();
    expect(app.config).equal(config);
    await app.shutdown();
    console.log("run server");
  });
});
