import "server-only";

const DEFAULT_BACKEND_PREDICT_URL = "http://127.0.0.1:8000/predict";

export const getBackendPredictUrl = () =>
  process.env.BACKEND_PREDICT_URL ?? DEFAULT_BACKEND_PREDICT_URL;
