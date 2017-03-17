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

export const fetchTodos = (fetch = defaultFetch) =>
  fetch("/api/todos").then(handleResponse);

export const addTodo =  (todo, fetch = defaultFetch) =>
  fetch("/api/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: todo.text })
  }).then(handleResponse);

export const toggleTodo =  (todo, fetch = defaultFetch) =>
  fetch(`/api/todos/${todo.id}`, {
    method: "PUT"
  }).then(handleResponse);
