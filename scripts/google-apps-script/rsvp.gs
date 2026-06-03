/**
 * RSVP backend untuk wedding invitation Sekarvinda & Laksantio.
 *
 * Cara pakai:
 *   1. Buka https://sheets.google.com → buat sheet baru → namai mis. "RSVP Sekarvinda Laksantio".
 *   2. Di sheet tersebut: Extensions → Apps Script.
 *   3. Hapus isi Code.gs default, tempel SELURUH file ini.
 *   4. Klik tombol Deploy → New deployment → pilih type "Web app".
 *        - Description: "RSVP API"
 *        - Execute as: Me
 *        - Who has access: Anyone
 *      Klik Deploy → izinkan akun Google saat diminta → salin URL "Web app".
 *   5. Tempel URL itu ke file `.env.local` (atau ke Environment Variables Vercel)
 *      sebagai `VITE_RSVP_ENDPOINT=<URL>`.
 *   6. Build ulang & deploy (`npm run build`). Selesai.
 *
 * Catatan keamanan:
 * - Skrip ini menerima POST dari siapapun (publik). Aman untuk undangan
 *   pernikahan karena hanya append baris ucapan. Validasi panjang/format
 *   sederhana sudah diterapkan di bawah.
 * - Kalau ingin update setelah deploy, gunakan "Manage deployments" →
 *   pilih deployment yang ada → Edit → "New version". URL tetap sama.
 */

const SHEET_NAME = 'wishes';
const HEADERS = ['id', 'name', 'attend', 'message', 'at', 'received_at'];
const MAX_NAME = 80;
const MAX_MESSAGE = 600;

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
  } else if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
  }
  return sh;
}

function jsonOut_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** GET → kembalikan semua ucapan sebagai array JSON. */
function doGet() {
  const sh = getSheet_();
  const lastRow = sh.getLastRow();
  if (lastRow < 2) return jsonOut_([]);
  const values = sh.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
  const out = values.map(function (r) {
    const attend = String(r[2] || 'hadir').toLowerCase();
    return {
      id: String(r[0] || ''),
      name: String(r[1] || ''),
      attend: (attend === 'tidak' || attend === 'ragu') ? attend : 'hadir',
      message: String(r[3] || ''),
      at: Number(r[4]) || 0,
    };
  }).filter(function (w) { return w.name && w.message; });
  return jsonOut_(out);
}

/** POST → tambah satu baris. Body: JSON `{id,name,attend,message,at}`. */
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const name = String(body.name || '').trim().slice(0, MAX_NAME);
    const message = String(body.message || '').trim().slice(0, MAX_MESSAGE);
    const attendRaw = String(body.attend || 'hadir').toLowerCase();
    const attend = (attendRaw === 'tidak' || attendRaw === 'ragu') ? attendRaw : 'hadir';
    const at = Number(body.at) || Date.now();
    const id = String(body.id || (at + '-' + Math.random().toString(36).slice(2, 7))).slice(0, 40);

    if (!name || !message) return jsonOut_({ ok: false, error: 'invalid' });

    const sh = getSheet_();
    sh.appendRow([id, name, attend, message, at, new Date()]);
    return jsonOut_({ ok: true });
  } catch (err) {
    return jsonOut_({ ok: false, error: String(err) });
  }
}
