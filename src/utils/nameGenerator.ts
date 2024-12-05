import { uniqueNamesGenerator, Config, adjectives, colors, animals } from 'unique-names-generator';

const customConfig: Config = {
  dictionaries: [adjectives, colors, animals],
  separator: '',
  style: 'capital',
  length: 3,
};

export const generateRandomName = (): string => {
  return uniqueNamesGenerator(customConfig);
};