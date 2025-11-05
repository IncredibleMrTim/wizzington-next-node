#!/usr/bin/env node

/**
 * Plesk Node.js Entry Point
 * This script starts both Next.js and Express server
 */

const { spawn } = require('child_process');

console.log('Starting Wizz application...');
console.log('Current directory:', process.cwd());
console.log('Node version:', process.version);

let nextProcess;
let serverProcess;

// Start Next.js on port 3000
console.log('Starting Next.js on port 3000...');
nextProcess = spawn('yarn', ['start:next'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, PORT: '3000' }
});

// Start Express server on port 3001
console.log('Starting Express server on port 3001...');
serverProcess = spawn('yarn', ['start:server'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, PORT: '3001' }
});

// Handle Next.js process errors
nextProcess.on('error', (error) => {
  console.error('Next.js error:', error);
  if (serverProcess) serverProcess.kill();
  process.exit(1);
});

nextProcess.on('exit', (code, signal) => {
  console.log(`Next.js exited with code ${code} and signal ${signal}`);
  if (serverProcess) serverProcess.kill();
  process.exit(code || 1);
});

// Handle Express server process errors
serverProcess.on('error', (error) => {
  console.error('Express server error:', error);
  if (nextProcess) nextProcess.kill();
  process.exit(1);
});

serverProcess.on('exit', (code, signal) => {
  console.log(`Express server exited with code ${code} and signal ${signal}`);
  if (nextProcess) nextProcess.kill();
  process.exit(code || 1);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down...');
  if (nextProcess) nextProcess.kill('SIGTERM');
  if (serverProcess) serverProcess.kill('SIGTERM');
  setTimeout(() => process.exit(0), 1000);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down...');
  if (nextProcess) nextProcess.kill('SIGTERM');
  if (serverProcess) serverProcess.kill('SIGTERM');
  setTimeout(() => process.exit(0), 1000);
});
