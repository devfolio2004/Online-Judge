import {
  getLanguagebyId,
  submitBatch,
  submitTokens,
} from "../utils/problemUtil.js";
import problemModel from "../models/problem.js";

export const createProblem = async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      tags,
      visibleTestCases,
      hiddenTestCases,
      boilerPlate,
      editorialCode,
    } = req.body;
    if (
      !title ||
      !description ||
      !difficulty ||
      !tags ||
      !visibleTestCases ||
      !hiddenTestCases ||
      !boilerPlate ||
      !editorialCode
    ) {
      throw new Error("Required Fields are missing!");
    }
    for (const { language, completeCode } of editorialCode) {
      const languageId = getLanguagebyId(language.toLowerCase());
      const submissions = visibleTestCases.map(({ input, output }) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));
      const tokenResult = await submitBatch(submissions);
      const tokenArray = tokenResult.map((ele) => ele.token);
      const finalResult = await submitTokens(tokenArray);
      const hasError = finalResult.some(({ status_id }) => status_id > 3);
      if (hasError) {
        return res.status(400).send("Error occured!");
      }
    }
    const problem = await problemModel.create({
      ...req.body,
      problemCreator: req.user._id,
    });
    res.send("Problem added successfully!");
  } catch (err) {
    res.status(201).json({ "Error: ": err.message });
  }
};

export const updateProblem = async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      tags,
      visibleTestCases,
      hiddenTestCases,
      boilerPlate,
      editorialCode,
    } = req.body;
    const { id } = req.params;
    if (!id) {
      throw new Error("id is missing!");
    }
    const problemDocument = await problemModel.findById(id);
    if (!problemDocument) {
      throw new Error("No such problem exists!");
    }
    if (
      !title ||
      !description ||
      !difficulty ||
      !tags ||
      !visibleTestCases ||
      !hiddenTestCases ||
      !boilerPlate ||
      !editorialCode
    ) {
      throw new Error("Required Fields are missing!");
    }
    for (const { language, completeCode } of editorialCode) {
      const languageId = getLanguagebyId(language.toLowerCase());
      const submissions = visibleTestCases.map(({ input, output }) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));
      const tokenResult = await submitBatch(submissions);
      const tokenArray = tokenResult.map((ele) => ele.token);
      const finalResult = await submitTokens(tokenArray);
      const hasError = finalResult.some(({ status_id }) => status_id > 3);
      if (hasError) {
        return res.status(400).send("Error occured!");
      }
    }
    const updatedProblem = await problemModel.findByIdAndUpdate(
      id,
      { ...req, body },
      { runValidators: true, new: true },
    );
    res.status(400).send(`Problem ${id} updated successfully!`);
  } catch (err) {
    res.status(404).json({ "Error: ": err.message });
  }
};

export const deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error("id is missing!");
    }
    const deletedProblem = await problemModel.findByIdAndDelete(id);
    if (!deleteProblem) {
      throw new Error("No such problem exists!");
    }
    res.send(`Problem ${id} deleted successfully!`);
  } catch (err) {
    res.status(201).json({ "Error: ": err.message });
  }
};

export const fetchOneProblem = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error("id is missing!");
    }
    const fetchedProblem = await problemModel.findById(id);
    if (!fetchedProblem) {
      throw new Error("No such problem exists!");
    }
    res.send(fetchedProblem);
  } catch (err) {
    res.status(201).json({ "Error: ": err.message });
  }
};
