# 오늘 사도 됨? | 가격판정

https://clclahd-glitch.github.io/

매일 products.json만 수정합니다. 날짜(date), 공개채팅(chatUrl), TOP 3 상품명(topDeals), 상품 목록(products)을 입력하세요.

상품 필드: id, date, status(buy / pass), midnightOpen(true / false), platform(toss / coupang), name, configuration, price, priceFacts(가격 숫자 문구 배열), image, link, affiliate(true / false).

예: priceFacts: ["네이버 15,900원 → 현재가 13,000원", "2,900원↓"]. 개당가 예: ["1팩 499원"]. 판정 이유나 긴 설명은 표시하지 않습니다. midnightOpen을 true로 지정한 상품에만 해당 날짜 00:00 OPEN 배지와 전용 버튼이 표시됩니다.

제휴수익 없는 상품은 affiliate: false로 지정합니다. 구매 링크가 없으면 link를 빈 문자열로 두세요. 이 경우 구매 버튼과 개별 제휴 고지가 표시되지 않습니다.

이미지는 HTTPS 주소나 /assets/products/ 경로를 사용합니다. 미확보·로딩 실패 시 공간을 숨깁니다.

GitHub에서 products.json을 수정하고 Commit changes를 누르면 Actions가 메인과 날짜 페이지를 생성하여 배포합니다. node build.mjs로 수동 생성할 수도 있습니다. 화면 디자인은 page.template.html에 분리되어 있습니다.

archives/YYYY-MM-DD.json에 지난 날짜 데이터가 보존됩니다. 현재 날짜 파일만 갱신하고 다른 날짜를 삭제하지 않습니다. 과거에 사용했던 판정 데이터는 원본 기록에 보존하고, 공개 화면에서는 사도 됨 / 지금은 PASS로 통일합니다. 과거 페이지에는 당시 가격 안내와 현재 가격 다시 확인하기 버튼이 표시됩니다.
