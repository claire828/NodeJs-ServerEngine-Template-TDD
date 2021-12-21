import { fake } from "sinon";

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
