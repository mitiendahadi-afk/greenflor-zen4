interface OrderSMS {
  order_number: number
  name: string
  phone: string
  city?: string | null
}

export async function sendOrderSMS(order: OrderSMS) {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.log('[SMS] Twilio non configuré — SMS ignoré')
    return { success: false, reason: 'not_configured' }
  }

  try {
    const twilio = await import('twilio')
    const client = twilio.default(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    )

    await client.messages.create({
      body: `🌿 طلب جديد GreenFlor Zen\nالاسم: ${order.name}\nالهاتف: ${order.phone}\nالمدينة: ${order.city || 'غير محددة'}\n#${order.order_number}`,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to: process.env.NOTIFICATION_PHONE || '+212631955019',
    })

    return { success: true }
  } catch (error) {
    console.error('[SMS] Erreur envoi:', error)
    return { success: false, reason: 'send_error' }
  }
}
