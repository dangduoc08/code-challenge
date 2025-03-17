import { solution1, solution2, solution3 } from "./SumToN";

test("Solution 1 with odd: input = 5, output = 15", () => {
  expect(solution1(5)).toBe(15);
});

test("Solution 1 with even: input = 6, output = 21", () => {
  expect(solution1(6)).toBe(21);
});

test("Solution 2 with odd: input = 5, output = 15", () => {
  expect(solution2(5)).toBe(15);
});

test("Solution 2 with even: input = 6, output = 21", () => {
  expect(solution2(6)).toBe(21);
});

test("Solution 3 with odd: input = 5, output = 15", () => {
  expect(solution3(5)).toBe(15);
});

test("Solution 3 with even: input = 6, output = 21", () => {
  expect(solution3(6)).toBe(21);
});
