import { json } from "envalid";
import IHmacPayload from "../common/IHmacPayload";
import createHmac from "../createHmac/createHmac";

// pack final struct send to clients by add signature to the payload
export default function signPayload(payload: {}): IHmacPayload {
  const data: IHmacPayload = { payload, signature: createHmac(payload) };

  return data;
}
