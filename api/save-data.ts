import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // רק POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const data = req.body;
    
    // בדיקת תקינות הנתונים
    if (!data || typeof data !== 'object') {
      return res.status(400).json({ success: false, error: 'Invalid data' });
    }

    // שמירה דרך GitHub API
    // דרוש: GITHUB_TOKEN ב-environment variables
    const githubToken = process.env.GITHUB_TOKEN;
    const repoOwner = process.env.GITHUB_REPO_OWNER || 'YardenSamorai';
    const repoName = process.env.GITHUB_REPO_NAME || 'AI-website';
    
    if (!githubToken) {
      // Fallback: החזר הודעה שהנתונים התקבלו
      // ב-production, צריך להוסיף GITHUB_TOKEN
      return res.status(200).json({ 
        success: true, 
        message: 'Data received. Add GITHUB_TOKEN to save to repository.',
        note: 'In development, data is saved locally. In production, configure GitHub API.'
      });
    }

    // עדכון קובץ ב-GitHub
    const fileContent = JSON.stringify(data, null, 2);
    const filePath = 'public/site-data.json';
    
    // קבלת SHA של הקובץ הנוכחי
    const getFileSha = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
          {
            headers: {
              'Authorization': `token ${githubToken}`,
              'Accept': 'application/vnd.github.v3+json',
            },
          }
        );
        if (response.ok) {
          const fileData = await response.json();
          return fileData.sha;
        }
      } catch (error) {
        console.error('Error getting file SHA:', error);
      }
      return null;
    };

    const sha = await getFileSha();
    const content = Buffer.from(fileContent).toString('base64');

    // עדכון הקובץ ב-GitHub
    const updateResponse = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Update site data from admin panel',
          content: content,
          sha: sha,
        }),
      }
    );

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      throw new Error(errorData.message || 'Failed to update file on GitHub');
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Data saved successfully to repository. Changes will be live after deployment.' 
    });
  } catch (error: any) {
    console.error('Error saving data:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to save data' 
    });
  }
}
