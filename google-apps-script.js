/**
 * Copy this entire file into Google Apps Script (Extensions → Apps Script)
 * attached to your Google Sheet. Then Deploy → New deployment → Web app.
 *
 * After any change: Deploy → Manage deployments → Edit → New version → Deploy
 */

function doGet(e) {
  e = e || {};
  var params = e.parameter || {};
  return handleSubmission(params.email);
}

function doPost(e) {
  var email = '';

  if (e.postData && e.postData.contents) {
    try {
      email = JSON.parse(e.postData.contents).email;
    } catch (err) {
      email = e.parameter ? e.parameter.email : '';
    }
  } else if (e.parameter) {
    email = e.parameter.email;
  }

  return handleSubmission(email);
}

function handleSubmission(email) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Subscribers');
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Subscribers');
      sheet.appendRow(['Timestamp', 'Email']);
    }

    email = String(email || '').trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ ok: false, error: 'Invalid email address. Use ?email=you@example.com in the URL.' });
    }

    var rows = sheet.getDataRange().getValues();
    for (var i = 1; i < rows.length; i++) {
      if (String(rows[i][1]).toLowerCase() === email) {
        return json({ ok: true, duplicate: true });
      }
    }

    sheet.appendRow([new Date(), email]);
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: err.message });
  }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
