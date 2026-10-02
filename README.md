# 오늘 사도 됨? | 가격판정

https://clclahd-glitch.github.io/

## 매일 수정할 파일

products.json에서 date, chatUrl, topDeals와 products만 수정합니다. 상품 필드: 날짜(date), 판정(status), 상품명(name), 구성(configuration), 가격(price), 개당가(unit), 비교가(comparison), 한 줄 이유(reason), 이미지(image), 링크(link), 제휴 여부(affiliate).

현재 판정은 buy(사도 됨) / pass(지금은 PASS) 두 가지입니다. platform은 toss / coupang입니다. 수수료 없는 정보딜은 affiliate를 false로 지정하세요. TOP 3 상품명을 topDeals에 정확히 입력하면 전체 목록과 중복 없이 표시됩니다.

상품 사진은 /assets/products/의 파일 경로나 HTTPS 이미지 주소를 사용합니다. 비어 있거나 로딩에 실패하면 이미지 영역을 숨깁니다.

GitHub에서 products.json → 연필 버튼 → 수정 → Commit changes. GitHub Actions가 build.mjs를 실행해 정적 HTML과 날짜별 기록을 생성하고 배포합니다. 카드 수와 판정별 숫자는 자동 계산됩니다. 화면 디자인은 page.template.html에 분리되어 있습니다.

## 지난 기록

archives/YYYY-MM-DD.json에 날짜별 상품 데이터를 보관합니다. 같은 날 수정하면 그 날짜 기록도 갱신되며 날짜가 바뀌어도 지난 파일을 삭제하지 않습니다. 공개 기록 주소는 /YYYY-MM-DD/입니다. 지난 기록의 wait 판정은 당시 기록으로 보존하고 새 상품에는 사용하지 않습니다.

수동 생성: node build.mjs. 가격 수집은 자동화되지 않으며 실제 확인한 값과 구성에 맞는 개당가를 입력하세요.
