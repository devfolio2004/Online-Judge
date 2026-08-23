import problemModel from "../models/problem";
import {
  getLanguagebyId,
  submitBatch,
  submitTokens,
} from "../utils/problemUtil.js";
import { idToStatus, getJudgeError } from "../utils/submissionUtil.js";
import submissionModel from "../models/submissions.js";
import userModel from "../models/user.js";

export const saveSubmission = async (req, res) => {
  try {
    const userId = req.user._id;
    const problemId = req.params.id;
    const { code, language } = req.body;
    if (!languageId) {
      throw new Error("Unsupported language");
    }
    const problem = await problemModel.findById(problemId);
    if (!problem) {
      throw new Error("Problem not found");
    }
    const totalTestCases = problem.hiddenTestCases.length;
    const submissionDocument = await submissionModel.create({
      userId,
      problemId,
      code,
      language,
      status: "Pending",
      totalTestCases,
    });
    const languageId = getLanguagebyId(language.toLowerCase());
    const submissionArray = problem.hiddenTestCases.map(
      ({ input, output }) => ({
        source_code: code,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }),
    );
    const tokenResult = await submitBatch(submissionArray);
    const tokenArray = tokenResult.map((ele) => ele.token);
    const finalResult = await submitTokens(tokenArray);
    let time = 0;
    let memory = 0;
    let testCasesPassed = 0;
    for (const singleTestCase of finalResult) {
      if (singleTestCase.status_id === 3) {
        time = Math.max(time, Number(singleTestCase.time));
        memory = Math.max(memory, singleTestCase.memory);
        testCasesPassed++;
      } else {
        submissionDocument.status = idToStatus(singleTestCase.status_id);
        submissionDocument.errorMessage = getJudgeError(singleTestCase);
        break;
      }
    }
    if (testCasesPassed === totalTestCases) {
      submissionDocument.status = "Accepted";
      await userModel.findByIdAndUpdate(userId, {
        $addToSet: {
          problemsSolved: problemId,
        },
      });
    }
    submissionDocument.runtime = time;
    submissionDocument.memory = memory;
    submissionDocument.testCasesPassed = testCasesPassed;
    await submissionDocument.save();
    res.status(201).send(submissionDocument);
  } catch (err) {
    res.status(400).json({ "Error: ": err.message });
  }
};
