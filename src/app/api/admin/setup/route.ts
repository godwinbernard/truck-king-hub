// Setup complete — this endpoint is disabled.
export async function GET() {
  return new Response('Not found', { status: 404 });
}
