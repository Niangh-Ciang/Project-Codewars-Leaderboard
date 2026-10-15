import test from "node:test";
import assert from "node:assert/strict";
import nock from "nock";
import { makeFetchRequest, getUsersWithLanguage } from "./ranking.mjs";

test("mocks a fetch function", async () => {
  const scope = nock("https://www.codewars.com")
    .get("/api/v1/users/someone")
    .reply(200, { username: "someone" });

  const response = await makeFetchRequest("someone");
  const parsedResponse = await response.json();

  assert.equal(parsedResponse.username, "someone");
  assert.equal(scope.isDone(), true, "No matching fetch request has been made");
});

const users = [
  {
    username: "Alice",
    ranks: {
      overall: { score: 1800 },
      languages: {
        javascript: { score: 900 },
        python: { score: 650 },
      },
    },
  },
  {
    username: "Bob",
    ranks: {
      overall: { score: 1200 },
      languages: {
        python: { score: 800 },
        java: { score: 500 },
      },
    },
  },
  {
    username: "Charlie",
    ranks: {
      overall: { score: 2100 },
      languages: {
        javascript: { score: 750 },
        java: { score: 950 },
        ruby: { score: 400 },
      },
    },
  },
  {
    username: "David",
    ranks: {
      overall: { score: 950 },
      languages: {
        javascript: { score: 300 },
        sql: { score: 100 },
      },
    },
  },
  {
    username: "Eve",
    ranks: {
      overall: { score: 0 },
      languages: {
        python: { score: 950 },
        sql: { score: 250 },
        go: { score: 600 },
      },
    },
  },
  {
    username: "Freddie",
    ranks: {
      overall: { score: 700 },
      languages: {},
    },
  },
];

test("getUsersWithLanguage returns users sorted by overall score", () => {
  const result = getUsersWithLanguage(users, "overall");
  const expectedOrder = ["Charlie", "Alice", "Bob", "David", "Freddie", "Eve"];
  const resultOrder = result.map((user) => user.username);
  assert.deepEqual(resultOrder, expectedOrder);
});

test("getUsersWithLanguage returns users sorted by JavaScript score", () => {
  const result = getUsersWithLanguage(users, "javascript");
  const expectedOrder = ["Alice", "Charlie", "David"];
  const resultOrder = result.map((user) => user.username);
  assert.deepEqual(resultOrder, expectedOrder);
});

test("getUsersWithLanguage returns users sorted by Python score", () => {
  const result = getUsersWithLanguage(users, "python");
  const expectedOrder = ["Eve", "Bob", "Alice"];
  const resultOrder = result.map((user) => user.username);
  assert.deepEqual(resultOrder, expectedOrder);
});

test("does not change the original array", () => {
  const originalUsers = users.map((user) => user.username);
  getUsersWithLanguage(users, "javascript");
  assert.deepEqual(
    users.map((user) => user.username),
    originalUsers,
  );
});

test("getUsersWithLanguage returns empty language for selected language", () => {
  const result = getUsersWithLanguage(users, "nonexistentLanguage");
  const expectedOrder = [];
  const resultOrder = result.map((user) => user.username);
  assert.deepEqual(resultOrder, expectedOrder);
});
