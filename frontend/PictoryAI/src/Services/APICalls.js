const API_BASE_URL = "http://127.0.0.1:8000/api";

function getDefaultHeaders() {
  const token = localStorage.getItem("access_token");

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function handleResponse(response) {
  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      data?.message ||
      (data?.errors ? Object.values(data.errors)[0]?.[0] : null) ||
      "Request failed.";

    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export async function get(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "GET",
    headers: {
      ...getDefaultHeaders(),
      ...(options.headers || {}),
    },
  });

  return handleResponse(response);
}

export async function post(endpoint, body = {}, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      ...getDefaultHeaders(),
      ...(options.headers || {}),
    },
    body: JSON.stringify(body),
  });

  return handleResponse(response);
}

export async function put(endpoint, body = {}, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "PUT",
    headers: {
      ...getDefaultHeaders(),
      ...(options.headers || {}),
    },
    body: JSON.stringify(body),
  });

  return handleResponse(response);
}

export async function del(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "DELETE",
    headers: {
      ...getDefaultHeaders(),
      ...(options.headers || {}),
    },
  });

  return handleResponse(response);
}