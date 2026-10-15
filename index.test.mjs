import test from "node:test";
import assert from "node:assert/strict";
import nock from "nock";
import { makeFetchRequest } from "./ranking.mjs";

test("mocks a fetch function", async () => {
  const scope = nock("https://www.codewars.com")
    .get("/api/v1/users/someone")
    .reply(200, { username: "someone" });

  const response = await makeFetchRequest("someone");
  const parsedResponse = await response.json();

  assert.equal(parsedResponse.username, "someone");
  assert.equal(scope.isDone(), true, "No matching fetch request has been made");
});
