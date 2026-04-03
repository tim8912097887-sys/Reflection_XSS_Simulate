import { compare, genSalt, hash } from "bcrypt-ts";

/**
 * Hash a given password using bcrypt-ts.
 * @param {string} password The password to hash.
 * @param {number} [saltRound=10] The number of salt rounds to use.
 * @returns {Promise<string>} A promise that resolves to the hashed password.
 */
export const hashPassword = async (password: string, saltRound = 10) => {
  const salt = await genSalt(saltRound);
  const hashedPassword = await hash(password, salt);
  return hashedPassword;
};

/**
 * Compare a given password with a hashed password using bcrypt-ts.
 * @param {string} password The password to compare.
 * @param {string} hashedPassword The hashed password to compare with.
 * @returns {Promise<boolean>} A promise that resolves to true if the password matches the hashed password, false otherwise.
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string,
) => {
  const isMatch = await compare(password, hashedPassword);
  return isMatch;
};
