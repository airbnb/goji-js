import camelCase from 'lodash/camelCase';

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const pascalCase = (str: string) => capitalize(camelCase(str));
