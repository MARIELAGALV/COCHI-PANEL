import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const dir=mkdtempSync(join(tmpdir(),'cochi-external-'));
const cli=fileURLToPath(new URL('../tools/external-series-pack.mjs',import.meta.url));
const key=join(dir,'private.key'),out=join(dir,'release'),input=join(dir,'backup.json');
function run(...args){return spawnSync(process.execPath,[cli,...args],{encoding:'utf8'});}
test('encrypts, verifies, and refuses wrong key; no plaintext leaks into assets',()=>{
 const fixture={catalog:{series_count:2},verification:{sample_results:[{series_name:'other'}]},series:[
  {name:'Serie Uno',seasons:[{season_number:1,asset:{posterList:[{fileType:'icon',fileUrl:'https://test.invalid/poster.jpg'}]},chapters:[
   {chapter_number:1,sources:[{original_url:'https://test.invalid/one.mp4'}],subtitles:[{url:'https://test.invalid/one.srt',language:'es'}]},
   {chapter_number:2,sources:[],subtitles:[]}]}]},
  {name:'Serie Dos',seasons:[{season_number:2,chapters:[{chapter_number:4,sources:[{original_url:'http://test.invalid/two.ts'}]}]}]}
 ]};
 writeFileSync(input,JSON.stringify(fixture));
 assert.equal(run('keygen','--key-file',key).status,0);
 const result=run('pack','--input',input,'--out',out,'--key-file',key,'--shard-series','10');
 assert.equal(result.status,0,result.stderr);
 const m=JSON.parse(readFileSync(join(out,'series-manifest.json'),'utf8'));
 assert.equal(m.series,2);assert.equal(m.episodes,2);assert.equal(m.missingSource,1);
 for(const f of readdirSync(out)){const bytes=readFileSync(join(out,f));assert.equal(bytes.includes('one.mp4'),false);assert.equal(bytes.includes('Serie Uno'),false);}
 const v=run('verify','--out',out,'--key-file',key);assert.equal(v.status,0,v.stderr);
 const bad=join(dir,'bad.key');writeFileSync(bad,'0'.repeat(64)+'\n');
 assert.notEqual(run('verify','--out',out,'--key-file',bad).status,0);
});
