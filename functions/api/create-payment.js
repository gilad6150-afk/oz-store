/**
 * Cloudflare Pages Function: /api/create-payment
 * Supports GROW (Meshulam) integration via Make.com (100% Free - 0 NIS/month API fees)
 * Official Webhook: https://hook.eu1.make.com/5rb89ooxpchjtbhmat3wrh63c8vdv5pk
 */

export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '86400',
        }
    });
}

export async function onRequest(context) {
    if (context.request.method === 'OPTIONS') return onRequestOptions();
    if (context.request.method === 'POST') return onRequestPost(context);
    return new Response('Method Not Allowed', { status: 405 });
}

export async function onRequestPost(context) {
    const corsHeaders = {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    };

    try {
        const body = await context.request.json().catch(() => ({}));
        const amount = Number(body.amount) || 0;

        if (amount <= 0) {
            return new Response(JSON.stringify({ 
                success: false, 
                error: 'סכום לתשלום אינו תקין' 
            }), { status: 400, headers: corsHeaders });
        }

        let fullName = (body.name || 'לקוח יקר').trim();
        if (!fullName.includes(' ')) {
            fullName = fullName + ' לקוח';
        }
        function normalizeIsraeliPhone(p) {
            if (!p) return '';
            let raw = String(p).trim();
            let cleaned = raw.replace(/[\s\-\(\)\.]/g, '');
            if (cleaned.startsWith('+972')) cleaned = cleaned.slice(4);
            else if (cleaned.startsWith('00972')) cleaned = cleaned.slice(5);
            else if (cleaned.startsWith('972') && cleaned.length >= 11) cleaned = cleaned.slice(3);
            cleaned = cleaned.replace(/^0+/, '');
            return cleaned.length > 0 ? ('0' + cleaned) : '0500000000';
        }
        const phone = normalizeIsraeliPhone(body.phone);
        const email = (body.email || 'customer@oz-judaica.co.il').trim();
        const address = (body.address || '').trim();
        const city = (body.city || '').trim();
        const fullAddress = [address, city].filter(Boolean).join(', ');
        const originUrl = new URL(context.request.url).origin;
        const orderId = body.orderId || ('OZ-' + Date.now().toString().slice(-6));
        const itemsCount = (body.items && body.items.length) ? body.items.length : 1;
        const description = (body.description || `עוז יודאיקה - הזמנה #${orderId} (${itemsCount} פריטים)`).trim();
        const title = (body.title || description).trim();
        const returnUrl = body.returnUrl || `${originUrl}/?payment_status=success&order_id=${orderId}`;

        // ========================================================
        // 1. PRIMARY ROUTE: GROW (MESHULAM) VIA MAKE.COM (FREE PATH)
        // ========================================================
        const defaultWebhook = 'https://hook.eu1.make.com/5rb89ooxpchjtbhmat3wrh63c8vdv5pk';
        const makeWebhookUrl = body.makeWebhookUrl || 
                               context.env?.MAKE_GROW_WEBHOOK_URL || 
                               context.env?.GROW_WEBHOOK_URL ||
                               defaultWebhook;

        if (makeWebhookUrl && makeWebhookUrl.startsWith('http')) {
            const makePayload = {
                title: title,
                orderId: orderId,
                amount: amount,
                name: fullName,
                phone: phone,
                email: email,
                city: city,
                address: fullAddress,
                description: description,
                items: body.items || [],
                returnUrl: returnUrl,
                originUrl: originUrl,
                timestamp: new Date().toISOString()
            };

            const makeRes = await fetch(makeWebhookUrl, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'User-Agent': 'OzJudaica-Grow-Make/1.0'
                },
                body: JSON.stringify(makePayload)
            });

            if (!makeRes.ok) {
                const errText = await makeRes.text();
                return new Response(JSON.stringify({ 
                    success: false, 
                    error: `שגיאה בתקשורת עם Make (${makeRes.status}): ${errText.substring(0, 120)}` 
                }), { status: 502, headers: corsHeaders });
            }

            const resText = await makeRes.text();
            let makeData = {};
            try {
                makeData = JSON.parse(resText);
            } catch(e) {}

            const paymentUrl = makeData.payment_url || makeData.url || makeData.ClearingRedirectUrl || makeData.redirectUrl;

            if (paymentUrl && paymentUrl.startsWith('http')) {
                return new Response(JSON.stringify({
                    success: true,
                    paymentUrl: paymentUrl,
                    redirectUrl: paymentUrl,
                    orderId: orderId,
                    amount: amount,
                    provider: 'GROW_MAKE'
                }), { status: 200, headers: corsHeaders });
            } else {
                // If Make responded 200 but didn't return a JSON payment_url yet (e.g. 'Accepted' because Webhook Response module is pending)
                return new Response(JSON.stringify({
                    success: true,
                    accepted: true,
                    rawResponse: resText,
                    orderId: orderId,
                    amount: amount,
                    provider: 'GROW_MAKE',
                    message: 'ההזמנה שודרה בהצלחה ל-Make'
                }), { status: 200, headers: corsHeaders });
            }
        }

        // ========================================================
        // 2. FALLBACK ROUTE: INVOICE4U DIRECT (IF TOKEN PROVIDED)
        // ========================================================
        const token = body.apiToken || context.env?.INVOICE4U_API_KEY;
        if (token && body.useInvoice4U) {
            const i4uPayload = {
                request: {
                    Invoice4UUserApiKey: token,
                    FullName: fullName,
                    Email: email,
                    Phone: phone,
                    Description: description,
                    DocItemName: description,
                    DocItemPrice: String(amount),
                    DocItemQuantity: '1',
                    Sum: amount,
                    Currency: 'ILS',
                    CallBackUrl: returnUrl,
                    ReturnUrl: returnUrl
                }
            };

            const res = await fetch('https://api.invoice4u.co.il/Services/ApiService.svc/ProcessApiRequestV2', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'OzJudaica-Cloudflare/1.0'
                },
                body: JSON.stringify(i4uPayload)
            });

            if (res.ok) {
                const data = await res.json();
                if (data && data.d && data.d.ClearingRedirectUrl && data.d.ClearingRedirectUrl.startsWith('http')) {
                    return new Response(JSON.stringify({
                        success: true,
                        paymentUrl: data.d.ClearingRedirectUrl,
                        redirectUrl: data.d.ClearingRedirectUrl,
                        orderId: orderId,
                        amount: amount,
                        provider: 'INVOICE4U'
                    }), { status: 200, headers: corsHeaders });
                }
            }
        }

        return new Response(JSON.stringify({ 
            success: false, 
            error: 'לא הוגדר ספק סליקה זמין' 
        }), { status: 500, headers: corsHeaders });

    } catch (err) {
        return new Response(JSON.stringify({ 
            success: false, 
            error: `חריגת שרת: ${err.message}` 
        }), { status: 500, headers: corsHeaders });
    }
}
