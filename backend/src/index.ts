import { settings } from './core/config';
import app from './app';

const PORT = settings.port || process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`[server]: Server is running on port ${PORT}`);
});

server.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[server error]: Port ${PORT} is already in use by another process.`);
  } else {
    console.error(`[server error]: Failed to start server:`, err);
  }
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('[server error]: Uncaught exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('[server error]: Unhandled promise rejection:', reason);
});
