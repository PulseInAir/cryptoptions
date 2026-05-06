// Delta Exchange India public API proxy
// Avoids CORS, normalizes responses for the frontend.
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

const BASE = 'https://api.india.delta.exchange/v2';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action') ?? 'tickers';

    let upstream = '';
    if (action === 'tickers') {
      // contract_types: call_options,put_options ; underlying_asset_symbols: BTC,ETH
      const contractTypes = url.searchParams.get('contract_types') ?? 'call_options,put_options';
      const underlying = url.searchParams.get('underlying_asset_symbols') ?? 'BTC';
      upstream = `${BASE}/tickers?contract_types=${encodeURIComponent(contractTypes)}&underlying_asset_symbols=${encodeURIComponent(underlying)}&page_size=1000`;
      // Paginate through all results
      const all: any[] = [];
      let next: string | null = upstream;
      let lastMeta: any = null;
      while (next) {
        const rr = await fetch(next, { headers: { 'Accept': 'application/json' } });
        if (!rr.ok) {
          const txt = await rr.text();
          return new Response(txt, { status: rr.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        const j = await rr.json();
        if (Array.isArray(j.result)) all.push(...j.result);
        lastMeta = j.meta ?? null;
        const after = j?.meta?.after;
        if (after) {
          const u2 = new URL(upstream);
          u2.searchParams.set('after', after);
          next = u2.toString();
        } else { next = null; }
      }
      return new Response(JSON.stringify({ success: true, result: all, meta: lastMeta }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3' },
      });
    } else if (action === 'spot') {
      const symbols = url.searchParams.get('symbols') ?? 'BTCUSD,ETHUSD';
      upstream = `${BASE}/tickers?contract_types=spot&symbols=${encodeURIComponent(symbols)}`;
    } else if (action === 'products') {
      const contractTypes = url.searchParams.get('contract_types') ?? 'call_options,put_options';
      const underlying = url.searchParams.get('underlying_asset_symbols') ?? 'BTC';
      upstream = `${BASE}/products?contract_types=${encodeURIComponent(contractTypes)}&underlying_asset_symbols=${encodeURIComponent(underlying)}&states=live`;
    } else if (action === 'ticker') {
      const symbol = url.searchParams.get('symbol');
      if (!symbol) {
        return new Response(JSON.stringify({ error: 'symbol required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      upstream = `${BASE}/tickers/${encodeURIComponent(symbol)}`;
    } else {
      return new Response(JSON.stringify({ error: 'unknown action' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const r = await fetch(upstream, { headers: { 'Accept': 'application/json' } });
    const text = await r.text();
    return new Response(text, {
      status: r.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3' },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown error';
    return new Response(JSON.stringify({ error: msg }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
