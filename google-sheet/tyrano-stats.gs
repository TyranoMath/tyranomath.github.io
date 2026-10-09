/**
 * 🦖 TyranoMath 플레이 수 집계 (Google Apps Script)
 *
 * 사용법: 구글 시트 → 확장 프로그램 → Apps Script 에 이 코드를 통째로 붙여 넣고
 *        '웹 앱'으로 배포한 뒤, 나온 주소(.../exec)를 data.js 의 statsUrl 에 넣어요.
 *
 * 시트에는 '플레이수' 탭이 자동으로 생기고 이렇게 쌓여요:
 *   A: 게임 파일 | B: 플레이 수 | C: 마지막 플레이
 */

const SHEET_NAME = '플레이수';

// 게임 파일 주소처럼 생긴 것만 받아요 (엉뚱한 값이 쌓이지 않게)
const FILE_RULE = /^(games|puzzles)\/[A-Za-z0-9_\-\/]+\.html$/;

function doGet(e) {
  const p = (e && e.parameter) || {};
  const sheet = getSheet_();

  if (p.action === 'hit' && p.file && FILE_RULE.test(p.file) && p.file.length < 120) {
    const lock = LockService.getScriptLock();
    lock.waitLock(5000);                       // 여러 학생이 동시에 눌러도 숫자가 꼬이지 않게
    try {
      const last = sheet.getLastRow();
      const files = last > 1 ? sheet.getRange(2, 1, last - 1, 1).getValues().map(r => r[0]) : [];
      const idx = files.indexOf(p.file);
      if (idx >= 0) {
        const cell = sheet.getRange(idx + 2, 2);
        cell.setValue((Number(cell.getValue()) || 0) + 1);
        sheet.getRange(idx + 2, 3).setValue(new Date());
      } else {
        sheet.appendRow([p.file, 1, new Date()]);
      }
    } finally {
      lock.releaseLock();
    }
  }

  // 모든 게임의 플레이 수를 돌려줘요
  const counts = {};
  const last = sheet.getLastRow();
  if (last > 1) {
    sheet.getRange(2, 1, last - 1, 2).getValues().forEach(r => {
      if (r[0]) counts[r[0]] = Number(r[1]) || 0;
    });
  }
  return ContentService.createTextOutput(JSON.stringify({ ok: true, counts: counts }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['게임 파일', '플레이 수', '마지막 플레이']);
    sheet.setFrozenRows(1);
    sheet.getRange('A1:C1').setFontWeight('bold').setBackground('#E4F5D6');
    sheet.setColumnWidth(1, 260);
  }
  return sheet;
}

/** (선택) Apps Script 편집기에서 이 함수를 한 번 실행하면 '플레이수' 탭이 미리 만들어지고 권한 승인도 끝나요. */
function setup() {
  getSheet_();
}
