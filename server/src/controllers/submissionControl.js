import problemModel from '../models/problem.js';
import submissionModel from '../models/submissions.js';
import userModel from '../models/user.js';
import {getLanguagebyId, submitBatch, submitTokens,} from '../utils/problemUtil.js';
import {getJudgeError, idToStatus} from '../utils/submissionUtil.js';

export const saveSubmission = async (req, res) => {
  try {
    const userId = req.user._id;
    const problemId = req.params.id;
    const {code, language} = req.body;

    if (!code || !language) {
      return res.status(400).json({
        message: 'Code and language are required',
      });
    }

    const languageId = getLanguagebyId(language.toLowerCase());

    if (!languageId) {
      return res.status(400).json({
        message: 'Unsupported language',
      });
    }

    const problem = await problemModel.findById(problemId);

    if (!problem) {
      return res.status(404).json({
        message: 'Problem not found',
      });
    }

    const totalTestCases = problem.hiddenTestCases.length;

    const submissionDocument = await submissionModel.create({
      userId,
      problemId,
      code,
      language,
      status: 'Pending',
      totalTestCases,
    });

    const submissionArray =
        problem.hiddenTestCases.map(({input, output}) => ({
                                      source_code: code,
                                      language_id: languageId,
                                      stdin: input,
                                      expected_output: output,
                                    }));

    const tokenResult = await submitBatch(submissionArray);

    const tokenArray = tokenResult.map((element) => element.token);

    const finalResult = await submitTokens(tokenArray);

    let time = 0;
    let memory = 0;
    let testCasesPassed = 0;

    for (const singleTestCase of finalResult) {
      if (singleTestCase.status_id === 3) {
        time = Math.max(time, Number(singleTestCase.time) || 0);

        memory = Math.max(memory, Number(singleTestCase.memory) || 0);

        testCasesPassed++;
      } else {
        submissionDocument.status = idToStatus(singleTestCase.status_id);

        submissionDocument.errorMessage = getJudgeError(singleTestCase);

        break;
      }
    }

    if (testCasesPassed === totalTestCases) {
      submissionDocument.status = 'Accepted';

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

    return res.status(201).json({
      success: true,
      submission: submissionDocument,
    });
  } catch (err) {
    console.error('Submission failed:', err.message);

    return res.status(500).json({
      success: false,
      message: 'Submission processing failed',
    });
  }
};

export const getProblemSubmissions = async (req, res) => {
  try {
    const userId = req.user._id;
    const problemId = req.params.id;

    const submissions =
        await submissionModel
            .find({
              userId,
              problemId,
            })
            .select(
                '_id status language runtime memory testCasesPassed totalTestCases errorMessage createdAt')
            .sort({createdAt: -1})
            .limit(20)
            .lean();

    return res.status(200).json({
      success: true,
      submissions,
    });
  } catch (err) {
    console.error('Failed to fetch submissions:', err.message);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch submission history',
    });
  }
};