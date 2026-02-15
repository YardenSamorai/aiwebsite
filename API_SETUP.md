# הגדרת API לשמירת נתונים

## בעיה
הנתונים נשמרים רק ב-localStorage, כך שכל משתמש רואה את הנתונים שלו בלבד.

## פתרון
הוספנו API endpoint לשמירת הנתונים בקובץ `public/site-data.json`, כך שכל המשתמשים יראו את אותם נתונים.

## הגדרה ל-Production (Vercel)

### אופציה 1: GitHub API (מומלץ)

1. צור GitHub Personal Access Token:
   - לך ל: https://github.com/settings/tokens
   - לחץ על "Generate new token (classic)"
   - תן שם: "AI Website Admin"
   - בחר הרשאות: `repo` (full control of private repositories)
   - העתק את ה-token

2. הוסף את ה-token ל-Vercel:
   - לך ל-Vercel Dashboard > Project > Settings > Environment Variables
   - הוסף:
     - `GITHUB_TOKEN` = ה-token שיצרת
     - `GITHUB_REPO_OWNER` = `YardenSamorai` (או הבעלים של ה-repo)
     - `GITHUB_REPO_NAME` = `AI-website` (או שם ה-repo)

3. הפעל מחדש את ה-deployment

### אופציה 2: Database (Supabase/MongoDB)

אם תרצה להשתמש ב-database במקום GitHub API:

1. צור database (Supabase, MongoDB Atlas, וכו')
2. עדכן את `api/save-data.ts` להשתמש ב-database
3. הוסף את ה-connection string ל-environment variables

## Development

ב-development, הנתונים נשמרים ישירות לקובץ `public/site-data.json` דרך Vite middleware.

## איך זה עובד

1. משתמש עורך בפורטל האדמין
2. לוחץ על "שמור"
3. הנתונים נשלחים ל-`/api/save-data`
4. ה-API שומר את הנתונים ב-GitHub (או database)
5. כל המשתמשים רואים את הנתונים המעודכנים

## הערות

- ב-development: הנתונים נשמרים ישירות לקובץ
- ב-production: הנתונים נשמרים דרך GitHub API או database
- אם GitHub API לא מוגדר, הנתונים נשמרים ב-localStorage בלבד (fallback)
