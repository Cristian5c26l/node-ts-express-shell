
import nodemailer, { Transporter } from 'nodemailer';

export interface SendMailOptions {
  to: string | string[];
  subject: string;
  htmlBody: string;
  attachements?: Attachement[];
}

export interface Attachement {
  filename: string;
  path: string;
}


export class EmailService {

  private transporter: Transporter;
  
  constructor(
    mailerService: string,// Servicio ocupado por el email con el fin de poder enviar correos electronicos 
    mailerEmail: string,// email (del que enviará los correos electronicos)
    senderEmailPassword: string,// key o password necesario del email para poder enviar correos electronicos 
  ) {
    
    this.transporter = nodemailer.createTransport( {
      service: mailerService,
      auth: {
        user: mailerEmail,
        pass: senderEmailPassword,
      }
    });

  }


  async sendEmail( options: SendMailOptions ): Promise<boolean> {

    const { to, subject, htmlBody, attachements = [] } = options;


    try {

      const sentInformation = await this.transporter.sendMail( {
        to: to,
        subject: subject,
        html: htmlBody,
        attachments: attachements,
      });

      // console.log( sentInformation );

      return true;
    } catch ( error ) {
      return false;
    }

  }


  


}
