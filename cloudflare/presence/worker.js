const TTL=150000;
export class CultivatorPresence {
  constructor(ctx){
    this.sql=ctx.storage.sql;
    this.sql.exec('CREATE TABLE IF NOT EXISTS visitors (id TEXT PRIMARY KEY, seen INTEGER NOT NULL)');
  }
  async fetch(request){
    const now=Date.now();
    if(request.method==='POST'){
      let body;try{body=await request.json();}catch{return new Response('Invalid JSON',{status:400});}
      if(!/^[a-f0-9-]{36}$/i.test(body?.id||''))return new Response('Invalid visitor',{status:400});
      this.sql.exec('INSERT INTO visitors (id, seen) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET seen = excluded.seen',body.id,now);
    }
    this.sql.exec('DELETE FROM visitors WHERE seen <= ?',now-TTL);
    const {count}=this.sql.exec('SELECT COUNT(*) AS count FROM visitors WHERE seen > ?',now-TTL).one();
    return Response.json({count},{headers:{'Cache-Control':'no-store'}});
  }
}
export default {
  async fetch(request,env){
    if(new URL(request.url).pathname!=='/online')return new Response('Not found',{status:404});
    const origin=request.headers.get('Origin');
    const allowed=(env.ALLOWED_ORIGINS||'').split(',').map(s=>s.trim()).filter(Boolean);
    if(!origin||!allowed.includes(origin))return new Response('Forbidden',{status:403});
    const headers={'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'GET, POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Access-Control-Max-Age':'86400','Vary':'Origin','Cache-Control':'no-store'};
    if(request.method==='OPTIONS')return new Response(null,{status:204,headers});
    if(!['GET','POST'].includes(request.method))return new Response('Method not allowed',{status:405,headers});
    if(Number(request.headers.get('Content-Length'))>256)return new Response('Too large',{status:413,headers});
    try{
      const id=env.PRESENCE.idFromName('cultivators');
      const response=await env.PRESENCE.get(id).fetch(request);
      return new Response(response.body,{status:response.status,headers:{...headers,'Content-Type':response.headers.get('Content-Type')||'text/plain'}});
    }catch{return new Response('Temporarily unavailable',{status:503,headers});}
  }
};
