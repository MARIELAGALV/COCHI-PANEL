'use strict';

const http = require('node:http');

const ROUTES = new Set(['/get-yt.m3u8','/api/youtube/live.m3u8']);

function sendText(res,status,text){
  const body=Buffer.from(String(text||''),'utf8');
  res.writeHead(status,{
    'Content-Type':'text/plain; charset=utf-8',
    'Content-Length':body.length,
    'Cache-Control':'no-store, no-cache, must-revalidate, max-age=0',
    'Pragma':'no-cache',
    'X-Content-Type-Options':'nosniff'
  });
  res.end(body);
}

const originalCreateServer=http.createServer;
http.createServer=function(...args){
  const i=args.findIndex(x=>typeof x==='function');
  if(i>=0){
    const originalListener=args[i];
    args[i]=function(req,res){
      let u;try{u=new URL(req.url,'http://cochi.local');}catch{return originalListener(req,res);}
      if(ROUTES.has(u.pathname)&&u.searchParams.has('id')){
        const id=String(u.searchParams.get('id')||'').trim();
        if(!/^[A-Za-z0-9_-]{11}$/.test(id))return sendText(res,400,'ID de YouTube inválido');
        u.searchParams.delete('id');
        u.searchParams.set('ch',`https://www.youtube.com/watch?v=${id}`);
        req.url=u.pathname+'?'+u.searchParams.toString();
      }
      return originalListener(req,res);
    };
  }
  return originalCreateServer.apply(this,args);
};
