import * as client from "../lib/api.client.v1";
import { expect } from "chai";
import { stub, match } from "sinon";

describe("api client v1", () => {
  let fakeFetch;

  beforeEach(() => {
    fakeFetch = stub();
  });

  describe("fetchTodos()", () => {
    it("retrieves a list of todos from the api", () => {
      const fakeResponse = Promise.resolve({
        status: 200,
        json: () => Promise.resolve([{
          id: "1",
          text: "walk the dog",
          done: false
        }])
      });

      fakeFetch.withArgs("/api/todos").returns(fakeResponse); 

      return client.fetchTodos(fakeFetch).then(todos => {
        expect(todos).deep.eq([{
          id: "1",
          text: "walk the dog",
          done: false
        }]);
      });
    });
  });

  describe("addTodo()", () => {
    it("creates a new todo successfully", () => {
      const requestData = match
        .has("method", "POST")
        .and(match.has("headers"))
        .and(match.has("body", JSON.stringify({ text: "wash dishes" })));

      const fakeResponse = Promise.resolve({
        status: 202,
        json: () => Promise.resolve({
          id: "2",
          text: "wash dishes",
          done: false
        })
      });

      fakeFetch.withArgs("/api/todos", requestData).returns(fakeResponse); 

      return client.addTodo({ text: "wash dishes" }, fakeFetch).then(todo => {
        expect(todo).deep.eq({
          id: "2",
          text: "wash dishes",
          done: false
        });
      });
    });

    it("results in errors when trying to create a todo with bad data", () => {
      const requestData = match
        .has("method", "POST")
        .and(match.has("headers"))
        .and(match.has("body", JSON.stringify({ text: "" })));

      const fakeResponse = Promise.resolve({
        status: 400,
        json: () => Promise.resolve([
          "Text description must be present."
        ])
      });

      fakeFetch.withArgs("/api/todos", requestData).returns(fakeResponse); 

      return client.addTodo({ text: "" }, fakeFetch).catch(errors => {
        expect(errors).deep.eq([
          "Text description must be present."
        ]);
      });
    });
  });

  describe("toggleTodo()", () => {
    it("toggles an existing todo successfully", () => {
      const fakeResponse = Promise.resolve({
        status: 202,
        json: () => Promise.resolve({
          id: "1",
          text: "walk the dog",
          done: true
        })
      });

      fakeFetch.withArgs("/api/todos/1").returns(fakeResponse); 

      return client.toggleTodo({ id: "1" }, fakeFetch).then(todo => {
        expect(todo).deep.eq({
          id: "1",
          text: "walk the dog",
          done: true
        });
      });
    });

    it("results in errors when todo is not found", () => {
      const fakeResponse = Promise.resolve({
        status: 404,
        json: () => Promise.resolve([
          "Todo not found."
        ])
      });

      fakeFetch.withArgs("/api/todos/3").returns(fakeResponse); 

      return client.toggleTodo({ id: "3" }, fakeFetch).catch(errors => {
        expect(errors).deep.eq([
          "Todo not found."
        ]);
      });
    });
  });
});

