# הגדרת GitHub Token ב-Vercel

## הוספת Environment Variables ב-Vercel

1. **לך ל-Vercel Dashboard:**
   - https://vercel.com/dashboard
   - בחר את הפרויקט `AI-website`

2. **לך ל-Settings:**
   - לחץ על "Settings" בתפריט העליון
   - לחץ על "Environment Variables" בתפריט הצד

3. **הוסף את המשתנים הבאים:**

   | Name | Value |
   |------|-------|
   | `GITHUB_TOKEN` | `YOUR_GITHUB_TOKEN_HERE` |
   | `GITHUB_REPO_OWNER` | `YardenSamorai` |
   | `GITHUB_REPO_NAME` | `AI-website` |

4. **בחר Environment:**
   - סמן את כל ה-environments: Production, Preview, Development
   - לחץ "Save"

5. **הפעל מחדש את ה-Deployment:**
   - לך ל-"Deployments"
   - לחץ על ה-3 נקודות של ה-deployment האחרון
   - בחר "Redeploy"

## בדיקה

לאחר הוספת המשתנים:
1. נסה לשמור שינוי בפורטל האדמין
2. הנתונים אמורים להישמר ב-GitHub
3. לאחר כמה שניות, כל המשתמשים יראו את השינויים

## אבטחה

⚠️ **חשוב:**
- ה-token לא נשמר ב-Git (מופיע ב-.gitignore)
- ה-token נשמר רק ב-Vercel Environment Variables
- אם ה-token נחשף, שנה אותו מיד ב-GitHub

## שינוי Token

אם צריך לשנות את ה-token:
1. צור token חדש ב-GitHub
2. עדכן את `GITHUB_TOKEN` ב-Vercel
3. הפעל מחדש את ה-deployment
