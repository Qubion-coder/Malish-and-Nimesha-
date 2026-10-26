# Google Sheet connection (RSVP + Wishes)

Sheet: https://docs.google.com/spreadsheets/d/1v7QE7Y4DcEuyMHknCxCspDIzLi_jeGH7zi_wx1_V4qs

1. Open the sheet > Extensions > Apps Script.
2. Replace the script content with `code.ts` from the project root (same as `google-apps-script/code.gs`).
3. Optional: select the `setup` function and click Run once. This creates the `RSVP` and `Wishes` tabs with headers and asks for permissions.
   (If you skip this, the tabs are created automatically on the first submission.)
4. Deploy > New deployment > Web app. Execute as: Me. Who has access: Anyone.
5. Copy the Web App URL (ends with `/exec`).
6. Paste it into `SCRIPT_URL` in `src/config.ts`, or set `VITE_GOOGLE_APPS_SCRIPT_URL` in `.env` / Vercel env vars.
7. After editing the script later: Deploy > Manage deployments > Edit > Version: New version.

Sheet columns:
- RSVP: Timestamp | Invited As | Full Name | Attendance | No. of Guests | Phone | Message
- Wishes: Timestamp | Name | Message
