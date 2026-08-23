import axios from "axios";

export const getLanguagebyId = (language) => {
  const languageMap = {
    "c++": 105,
    java: 91,
    javascript: 102,
    python: 113,
  };
  return languageMap[language];
};

export const submitBatch = async (submissions) => {
  const options = {
    method: "POST",
    url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
    params: {
      base64_encoded: "false",
    },
    headers: {
      "x-rapidapi-key": process.env.JUDGE0_API_KEY,
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    data: {
      submissions,
    },
  };

  async function fetchData() {
    const response = await axios.request(options);
    return response.data;
  }

  const result = await fetchData();
  return result;
};

const wait = (time) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};

export const submitTokens = async (tokenArray) => {
  const options = {
    method: "GET",
    url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
    params: {
      tokens: tokenArray.join(","),
      base64_encoded: "false",
      fields: "*",
    },
    headers: {
      "x-rapidapi-key": process.env.JUDGE0_API_KEY,
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      "Content-Type": "application/json",
    },
  };

  async function fetchData() {
    const response = await axios.request(options);
    return response.data;
  }

  const MAX_RETRIES = 20;

  for (let retry = 0; retry < MAX_RETRIES; retry++) {
    const result = await fetchData();
    const submissionArray = result.submissions;
    const isNotReady = submissionArray.some(({ status_id }) => status_id <= 2);
    if (!isNotReady) {
      return submissionArray;
    }
    await wait(500);
  }
  throw new Error("Judge0 execution timed out");
};
