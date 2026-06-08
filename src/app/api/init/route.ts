import { startScheduler } from '@/workers/scheduler';
startScheduler();

export function GET() {
  return new Response('OK');
}
