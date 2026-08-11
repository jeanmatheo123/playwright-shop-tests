// Sauce Demo ships with a fixed set of accounts, each simulating a different
// bug class on purpose. Password is the same for all of them.
export const PASSWORD = "secret_sauce";

export const USERS = {
  standard: "standard_user",
  lockedOut: "locked_out_user",
  problem: "problem_user",
  performanceGlitch: "performance_glitch_user",
} as const;
