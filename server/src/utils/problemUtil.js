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
      base64_encoded: "true",
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
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  const result = await fetchData();
  return result;
};

const wait = (time) => {
  setTimeout(() => {
    return 1;
  }, time);
};

export const submitTokens = async (tokenArray) => {
  const options = {
    method: "GET",
    url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
    params: {
      tokens: tokenArray.join(","),
      base64_encoded: "true",
      fields: "*",
    },
    headers: {
      "x-rapidapi-key": "08c0361f98mshc3af568fe95c9cep1a4b9cjsn6ecac39b5f6c",
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      "Content-Type": "application/json",
    },
  };

  async function fetchData() {
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  const result = await fetchData();
  const submissionArray = result.submissions;
  while (true) {
    const isNotReady = submissionArray.some(({ status_id }) => status_id <= 2);
    if (isNotReady) {
      await wait(1000);
      continue;
    }
    return submissionArray;
  }
};
