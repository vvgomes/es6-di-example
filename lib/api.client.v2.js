import defaultFetch from "isomorphic-fetch";
import { contains } from "ramda";

const isSuccess = res =>
  contains(res.status)([200, 202]);

const handleResponse = res => 
  res.json().then(data => {
    if (isSuccess(res))
      return data;
    else
      throw data;
  });

const createApiClient = (fetch = defaultFetch) => ({
  fetchTodos: () =>
    fetch("/api/todos").then(handleResponse),

  addTodo: todo =>
    fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: todo.text })
    }).then(handleResponse),

  toggleTodo: todo =>
    fetch(`/api/todos/${todo.id}`, {
      method: "PUT"
    }).then(handleResponse)
});

export default createApiClient;
