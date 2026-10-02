import {readFileSync,writeFileSync} from 'node:fs';
const d=JSON.parse(readFileSync('products.json','utf8'));
const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const url=s=>{try{const u=new URL(s);return u.protocol==='https:'?e(u.href):''}catch{return ''}};
const photoUrl=s=>/^\/assets\/products\/[a-z0-9-]+\.svg$/.test(s||'')?e(s):url(s);
const labels={buy:'🟢 사도 됨',pass:'🔴 지금은 PASS'};
const notices={toss:'✱ 이 포스팅은 토스쇼핑 쉐어링크 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.',coupang:'쿠팡파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받을 수 있습니다.'};
function card(p){
 if(!labels[p.status]||!Number.isFinite(p.price)||p.price<0)throw Error('Invalid product: '+p.name);
 const photo=photoUrl(p.image)?'<img class="photo" loading="lazy" width="90" height="90" src="'+photoUrl(p.image)+'" alt="'+e(p.name)+'" onerror="this.hidden=true">':'';
 const info=p.affiliate===false?'<strong class="info-deal">수수료 없는 정보딜 · 가격 좋아서 공유</strong>':'';
 const disclosure=p.affiliate===false?'':'<p class="affiliate">'+e(notices[p.platform])+'</p>';
 return '<article class="card '+e(p.status)+'"><span class="badge">'+e(labels[p.status])+'</span><div class="product-head">'+photo+'<h3>'+e(p.name)+'</h3><div class="config">'+e(p.configuration)+'</div><div class="price">'+p.price.toLocaleString('ko-KR')+'원</div><div class="unit">'+e(p.unit)+'</div></div>'+info+(p.comparison?'<div class="comparison"><strong>비교</strong><p>'+e(p.comparison)+'</p></div>':'')+'<div class="why"><strong>'+(p.status==='buy'?'왜 사도 됨?':'왜 지금은 PASS?')+'</strong>'+e(p.reason)+'</div><p class="muted">확인일 '+e(p.date)+'</p>'+disclosure+'<a class="buy-link" target="_blank" rel="'+(p.affiliate===false?'':'sponsored ')+'noopener noreferrer" href="'+url(p.link)+'">현재 가격 확인하기</a></article>';
}
const ps=d.products;
const top=(d.topDeals||[]).map(name=>ps.find(p=>p.name===name&&p.status==='buy')).filter(Boolean).slice(0,3);
const date=d.date.split('-');
const summary='<h2>'+Number(date[1])+'/'+Number(date[2])+' 오늘 '+ps.length+'개 가격판정</h2><div class="counts">'+['buy','pass'].map(s=>'<span>'+e(labels[s])+' '+ps.filter(p=>p.status===s).length+'개</span>').join('')+'</div>';
let products='<section><h2 class="section-title">오늘의 TOP 3</h2><div class="top-grid">'+top.map(card).join('')+'</div></section>';
const rest=ps.filter(p=>p.status==='buy'&&!top.includes(p));
products+='<section><h2 class="section-title">🟢 오늘의 사도 됨</h2><p class="muted">TOP 3 포함 총 '+ps.filter(p=>p.status==='buy').length+'개 · 아래는 나머지 상품입니다.</p>'+rest.map(card).join('')+'</section>';
const pass=ps.filter(p=>p.status==='pass');
products+='<section><h2 class="section-title">🔴 지금은 PASS</h2>'+pass.map(card).join('')+(pass.length?'':'<p class="muted">오늘 등록한 상품 중 PASS 판정은 없습니다.</p>')+'</section>';
writeFileSync('index.html',readFileSync('page.template.html','utf8').replace('{{SUMMARY}}',summary).replaceAll('{{CHAT}}',url(d.chatUrl)).replace('{{PRODUCTS}}',products));
console.log('Built '+ps.length+' static cards');
