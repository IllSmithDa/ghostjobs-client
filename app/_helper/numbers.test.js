import {parseVal} from './numbers';
// Should return a string with the correct format for a positive number in the thousands
it('should return a string with the correct format for a positive number in the thousands', () => {
  expect(parseVal(1000)).toBe('1K');
  expect(parseVal(1500)).toBe('1.5K');
  expect(parseVal(9999)).toBe('9.9K');
});

// Should return a string with the correct format for a positive number in the millions
it('should return a string with the correct format for a positive number in the millions', () => {
  expect(parseVal(1000000)).toBe('1M');
  expect(parseVal(1500000)).toBe('1.5M');
  expect(parseVal(9999999)).toBe('9.9M');
});

// Should return a string with the correct format for a positive number in the billions
it('should return a string with the correct format for a positive number in the billions', () => {
  expect(parseVal(1000000000)).toBe('1B');
  expect(parseVal(1500000000)).toBe('1.5B');
  expect(parseVal(9999999999)).toBe('9.9B');
});

// Should return a string with the correct format for the number 0
it('should return a string with the correct format for the number 0', () => {
  expect(parseVal(0)).toBe('0');
});

it('should return a string with the correct format for the number -1000', () => {
  expect(parseVal(-1000)).toBe('-1K');
});

// Should return a string with the correct format for the number -999999999
it('should return a string with the correct format for the number -999999999', () => {
  expect(parseVal(-999999999)).toBe('-999.9M');
});