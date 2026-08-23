export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    const { name, message } = req.body;

    const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
    const CHAT_ID = process.env.CHAT_ID;

    if (!TELEGRAM_TOKEN || !CHAT_ID) {
        return res.status(500).json({ success: false, error: 'Credenciales no configuradas' });
    }

    const textPayload = `🏖️ *Nuevo Comentario - Kiosco Ananreliz31*\n\n👤 *Nombre:* ${name}\n💬 *Mensaje:* ${message}`;

    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: textPayload,
                parse_mode: 'Markdown'
            })
        });

        const data = await response.json();

        if (data.ok) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(400).json({ success: false, error: data.description });
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
}