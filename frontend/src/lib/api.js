import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = BACKEND_URL ? `${BACKEND_URL.replace(/\/$/, "")}/api` : "/api";

export const api = axios.create({ baseURL: API, timeout: 45000 });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableApiError = (error) => {
  if (!error?.response) return true;
  return [408, 425, 429, 500, 502, 503, 504].includes(error.response.status);
};

export const postWithRetry = async (url, data, options = {}) => {
  const {
    retries = 1,
    retryDelayMs = 1800,
    timeout = 45000,
    ...axiosOptions
  } = options;

  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await api.post(url, data, { timeout, ...axiosOptions });
    } catch (error) {
      lastError = error;
      if (attempt >= retries || !isRetryableApiError(error)) break;
      await sleep(retryDelayMs);
    }
  }
  throw lastError;
};

export const warmBackend = () => {
  if (typeof window === "undefined") return;
  window.setTimeout(() => {
    api.get("/", { timeout: 30000 }).catch(() => {
      // Best-effort wake-up for cold Render instances.
    });
  }, 1000);
};

export const streamChat = async (sessionId, message, onDelta, onDone, onError) => {
  try {
    const res = await fetch(`${API}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, message }),
    });
    if (!res.ok || !res.body) throw new Error(`Chat request failed (${res.status})`);
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const parts = buf.split("\n\n");
      buf = parts.pop() || "";
      for (const p of parts) {
        const line = p.trim();
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (payload === "[DONE]") continue;
        try {
          const obj = JSON.parse(payload);
          if (obj.delta) onDelta(obj.delta);
          if (obj.error && onError) onError(obj.error);
        } catch (_) { /* ignore */ }
      }
    }
    onDone && onDone();
  } catch (e) {
    onError && onError(e.message || String(e));
  }
};
