import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.createTransporter();
  }

  private createTransporter() {
    // Configuración para Gmail
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Tu email de Gmail
        pass: process.env.EMAIL_PASSWORD, // Contraseña de aplicación de Gmail
      },
    });
  }

  async enviarCodigoRecuperacion(email: string, codigo: string): Promise<void> {
    const mailOptions = {
      from: `"Sistema PIS - Universidad" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Código de Recuperación de Contraseña - Sistema PIS',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1976d2; margin-bottom: 10px;">Sistema PIS - Universidad</h1>
            <h2 style="color: #333; font-weight: normal;">Recuperación de Contraseña</h2>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0 0 15px 0; font-size: 16px; color: #333;">
              Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.
            </p>
            
            <div style="text-align: center; margin: 25px 0;">
              <div style="background: #1976d2; color: white; padding: 15px; border-radius: 8px; display: inline-block;">
                <span style="font-size: 24px; font-weight: bold; letter-spacing: 3px;">${codigo}</span>
              </div>
            </div>
            
            <p style="margin: 15px 0 0 0; font-size: 14px; color: #666;">
              <strong>Importante:</strong>
            </p>
            <ul style="margin: 10px 0; padding-left: 20px; color: #666; font-size: 14px;">
              <li>Este código es válido por <strong>15 minutos</strong></li>
              <li>Solo puedes usarlo <strong>una vez</strong></li>
              <li>Si no solicitaste este cambio, ignora este correo</li>
            </ul>
          </div>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center;">
            <p style="margin: 0; font-size: 12px; color: #999;">
              Este es un correo automático, por favor no respondas a este mensaje.<br>
              Sistema PIS - Universidad &copy; 2025
            </p>
          </div>
        </div>
      `,
      text: `
        Sistema PIS - Universidad
        Recuperación de Contraseña
        
        Tu código de verificación es: ${codigo}
        
        Este código es válido por 15 minutos y solo puede usarse una vez.
        Si no solicitaste este cambio, ignora este correo.
        
        Sistema PIS - Universidad © 2025
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email enviado exitosamente:', info.messageId);
      console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
    } catch (error) {
      console.error('❌ Error al enviar email:', error);
      throw new Error('Error al enviar el correo electrónico');
    }
  }

  async verificarConexion(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('✅ Conexión de email verificada exitosamente');
      return true;
    } catch (error) {
      console.error('❌ Error en la conexión de email:', error);
      return false;
    }
  }
}
