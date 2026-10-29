import { STATUS_HTML } from '../status_content.js';

export async function onRequest(context) {
    return new Response(STATUS_HTML, {
        status: 200,
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }
    });
}
