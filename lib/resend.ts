interface Order {
  order_number: number
  name: string
  phone: string
  address: string
  city?: string | null
  note?: string | null
  amount: number
}

export async function sendOrderEmail(order: Order) {
  if (!process.env.RESEND_API_KEY) {
    console.log('[Email] RESEND_API_KEY manquant — email ignoré')
    return { success: false, reason: 'not_configured' }
  }

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from: 'GreenFlor Zen <noreply@greenflor.ma>',
      to: process.env.NOTIFICATION_EMAIL || 'greenflor7@gmail.com',
      subject: `🌿 طلب جديد #${order.order_number} — ${order.name} — ${order.phone}`,
      html: `
        <div style="font-family:Arial,sans-serif;direction:rtl;max-width:600px;margin:0 auto">
          <div style="background:#0B8437;color:white;padding:20px;text-align:center;border-radius:8px 8px 0 0">
            <h1 style="margin:0;font-size:22px">🌿 GreenFlor Zen — طلب جديد!</h1>
          </div>
          <div style="background:#f9f9f9;padding:24px;border:1px solid #ddd;border-top:none;border-radius:0 0 8px 8px">
            <table style="width:100%;border-collapse:collapse">
              <tr style="border-bottom:1px solid #eee">
                <td style="padding:10px 0;font-weight:bold;color:#0B8437;width:140px">N° Commande</td>
                <td style="padding:10px 0">#${order.order_number}</td>
              </tr>
              <tr style="border-bottom:1px solid #eee">
                <td style="padding:10px 0;font-weight:bold;color:#0B8437">الاسم</td>
                <td style="padding:10px 0">${order.name}</td>
              </tr>
              <tr style="border-bottom:1px solid #eee">
                <td style="padding:10px 0;font-weight:bold;color:#0B8437">الهاتف</td>
                <td style="padding:10px 0">${order.phone}</td>
              </tr>
              <tr style="border-bottom:1px solid #eee">
                <td style="padding:10px 0;font-weight:bold;color:#0B8437">العنوان</td>
                <td style="padding:10px 0">${order.address}</td>
              </tr>
              ${order.city ? `<tr style="border-bottom:1px solid #eee"><td style="padding:10px 0;font-weight:bold;color:#0B8437">المدينة</td><td style="padding:10px 0">${order.city}</td></tr>` : ''}
              ${order.note ? `<tr style="border-bottom:1px solid #eee"><td style="padding:10px 0;font-weight:bold;color:#0B8437">ملاحظة</td><td style="padding:10px 0">${order.note}</td></tr>` : ''}
              <tr>
                <td style="padding:10px 0;font-weight:bold;color:#0B8437">المبلغ</td>
                <td style="padding:10px 0;font-size:18px;font-weight:bold">${order.amount} DH</td>
              </tr>
            </table>
            <div style="margin-top:20px;padding:16px;background:#e8f5e9;border-radius:8px;text-align:center">
              <p style="color:#0B8437;font-weight:bold;margin:0">دفع عند الاستلام — توصيل مجاني 🚚</p>
            </div>
          </div>
        </div>
      `,
    })

    return { success: true }
  } catch (error) {
    console.error('[Email] Erreur envoi:', error)
    return { success: false, reason: 'send_error' }
  }
}
