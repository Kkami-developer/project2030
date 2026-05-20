# 녹색전환연구소 · 프로젝트 2030 후원 캠페인

정적 랜딩 페이지입니다. 빌드 도구 없이 `index.html`만으로 동작합니다.

## 폴더 구조

```
├── index.html          # 메인 페이지
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── script.js
│   └── images/         # 사진·로고·보고서 표지 등
└── README.md
```

## 로컬에서 보기

Python이 있으면 프로젝트 루트에서:

```bash
python -m http.server 8080
```

브라우저에서 `http://localhost:8080` 을 엽니다.

## GitHub Pages 배포

1. GitHub에 새 저장소를 만들고 이 폴더를 push합니다.
2. 저장소 **Settings → Pages** 로 이동합니다.
3. **Build and deployment**
   - Source: **Deploy from a branch**
   - Branch: `main` (또는 `master`) / **/ (root)**
4. 저장 후 몇 분 뒤 `https://<사용자명>.github.io/<저장소명>/` 에서 확인합니다.

> 후원·회원가입 링크는 외부(hsit.co.kr)로 연결됩니다. Pages URL만 바뀌면 되고, 별도 서버 설정은 필요 없습니다.

## 링크 미리보기 (OG / 카카오·SNS 공유)

- **제목:** 녹색전환연구소의 첫 후원 캠페인 - 프로젝트 2030
- **썸네일:** `assets/images/story-1.png` (대선 의제 격상 섹션 사진)

배포 후 [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) 또는 카카오 디벨로퍼 도구에서 URL을 한 번 스크랩해 캐시를 갱신하면 미리보기가 안정적으로 반영됩니다.

## 수정 시 참고

- 후원 URL은 `index.html`과 `assets/js/script.js`의 `REGULAR_URL` 등에 있습니다. 변경 시 두 곳을 함께 확인하세요.
- 문의: `office@igt.or.kr` · `02-2135-1148`
