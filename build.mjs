import {readFileSync,writeFileSync,readdirSync,mkdirSync} from 'node:fs';
let d=JSON.parse(readFileSync('products.json','utf8'));
const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const url=s=>{try{const u=new URL(s);return u.protocol==='https:'?e(u.href):''}catch{return ''}};
const photoUrl=s=>/^\/assets\/products\/[a-z0-9-]+\.svg$/.test(s||'')?e(s):url(s);
const labels={buy:'🟢 사도 됨',pass:'🔴 지금은 PASS',wait:'🟡 기다림'};
const notices={toss:'✱ 이 포스팅은 토스쇼핑 쉐어링크 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.',coupang:'쿠팡파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받을 수 있습니다.'};
function card(p){
 if(!labels[p.status]||!Number.isFinite(p.price)||p.price<0)throw Error('Invalid product: '+p.name);
 const photo=photoUrl(p.image)?'<img class="photo" loading="lazy" width="90" height="90" src="'+photoUrl(p.image)+'" alt="'+e(p.name)+'" onerror="this.hidden=true">':'';
 const info=p.affiliate===false?'<strong class="info-deal">수수료 없는 정보딜 · 가격 좋아서 공유</strong>':'';
 const disclosure=p.affiliate===false?'':'<p class="affiliate">'+e(notices[p.platform])+'</p>';
 return '<article class="card '+e(p.status)+'"><span class="badge">'+e(labels[p.status])+'</span><div class="product-head">'+photo+'<h3>'+e(p.name)+'</h3><div class="config">'+e(p.configuration)+'</div><div class="price">'+p.price.toLocaleString('ko-KR')+'원</div><div class="unit">'+e(p.unit)+'</div></div>'+info+(p.comparison?'<div class="comparison"><strong>비교</strong><p>'+e(p.comparison)+'</p></div>':'')+'<div class="why"><strong>'+(p.status==='buy'?'왜 사도 됨?':p.status==='wait'?'왜 기다림?':'왜 지금은 PASS?')+'</strong>'+e(p.reason)+'</div><p class="muted">확인일 '+e(p.date)+'</p>'+disclosure+'<a class="buy-link" target="_blank" rel="'+(p.affiliate===false?'':'sponsored ')+'noopener noreferrer" href="'+url(p.link)+'">현재 가격 확인하기</a></article>';
}
const current=d;
const archives=readdirSync('archives').filter(f=>/^\d{4}-\d{2}-\d{2}\.json$/.test(f)).map(f=>JSON.parse(readFileSync('archives/'+f,'utf8')));
writeFileSync('archives/'+current.date+'.json',JSON.stringify(current,null,2)+'\n');
const all=[...archives.filter(a=>a.date!==current.date),current];
function render(data,historical=false){
 d=data;
 const ps=d.products;
 const top=(d.topDeals||[]).map(name=>ps.find(p=>p.name===name&&p.status==='buy')).filter(Boolean).slice(0,3);
 const date=d.date.split('-');
 const statuses=historical?['buy','wait','pass']:['buy','pass'];
 const counts='<h2>'+Number(date[1])+'/'+Number(date[2])+' 오늘 '+ps.length+'개 확인</h2><div class="counts">'+statuses.filter(s=>s!=='wait'||ps.some(p=>p.status===s)).map(s=>'<span>'+e(labels[s])+' '+ps.filter(p=>p.status===s).length+'개</span>').join('')+'</div>';
 let products='<section><h2 class="section-title">오늘의 TOP 3</h2><div class="top-grid">'+top.map(card).join('')+'</div></section>';
 const rest=ps.filter(p=>p.status==='buy'&&!top.includes(p));
 products+='<section><h2 class="section-title">🟢 오늘의 사도 됨</h2><p class="muted">TOP 3 포함 총 '+ps.filter(p=>p.status==='buy').length+'개 · 아래는 나머지 상품입니다.</p>'+rest.map(card).join('')+'</section>';
 for(const status of statuses.filter(s=>s!=='buy')){const group=ps.filter(p=>p.status===status);if(group.length)products+='<section><h2 class="section-title">'+e(labels[status])+'</h2>'+group.map(card).join('')+'</section>';}
 const list=all.filter(a=>a.date!==current.date).sort((a,b)=>b.date.localeCompare(a.date));
 const links='<section class="principles"><h2>📅 지난 가격판정</h2>'+list.map(a=>{const parts=a.date.split('-');return '<p>'+Number(parts[1])+'/'+Number(parts[2])+' · '+a.products.length+'개 확인 → 사도 됨 '+a.products.filter(p=>p.status==='buy').length+' / '+(a.products.some(p=>p.status==='wait')?'기다림 '+a.products.filter(p=>p.status==='wait').length:'PASS '+a.products.filter(p=>p.status==='pass').length)+'</p><a href="/'+a.date+'/">'+Number(parts[1])+'/'+Number(parts[2])+' 기록 보기 →</a>'}).join('')+'</section>';
 let html=readFileSync('page.template.html','utf8').replace('{{SUMMARY}}',counts).replaceAll('{{CHAT}}',url(current.chatUrl)).replace('{{PRODUCTS}}',products).replace('{{ARCHIVES}}',historical?'<p><a href="/">← 오늘의 가격판정 보기</a></p>':links);
 if(historical){html=html.replace('<header>','<p class="affiliate"><strong>'+Number(date[0])+'년 '+Number(date[1])+'월 '+Number(date[2])+'일 확인 당시 가격입니다. 현재 가격은 달라질 수 있습니다.</strong></p><header>').replaceAll('현재 가격 확인하기','현재 가격 다시 확인하기');}
 return html;
}
writeFileSync('index.html',render(current));
for(const a of all){mkdirSync(a.date,{recursive:true});writeFileSync(a.date+'/index.html',render(a,true));}
console.log('Built '+current.products.length+' current cards and '+all.length+' date archives');
