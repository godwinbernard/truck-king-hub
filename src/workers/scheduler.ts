import cron from 'node-cron';
import { runIngestion } from './jobs/ingest';
import { runReindex } from './jobs/reindex';
import { runLinkCheck } from './jobs/linkcheck';

let initialized = false;

export function startScheduler() {
  if (initialized) return;
  initialized = true;

  // Every 2 hours
  cron.schedule('0 */2 * * *', async () => {
    console.log('[scheduler] Running ingestion...');
    await runIngestion();
  });

  // Every 6 hours
  cron.schedule('0 */6 * * *', async () => {
    console.log('[scheduler] Running reindex...');
    await runReindex();
  });

  // Weekly Sunday 2am
  cron.schedule('0 2 * * 0', async () => {
    console.log('[scheduler] Running link check...');
    await runLinkCheck();
  });

  console.log('[scheduler] Jobs registered.');
}
