/**
 * Malish & Nimesha – Wedding RSVP & Wishes backend (Google Apps Script)
 *
 * Sheet: https://docs.google.com/spreadsheets/d/1v7QE7Y4DcEuyMHknCxCspDIzLi_jeGH7zi_wx1_V4qs
 *
 * HOW TO DEPLOY
 *  1. Open the Google Sheet above > Extensions > Apps Script.
 *  2. Delete everything in Code.gs and paste this whole file in. Save.
 *  3. (Optional) Run the `setup` function once to create both sheets now and approve permissions.
 *  4. Deploy > New deployment > Type: Web app
 *       Execute as: Me
 *       Who has access: Anyone
 *  5. Copy the Web App URL (ends with /exec) and paste it into SCRIPT_URL in src/config.ts
 *     (or set VITE_GOOGLE_APPS_SCRIPT_URL in Vercel / .env).
 *  6. After any change to this script: Deploy > Manage deployments > Edit > Version: New version.
 *
 * The "RSVP" and "Wishes" sheets are created automatically with headers on first use.
 */

var SPREADSHEET_ID = '1v7QE7Y4DcEuyMHknCxCspDIzLi_jeGH7zi_wx1_V4qs';

var SHEETS = {
  RSVP: {
    name: 'RSVP',
    headers: ['Timestamp', 'Invited As', 'Full Name', 'Attendance', 'No. of Guests', 'Phone', 'Message'],
    widths: [170, 200, 200, 110, 120, 140, 320],
  },
  WISHES: {
    name: 'Wishes',
    headers: ['Timestamp', 'Name', 'Message'],
    widths: [170, 200, 480],
  },
};

var HEADER_BG = '#7a1f2b';   // royal maroon
var HEADER_FG = '#ffffff';

/* ------------------------------------------------------------------ */
/*  Web app entry points                                              */
/* ------------------------------------------------------------------ */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    var p = parsePayload_(e);
    var key = String(p.sheet || '').toUpperCase();
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    if (key === 'RSVP') {
      var rsvp = getOrCreateSheet_(ss, SHEETS.RSVP);
      rsvp.appendRow([
        new Date(),
        clean_(p.invitedAs),
        clean_(p.name),
        clean_(p.attendance),
        clean_(p.guests),
        asText_(clean_(p.phone)),
        clean_(p.notes),
      ]);
      return json_({ ok: true, sheet: SHEETS.RSVP.name, row: rsvp.getLastRow() });
    }

    if (key === 'WISHES' || key === 'WISH') {
      if (!clean_(p.name) || !clean_(p.message)) {
        return json_({ ok: false, error: 'Name and message are required.' });
      }
      var wishes = getOrCreateSheet_(ss, SHEETS.WISHES);
      wishes.appendRow([new Date(), clean_(p.name), clean_(p.message)]);
      return json_({ ok: true, sheet: SHEETS.WISHES.name, row: wishes.getLastRow() });
    }

    return json_({ ok: false, error: 'Invalid sheet. Use "RSVP" or "Wishes".' });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message ? err.message : err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  try {
    var action = e && e.parameter ? String(e.parameter.action || '') : '';

    if (action === 'wishes') {
      var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      var sheet = getOrCreateSheet_(ss, SHEETS.WISHES);
      var lastRow = sheet.getLastRow();
      var list = [];

      if (lastRow > 1) {
        var values = sheet.getRange(2, 1, lastRow - 1, 3).getValues();
        for (var i = values.length - 1; i >= 0; i--) { // newest first
          var row = values[i];
          if (!row[1] || !row[2]) continue;
          list.push({
            timestamp: row[0] instanceof Date ? row[0].toISOString() : String(row[0]),
            name: String(row[1]),
            message: String(row[2]),
          });
        }
      }
      return json_({ ok: true, wishes: list });
    }

    return json_({ ok: true, message: 'Malish & Nimesha wedding endpoint is running.' });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

/* ------------------------------------------------------------------ */
/*  Run once manually (optional): creates both sheets with headers    */
/* ------------------------------------------------------------------ */

function setup() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  getOrCreateSheet_(ss, SHEETS.RSVP);
  getOrCreateSheet_(ss, SHEETS.WISHES);
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function getOrCreateSheet_(ss, config) {
  var sheet = ss.getSheetByName(config.name);
  if (!sheet) {
    sheet = ss.insertSheet(config.name);
  }
  if (sheet.getLastRow() === 0) {
    writeHeaders_(sheet, config);
  }
  return sheet;
}

function writeHeaders_(sheet, config) {
  var cols = config.headers.length;
  sheet.getRange(1, 1, 1, cols)
    .setValues([config.headers])
    .setFontWeight('bold')
    .setBackground(HEADER_BG)
    .setFontColor(HEADER_FG)
    .setHorizontalAlignment('center');
  sheet.setFrozenRows(1);
  for (var i = 0; i < config.widths.length; i++) {
    sheet.setColumnWidth(i + 1, config.widths[i]);
  }
  sheet.getRange(2, 1, sheet.getMaxRows() - 1, 1).setNumberFormat('yyyy-mm-dd hh:mm:ss');
}

function clean_(value) {
  var v = value === undefined || value === null ? '' : String(value).trim();
  // Prevent spreadsheet formula injection
  if (/^[=+\-@]/.test(v)) v = "'" + v;
  return v;
}

// Keeps leading zeros (e.g. 0777...) by storing the value as text
function asText_(v) {
  return v && v.charAt(0) !== "'" ? "'" + v : v;
}

function parsePayload_(e) {
  var params = e && e.parameter ? e.parameter : {};
  if (Object.keys(params).length > 0) return params;

  var contents = e && e.postData && e.postData.contents ? e.postData.contents : '';
  if (!contents) return {};
  try {
    return JSON.parse(contents);
  } catch (_err) {
    return {};
  }
}

function json_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
