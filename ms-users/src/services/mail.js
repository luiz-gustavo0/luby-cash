const nodemailer = require('nodemailer');

class Mail {
  async sendMail({ name, email, status }) {
    const transport = nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    await transport.sendMail({
      from: 'lubycash@mail.com.br',
      to: email,
      subject: 'Criação da conta',
      text: 'Sua conta foi aberta!',
      html: `
        <p>Foi cria uma conta no nome de ${name}</p>
        <p>Status ${status ? 'Aprovado' : 'Reprovado'}.</p>
        <p>Caso seu status esteja reprovado você pode tentar novamente.</p>
      `,
    });
  }
}

module.exports = Mail;
