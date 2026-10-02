import {readFileSync,writeFileSync,readdirSync,mkdirSync} from 'node:fs';
const current=JSON.parse(readFileSync('products.json','utf8'));
const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const url=s=>{try{const u=new URL(s);return u.protocol==='https:'?e(u.href):''}catch{return ''}};
const photoUrl=s=>/^\/assets\/products\/[a-z0-9-]+\.svg$/.test(s||'')?e(s):url(s);
const labels={buy:'🟢 사도 됨',pass:'🔴 지금은 PASS'};
const notices={toss:'✱ 이 포스팅은 토스쇼핑 쉐어링크 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.',coupang:'쿠팡파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받을 수 있습니다.'};
mkdirSync('archives',{recursive:true});
const archives=readdirSync('archives').filter(f=>/^\d{4}-\d{2}-\d{2}\.json$/.test(f)).map(f=>JSON.parse(readFileSync('archives/'+f,'utf8')));
writeFileSync('archives/'+current.date+'.json',JSON.stringify(current,null,2)+'\n');
const all=[...archives.filter(a=>a.date!==current.date),current];
function card(p,date,historical){
 const status=p.status==='buy'?'buy':'pass';
 if(!Number.isFinite(p.price)||p.price<0)throw Error('Invalid price: '+p.name);
 const photo=photoUrl(p.image)?'<img class="photo" loading="lazy" width="90" height="90" src="'+photoUrl(p.image)+'" alt="'+e(p.name)+'" onerror="this.hidden=true">':'';
 const parts=date.split('-');
 const open=p.midnightOpen===true;
 const badge=open?'<span class="open-badge">⏰ '+Number(parts[1])+'/'+Number(parts[2])+' 00:00 OPEN</span>':'';
 const facts=p.priceFacts||[p.unit,p.comparison].filter(Boolean).map(s=>s.replace(/[^·]*가격 비교[^·]*표시\s*·?\s*/g,'').trim()).filter(Boolean);
 const info=p.affiliate===false?'<strong class="info-deal">수수료 없는 정보딜 · 가격 좋아서 공유</strong>':'';
 const disclosure=p.affiliate===false?'':'<p class="affiliate">'+e(notices[p.platform]||'')+'</p>';
 const button=historical?'현재 가격 다시 확인하기':open?'⏰ 00:00 가격 확인하기':'현재 가격 확인하기';
 const action=url(p.link)?'<a class="buy-link" target="_blank" rel="'+(p.affiliate===false?'':'sponsored ')+'noopener noreferrer" href="'+url(p.link)+'">'+button+'</a>':'';
 return '<article class="card '+status+'"><span class="badge">'+labels[status]+'</span>'+badge+'<div class="product-head">'+photo+'<h3>'+e(p.name)+'</h3>'+(p.configuration?'<div class="config">'+e(p.configuration)+'</div>':'')+'<div class="price">'+p.price.toLocaleString('ko-KR')+'원</div></div><div class="price-facts"><strong>💸 가격 한눈에</strong>'+facts.map(s=>'<p>'+e(s)+'</p>').join('')+'</div>'+info+action+disclosure+'</article>';
}
function render(data,historical=false){
 const ps=data.products;
 const [year,month,day]=data.date.split('-').map(Number);
 const top=(data.topDeals||[]).map(n=>ps.find(p=>p.name===n&&p.status==='buy')).filter(Boolean).slice(0,3);
 const count=ps.filter(p=>p.status==='buy').length;
 const open=ps.filter(p=>p.midnightOpen===true).length;
 const summary='<h2>'+month+'/'+day+' 오늘의 가격판정</h2><p class="total">'+ps.length+'개 확인</p><div class="counts"><span>🟢 사도 됨 '+count+'개</span><span>🔴 지금은 PASS '+(ps.length-count)+'개</span></div>'+(open?'<p class="open-count">⏰ 오늘 00:00 오픈 상품 '+open+'개</p>':'');
 let products='<section><h2 class="section-title">오늘의 TOP 3</h2><div class="top-grid">'+top.map(p=>card(p,data.date,historical)).join('')+'</div></section>';
 products+='<section><h2 class="section-title">'+month+'/'+day+' 🟢 사도 됨</h2><p class="muted">TOP 3 포함 총 '+count+'개 · 아래는 나머지 상품입니다.</p>'+ps.filter(p=>p.status==='buy'&&!top.includes(p)).map(p=>card(p,data.date,historical)).join('')+'</section>';
 products+='<section><h2 class="section-title">🔴 지금은 PASS</h2>'+ps.filter(p=>p.status!=='buy').map(p=>card(p,data.date,historical)).join('')+'</section>';
 const list=all.filter(a=>a.date!==current.date).sort((a,b)=>b.date.localeCompare(a.date));
 const archiveLinks='<section class="principles"><h2>📅 지난 가격판정</h2>'+list.map(a=>{const [,m,d]=a.date.split('-').map(Number);return '<p><a href="/'+a.date+'/">'+m+'/'+d+' 가격판정 보기 →</a></p>'}).join('')+'</section>';
 let html=readFileSync('page.template.html','utf8').replace('{{SUMMARY}}',summary).replace('{{PRODUCTS}}',products).replace('{{ARCHIVES}}',historical?'<p><a href="/">← 최신 가격판정 보기</a></p>':archiveLinks).replaceAll('{{CHAT}}',url(current.chatUrl));
 if(historical)html=html.replace('<header>','<p class="affiliate"><strong>'+year+'년 '+month+'월 '+day+'일 확인 당시 가격입니다. 현재 가격은 달라질 수 있습니다.</strong></p><header>');
 return html;
}
writeFileSync('index.html',render(current));
for(const data of all){mkdirSync(data.date,{recursive:true});writeFileSync(data.date+'/index.html',render(data,true));}
console.log('Built '+current.products.length+' products and '+all.length+' dated pages');
