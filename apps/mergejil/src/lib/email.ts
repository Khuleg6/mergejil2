import nodemailer, { type Transporter } from 'nodemailer';

let transporter: Transporter | undefined;

function getTransporter(): Transporter {
  if (!transporter) {
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;
    if (!user || !pass) {
      throw new Error(
        'GMAIL_USER / GMAIL_APP_PASSWORD is not set. Add them to apps/mergejil/.env.local for local dev — see apps/mergejil/.env.local.example.',
      );
    }
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });
  }
  return transporter;
}

export async function sendPasswordResetOtpEmail(
  to: string,
  code: string,
): Promise<void> {
  const from = process.env.GMAIL_USER;
  await getTransporter().sendMail({
    from: `Мэргэжил.мн <${from}>`,
    to,
    subject: 'Нууц үг сэргээх код',
    text: `Таны нууц үг сэргээх код: ${code}\n\nЭнэ код 10 минутын дараа хүчингүй болно. Хэрэв та энэ хүсэлтийг гаргаагүй бол энэ имэйлийг үл тоомсорлоно уу.`,
    html: `
      <div style="font-family: sans-serif; font-size: 14px; color: #1e293b;">
        <p>Таны нууц үг сэргээх код:</p>
        <p style="font-size: 28px; font-weight: 700; letter-spacing: 4px;">${code}</p>
        <p style="color: #64748b;">Энэ код 10 минутын дараа хүчингүй болно. Хэрэв та энэ хүсэлтийг гаргаагүй бол энэ имэйлийг үл тоомсорлоно уу.</p>
      </div>
    `,
  });
}
