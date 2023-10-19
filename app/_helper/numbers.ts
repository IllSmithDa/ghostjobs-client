export const parseVal = (n:number) => {
  // acount for negative values
  let negVal = n < 0 ? '-': '';
  if (negVal === '-') n = Math.abs(n);

  if (n/1000000000 >= 1) {
    // turn the four digit numberin  a three digit number
    const digit = n - (Math.floor(n/1000000000) * 1000000000)
    // grab the second digit which is now the first digit
    const secondDigit = Math.floor(digit/100000000) 

    // checks if second var is value 0 which means it should have a decimal or the value after it
    return `${negVal}${Math.floor(n/1000000000)}${(secondDigit ? `.${secondDigit}`: '')}B`;
  }

  if (n/1000000 >= 1) {
    // turn the four digit numberin  a three digit number
    const digit = n - (Math.floor(n/1000000) * 1000000)
    // grab the second digit which is now the first digit
    const secondDigit = Math.floor(digit/100000) 

    // checks if second var is value 0 which means it should have a decimal or the value after it
    return `${negVal}${Math.floor(n/1000000)}${(secondDigit ? `.${secondDigit}`: '')}M`;
  }

  if (n / 1000 >= 1) {
    // turn the four digit numberin  a three digit number
    const digit = n - (Math.floor(n/1000) * 1000);

    // grab the second digit which is now the first digit
    const secondDigit = Math.floor(digit/100) 

    // checks if second var is value 0 which means it should have a decimal or the value after it
    return `${negVal}${Math.floor(n/1000)}${(secondDigit ? `.${secondDigit}`: '')}K`;
  }
  return `${negVal}${n}`;
}