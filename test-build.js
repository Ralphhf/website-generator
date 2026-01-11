// Test script to generate website files and attempt to build
const fs = require('fs');
const path = require('path');

// Import the generator (we'll need to transpile it first)
// For now, let's just create a minimal test

const testDir = path.join(__dirname, 'test-generated-site');

// Clean and create directory
if (fs.existsSync(testDir)) {
  fs.rmSync(testDir, { recursive: true });
}
fs.mkdirSync(testDir, { recursive: true });

console.log('Test directory created at:', testDir);
console.log('To test the build:');
console.log('1. Run the website generator');
console.log('2. Copy the generated files to test-generated-site/');
console.log('3. Run: cd test-generated-site && npm install && npm run build');
