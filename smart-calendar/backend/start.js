const { spawn } = require('child_process');
const path = require('path');

// Ensure we're in the correct directory
process.chdir(__dirname);

// Start the application
const child = spawn('node', ['dist/server.js'], {
  stdio: 'inherit',
  env: { ...process.env }
});

child.on('error', (error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});

child.on('close', (code) => {
  console.log(`Application exited with code ${code}`);
  process.exit(code);
});