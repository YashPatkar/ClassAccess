import api from "./api";

export const askAI = (code, question) => {
  return api.post("/ai/ask/", {
    code,
    question,
  });
};
