import {readFileSync,writeFileSync} from 'node:fs';
const d=JSON.parse(readFileSync('products.json','utf8'));
const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const url=s=>{try{const u=new URL(s);return u.protocol==='https:'?e(u.href):''}catch{return ''}};
const labels={buy:'🟢 사도 됨',wait:'🟡 조금 기다림',pass:'🔴 오늘은 PASS',hold:'⚪ 판정 보류'};
function card(p){
 if(!Number.isFinite(p.price)||p.price<0)throw Error('Invalid price: '+p.name);
 const photo=url(p.image)?'<img class="photo" loading="lazy" src="'+url(p.image)+'" alt="'+e(p.name)+'">':'<div class="photo placeholder" aria-label="상품 사진 준비 중">📦</div>';
 return '<article class="card '+e(p.status)+'"><span class="badge">'+e(labels[p.status]||labels.hold)+'</span><div class="product-head">'+photo+'<div><h3>'+e(p.name)+'</h3><div class="config">'+e(p.configuration)+'</div><div class="price">'+p.price.toLocaleString('ko-KR')+'원</div><div class="unit">'+e(p.unit)+'</div></div></div><div class="comparison"><strong>비교 근거</strong><p>'+e(p.comparison||'비교 근거 확인 중')+'</p></div><div class="why"><strong>'+ (p.status==='buy'?'왜 사도 됨?':'왜 이 판정?')+'</strong>'+e(p.reason)+'</div><p class="muted">확인일 '+e(p.date)+'</p>'+(url(p.link)?'<a class="buy-link" target="_blank" rel="sponsored noopener noreferrer" href="'+url(p.link)+'">현재 가격 확인하기</a>':'<span class="unlinked">구매 링크 준비 중</span>')+'</article>';
}
const ps=d.products;
const top=(d.topDeals||[]).map(name=>ps.find(p=>p.name===name&&p.status==='buy')).filter(Boolean).slice(0,3);
const rest=ps.filter(p=>!top.includes(p));
const date=d.date.split('-');
const summary='<h2>'+Number(date[1])+'/'+Number(date[2])+' 오늘 '+ps.length+'개 확인</h2><div class="counts">'+['buy','wait','pass','hold'].map(s=>{const n=ps.filter(p=>p.status===s).length;return s==='hold'&&!n?'':'<span>'+e(labels[s])+' '+n+'개</span>'}).join('')+'</div>';
let products=top.length?'<h2 class="section-title">🔥 오늘의 TOP 딜 '+top.length+'개</h2><div class="top-grid">'+top.map(card).join('')+'</div>':'';
for(const [platform,title,disclosure] of [['toss','오늘의 토스 가격판정','✱ 이 포스팅은 토스쇼핑 쉐어링크 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.'],['coupang','오늘의 쿠팡 가격판정','쿠팡파트너스 활동의 일환으로, 이에 따른 일정 수수료를 제공받습니다.']]){
 const group=rest.filter(p=>p.platform===platform&&p.status==='buy');
 if(group.length)products+='<section><h2 class="section-title">'+title+'</h2><p class="affiliate">'+disclosure+'</p>'+group.map(card).join('')+'</section>';
}
for(const [status,title] of [['wait','🟡 조금 기다려도 됨'],['pass','🔴 오늘은 PASS'],['hold','⚪ 비교 근거 확인 중']]){
 const group=ps.filter(p=>p.status===status);
 if(group.length)products+='<section><h2 class="section-title">'+title+'</h2>'+group.map(card).join('')+'</section>';
 else if(status==='pass')products+='<section><h2 class="group-title">🔴 오늘은 PASS 0개</h2><p class="muted">오늘 등록한 상품 중 PASS 판정은 없습니다.</p></section>';
}
const html=readFileSync('page.template.html','utf8').replace('{{SUMMARY}}',summary).replaceAll('{{CHAT}}',url(d.chatUrl)).replace('{{PRODUCTS}}',products);
writeFileSync('index.html',html);
console.log('Built '+ps.length+' static cards');
