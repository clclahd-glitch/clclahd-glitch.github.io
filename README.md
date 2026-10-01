# 오늘 사도 됨? | 가격판정

https://clclahd-glitch.github.io/

매일 products.json만 수정하세요. 날짜, 상품명(name), 구성(configuration), 가격(price), 개당가(unit), 상품사진(image), 제휴링크(link), 판정(status), 비교근거(comparison), 이유(reason)를 입력합니다. status는 buy / wait / pass / hold, platform은 toss / coupang입니다.

최상단 topDeals에는 TOP 딜 상품명 3개를 정확히 적습니다. 상품 개수와 판정별 숫자는 자동 계산됩니다.

GitHub에서 products.json → 연필 버튼 → 수정 → Commit changes. GitHub Actions가 build.mjs로 정적 index.html을 생성하고 공개합니다. page.template.html은 고정 디자인입니다. 모든 상품이 HTML에 포함되어 스크립트나 데이터 로딩 없이 표시됩니다. 수동 생성은 node build.mjs.

가격/날짜 수집은 자동화되지 않았습니다. 실제 확인한 값만 입력하세요. 구성 변경 시 unit도 다시 계산하세요. 쿠팡 상품 사진은 추가 연결 필요합니다.
