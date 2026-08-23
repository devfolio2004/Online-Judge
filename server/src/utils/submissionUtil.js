const statusMap = {
  3: "Accepted",
  4: "Wrong Answer",
  5: "Time Limit Exceeded",
  6: "Compilation Error",
  7: "Runtime Error",
  8: "Runtime Error",
  9: "Runtime Error",
  10: "Runtime Error",
  11: "Runtime Error",
  12: "Runtime Error",
  13: "Internal Error",
};

export const idToStatus = (statusId) => {
  return statusMap[statusId] || "Internal Error";
};

export const getJudgeError = (result) => {
  return result.stderr || result.compile_output || result.message || null;
};
