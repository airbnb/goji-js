import camelCase from 'lodash/camelCase';

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const pascalCase = (str: string) => {
  return capitalize(camelCase(str));
};
