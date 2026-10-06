/**
 * ============================================================================
 *         עוז יודאיקה - סנכרון חי של מסמך הנחיות מ-GOOGLE DOCS
 *               OZ JUDAICA - GOOGLE DOC LIVE INSTRUCTIONS SYNC
 * ============================================================================
 * 
 * מסמך ההנחיות של ההנהלה:
 * https://docs.google.com/document/d/1Ig4MSpg0oC4a9ByxMKBr50vmHOhCtFr_oeK-_fGPPYQ/edit?usp=sharing
 * 
 * סקריפט זה מתחבר בכל סבב של הביקורת העצמית (כל 4 שעות),
 * מושך את הטקסט המעודכן, משווה לגרסה הקודמת, ורושם כל הנחיה חדשה שנכתבה!
 */

const fs = require('fs');
const https = require('https');
const crypto = require('crypto');

const DOC_ID = '1Ig4MSpg0oC4a9ByxMKBr50vmHOhCtFr_oeK-_fGPPYQ';
const DOC_EXPORT_URL = `https://docs.google.com/document/d/${DOC_ID}/export?format=txt`;
const SNAPSHOT_FILE = 'last_synced_google_doc.txt';
const HISTORY_FILE = 'google_doc_history.json';

function fetchWithRedirect(url, maxRedirects = 5) {
    return new Promise((resolve, reject) => {
        if (maxRedirects <= 0) return reject(new Error('חרגת מכמות ההפניות המותרת'));
        https.get(url, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return resolve(fetchWithRedirect(res.headers.location, maxRedirects - 1));
            }
            if (res.statusCode !== 200) {
                return reject(new Error(`קוד שגיאה HTTP ${res.statusCode}`));
            }
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

async function syncGoogleDocInstructions() {
    console.log('\n[SECTION 0: בדיקת מסמך הנחיות חי מ-GOOGLE DOCS]');
    console.log('  -> מתחבר למסמך ההנחיות ב-Google Docs...');
    
    try {
        const text = await fetchWithRedirect(DOC_EXPORT_URL);
        const cleanText = text.replace(/^\uFEFF/, '').trim();
        const currentHash = crypto.createHash('md5').update(cleanText).digest('hex');

        let previousText = '';
        let previousHash = '';
        if (fs.existsSync(SNAPSHOT_FILE)) {
            previousText = fs.readFileSync(SNAPSHOT_FILE, 'utf8').trim();
            previousHash = crypto.createHash('md5').update(previousText).digest('hex');
        }

        const isUpdated = previousHash !== currentHash;

        if (isUpdated) {
            console.log(`  🔔 זוהה תוכן מעודכן במסמך ההנחיות! (גודל נוכחי: ${cleanText.length} תווים)`);
            
            // שמירת עותק עדכני
            fs.writeFileSync(SNAPSHOT_FILE, cleanText, 'utf8');

            // עדכון היסטוריה
            let history = [];
            if (fs.existsSync(HISTORY_FILE)) {
                try { history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8')); } catch(e){}
            }
            history.unshift({
                timestamp: new Date().toISOString(),
                hash: currentHash,
                length: cleanText.length,
                preview: cleanText.substring(0, 200)
            });
            fs.writeFileSync(HISTORY_FILE, JSON.stringify(history.slice(0, 20), null, 2), 'utf8');

            console.log('  -> מסמך ההנחיות עודכן ונשמר בהצלחה ב-last_synced_google_doc.txt.');
        } else {
            console.log(`  ✓ מסמך ההנחיות סונכרן (תקין וללא שינויים חדשים מהסבב הקודם).`);
        }

        // Trigger Google Apps Script to color completed tasks & append audit notes
        let docConfig = {};
        if (fs.existsSync('google_doc_config.json')) {
            try { docConfig = JSON.parse(fs.readFileSync('google_doc_config.json', 'utf8')); } catch(e){}
        }
        const webappUrl = process.env.GOOGLE_DOC_WEBAPP_URL || docConfig.webappUrl;
        if (webappUrl) {
            console.log('  -> שולח פקודה לעדכון צביעה ירוקה והערות במסמך Google Docs...');
            try {
                await fetchWithRedirect(webappUrl);
                console.log('  ✓ המסמך נצבע בירוק ועודכנה הערת ביקורת בהצלחה.');
            } catch(we) {
                console.warn('  ⚠️ הערת סנכרון Apps Script Webhook:', we.message);
            }
        }

        return {
            success: true,
            isUpdated,
            length: cleanText.length,
            content: cleanText
        };
    } catch(err) {
        console.error(`  ⚠️ אזהרה: לא ניתן היה למשוך את מסמך Google Docs כעת (${err.message}). ממשיך בביקורת לפי ההנחיות הקיימות.`);
        return {
            success: false,
            isUpdated: false,
            error: err.message
        };
    }
}

if (require.main === module) {
    syncGoogleDocInstructions().then(res => {
        console.log('תוצאת בדיקה:', res.success ? `הצלחה (${res.length} תווים)` : `שגיאה: ${res.error}`);
    });
}

module.exports = {
    syncGoogleDocInstructions,
    DOC_EXPORT_URL
};
