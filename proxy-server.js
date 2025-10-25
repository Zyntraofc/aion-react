import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json()); // importante para POST/PUT

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

app.get('/health', (req, res) => res.json({ status: 'ok', port: PORT }));

app.use(/^\/(proxy\/)?api/, async (req, res) => {
    try {
        const apiPath = req.originalUrl.replace(/^\/(proxy\/)?api/, '');
        const targetUrl = `https://ms-aion-jpa.onrender.com/api${apiPath}`;

        console.log('🔁 Proxying →', targetUrl);

        const headers = {
            'Authorization': 'Basic ' + Buffer.from('rh:rhpass').toString('base64'),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        const response = await fetch(targetUrl, {
            method: req.method,
            headers,
            body: req.method !== 'GET' && req.method !== 'HEAD'
                ? JSON.stringify(req.body)
                : undefined
        });

        console.log('📥 API Response status:', response.status);

        let data;
        try {
            data = await response.json();
        } catch {
            const text = await response.text();
            console.warn('⚠️ API returned non-JSON response:', text);
            data = { raw: text };
        }

        if (!response.ok) {
            console.error('❌ API Error:', data);
            return res.status(response.status).json(data);
        }

        res.json(data);
    } catch (error) {
        console.error('❌ Proxy error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () =>
    console.log(`🚀 Proxy server running at http://localhost:${PORT}`)
);
