#!/usr/bin/env node

/**
 * Plesk Node.js Entry Point
 * This script starts both Next.js and Express server using PM2
 */

const { exec } = require('child_process');
const path = require('path');

console.log('Starting Wizz application with PM2...');
console.log('Current directory:', process.cwd());
console.log('Node version:', process.version);

// Stop any existing PM2 processes
exec('pm2 delete all', (error) => {
  if (error) {
    console.log('No existing PM2 processes to delete');
  }

  // Start PM2 with ecosystem config
  const pm2Command = 'pm2 start ecosystem.config.js --no-daemon';

  console.log('Executing:', pm2Command);

  const pm2Process = exec(pm2Command, (error, stdout, stderr) => {
    if (error) {
      console.error('Error starting PM2:', error);
      process.exit(1);
    }
    if (stderr) {
      console.error('PM2 stderr:', stderr);
    }
    console.log('PM2 stdout:', stdout);
  });

  // Forward PM2 output to console
  pm2Process.stdout.on('data', (data) => {
    process.stdout.write(data);
  });

  pm2Process.stderr.on('data', (data) => {
    process.stderr.write(data);
  });

  pm2Process.on('exit', (code) => {
    console.log(`PM2 process exited with code ${code}`);
    process.exit(code);
  });
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Received SIGINT, stopping PM2...');
  exec('pm2 stop all', () => {
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, stopping PM2...');
  exec('pm2 stop all', () => {
    process.exit(0);
  });
});
