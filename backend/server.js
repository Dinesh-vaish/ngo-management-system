'use strict';
require('dotenv').config();
const app       = require('./app');
const connectDB = require('./config/db');
const PORT      = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log('');
    console.log('  ╔══════════════════════════════════════════╗');
    console.log('  ║       MANARA-NEXUS BACKEND SERVER        ║');
    console.log('  ╠══════════════════════════════════════════╣');
    console.log(`  ║  API     →  http://localhost:${PORT}/api      ║`);
    console.log(`  ║  Docs    →  http://localhost:${PORT}/api/docs ║`);
    console.log(`  ║  Health  →  http://localhost:${PORT}/api/health║`);
    console.log(`  ║  DB      →  MongoDB :27017               ║`);
    console.log('  ╚══════════════════════════════════════════╝');
    console.log('');
  });
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  process.exit(1);
});
