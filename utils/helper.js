export const assertValueExists = (value, error) => {
  if (!value) {
    throw new Error(error);
  }
};
