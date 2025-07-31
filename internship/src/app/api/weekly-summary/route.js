export async function POST(req) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: 'No userId provided' }), { status: 400 });
    }

    const res = await fetch('https://primary-production-9def0.up.railway.app/webhook/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });

    if (!res.ok) {
      const err = await res.text(); // Get response body to debug
      console.error('Webhook error:', err);
      return new Response(JSON.stringify({ error: 'Failed to fetch summary' }), { status: 500 });
    }

    const result = await res.json(); // Just get it as-is
    return new Response(JSON.stringify(result), { status: 200 });


  } catch (err) {
    console.error('API error:', err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}


