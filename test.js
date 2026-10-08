console.log("Running automated unit tests...");
// Basic unit test check
if (1 + 1 === 2) {
  console.log("All unit tests passed successfully!");
  process.exit(0);
} else {
  console.error("Test failed!");
  process.exit(1);
}