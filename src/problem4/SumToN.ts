
// using loop method
// time complexity = O(n)
// space complexity - O(1)
export function solution1(n: number): number {
  if (n < 1) {
    return 0;
  }

  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}


// using recursive method
// time complexity of each function invoke = O(1), total will be O(n)
// space complexity, each function invoke store in call stack then will be O(n)
export function solution2(n: number): number {
  if (n < 1) {
    return 0;
  }

  return n + solution2(n - 1);
}

// using arithmetic operations
// time complexity due to using arithmetic, which run in constant time. O(1)
// space complexity no recursive as well as data structure then O(1)
export function solution3(n: number): number {
  if (n < 1) {
    return 0;
  }

  const isOdd = n % 2 !== 0;
  const halfN = n / 2;

  return isOdd ? n * (halfN + 0.5) : n * halfN + halfN;
}
