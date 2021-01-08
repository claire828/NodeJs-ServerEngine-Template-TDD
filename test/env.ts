import faker from "faker";

process.env = {
  JWT_SECRET: faker.lorem.word(),
  PORT: "5001",
  HMAC_SECRET: faker.lorem.word(),
};
