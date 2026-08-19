import validator from "validator";

const validate = (data) => {
  const mandatoryFields = [
    "firstName",
    "lastName",
    "email",
    "password",
    "userName",
  ];
  const inputFields = Object.keys(data);
  const isAllowed = mandatoryFields.every((ele) => inputFields.includes(ele));
  if (!isAllowed) {
    throw new Error("Mandatory fields are missing!");
  }
  if (!validator.isEmail(data.email)) {
    throw new Error("Please enter a valid Email!");
  }
  if (!validator.isStrongPassword(data.password)) {
    throw new Error("Please enter a strong password!");
  }
};

export default validate;
