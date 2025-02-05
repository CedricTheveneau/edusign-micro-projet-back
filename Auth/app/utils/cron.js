const cron = require('node-cron');
const nodemailer = require('nodemailer');
const { getUsersForNewsletter, getEmailsForEmailConfirmationFirst, getEmailsForEmailConfirmationSecond, getEmailsForAccountDeletion } = require('./automationUtils'); // Utils pour gérer les emails et le contenu

// Configurer le transporteur Nodemailer
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // ou autre service de mail
  port: 587, // Port pour TLS
  secure: false, // true pour 465, false pour d'autres ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS.trim(),
  },
});
// News planifiée tous les Samedi à 10h du matin
cron.schedule('00 08 * * 1', async () => {
  console.log('Envoi de la newsletter démarré...');
  
  // Récupérer les utilisateurs abonnés
  const users = await getUsersForNewsletter();

  if (users.length === 0) {
    console.log('Aucun destinataire trouvé pour la newsletter.');
    return;
  }

  // Parcourir les utilisateurs pour personnaliser et envoyer la newsletter
  for (const user of users) {
    const { email, username } = user;

    // Générer un contenu de newsletter personnalisé
    const newsletterContent = `
      <h1>Bonjour ${username} !</h1>
      <p>Voici les dernières nouvelles de notre site.</p>
      <p>Profitez de nos nouveaux articles et plus encore.</p>
      <p>À bientôt !</p><br/><br/>
      <p>L'équipe Voyage Stoïque</p>
    `;

    // Construire les options de l'email
    const mailOptions = {
      from: `"Cédric de Voyage Stoïque" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Voyage Stoïque | Votre newsletter hebdomadaire',
      html: newsletterContent,
    };

    // Envoyer l'email
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Newsletter envoyée avec succès à ${email}`);
    } catch (error) {
      console.error(`Erreur lors de l’envoi à ${email} :`, error);
    }
  }
}, {
  scheduled: true,
  timezone: "Europe/Paris"
});

cron.schedule('00 10 * * *', async () => {
  console.log('Envoi de la relance démarré...');
  
  // Récupérer les utilisateurs abonnés
  const users = await getEmailsForEmailConfirmationFirst();

  if (users.length === 0) {
    console.log('Aucun destinataire trouvé');
    return;
  }

  // Parcourir les utilisateurs pour personnaliser et envoyer la newsletter
  for (const user of users) {
    const { email, username } = user;

    // Générer un contenu de newsletter personnalisé
    const newsletterContent = `
      <h1>Bonjour ${username} !</h1>
     <p>Ce mail vous est adressé pour vous rappeler que votre compte n'a toujours pas été activé.</p><br/><br/>
     <p>Si vous n'activez pas votre email dans les 5 prochains jours, votre compte et les données associées seront supprimées de notre base de données.</p>
      <p>À bientôt !</p><br/><br/>
      <p>L'équipe Voyage Stoïque</p>
    `;

    // Construire les options de l'email
    const mailOptions = {
      from: `"Cédric de Voyage Stoïque" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Voyage Stoïque | Votre compte n\'est toujours pas activé',
      html: newsletterContent,
    };

    // Envoyer l'email
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Newsletter envoyée avec succès à ${email}`);
    } catch (error) {
      console.error(`Erreur lors de l’envoi à ${email} :`, error);
    }
  }
}, {
  scheduled: true,
  timezone: "Europe/Paris"
});

cron.schedule('00 10 * * *', async () => {
  console.log('Envoi de la relance démarré...');
  
  // Récupérer les utilisateurs abonnés
  const users = await getEmailsForEmailConfirmationSecond();

  if (users.length === 0) {
    console.log('Aucun destinataire trouvé');
    return;
  }

  // Parcourir les utilisateurs pour personnaliser et envoyer la newsletter
  for (const user of users) {
    const { email, username } = user;

    // Générer un contenu de newsletter personnalisé
    const newsletterContent = `
      <h1>Bonjour ${username} !</h1>
     <p>Ceci est la seconde (et dernière) relance pour activer votre compte Voyage Stoïque. En effet, au bout d'une semaine, si un utilisateur n'a pas activé son compte, nous le supprimons avec toutes les informations associées de nos bases de données.</p><br/><br/>
     <p>Pas de panique, cela dit. Même si votre compte finit par être clôturé, vous pourrez toujours, à tout moment, créer un nouveau compte, en cliquant sur le lien ci-dessous :</p><br/<<br/><br/>
     <a style="color:#B0ABED;text-decoration:underline;font-weight:bold;font-style:italic;font-size:18px;text-transform:uppercase;" href="https://voyage-stoique.com/signup">Je crée un nouveau compte !</a><br/><br/><br/>
      <p>À bientôt !</p><br/><br/>
      <p>L'équipe Voyage Stoïque</p>
    `;

    // Construire les options de l'email
    const mailOptions = {
      from: `"Cédric de Voyage Stoïque" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Voyage Stoïque | Plus que 24h pour activer votre compte',
      html: newsletterContent,
    };

    // Envoyer l'email
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Newsletter envoyée avec succès à ${email}`);
    } catch (error) {
      console.error(`Erreur lors de l’envoi à ${email} :`, error);
    }
  }
}, {
  scheduled: true,
  timezone: "Europe/Paris"
});

cron.schedule('00 10 * * *', async () => {
  console.log('Envoi de la notification démarré...');
  
  // Récupérer les utilisateurs abonnés
  const users = await getEmailsForAccountDeletion();

  if (users.length === 0) {
    console.log('Aucun destinataire trouvé');
    return;
  }

  // Parcourir les utilisateurs pour personnaliser et envoyer la newsletter
  for (const user of users) {
    const { email, username } = user;

    // Générer un contenu de newsletter personnalisé
    const newsletterContent = `
      <h1>Bonjour ${username} !</h1>
     <p>Nous vous informons de la suppression de votre compte car vous ne l'avez pas activé suite aux 7 jours de délai que nous vous avons laissé pour l'activer.<br/>Votre compte et toutes les données associées ont été supprimés de nos bases de données.></p><br/><br/>
     <p>Cependant, vous pouvez toujours, à tout moment, créer un nouveau compte, en cliquant sur le lien ci-dessous :</p><br/<<br/><br/>
     <a style="color:#B0ABED;text-decoration:underline;font-weight:bold;font-style:italic;font-size:18px;text-transform:uppercase;" href="https://voyage-stoique.com/signup">Je crée un nouveau compte !</a><br/><br/><br/>
      <p>À bientôt !</p><br/><br/>
      <p>L'équipe Voyage Stoïque</p>
    `;

    // Construire les options de l'email
    const mailOptions = {
      from: `"Cédric de Voyage Stoïque" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Voyage Stoïque | Suppression de votre compte',
      html: newsletterContent,
    };

    // Envoyer l'email
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Newsletter envoyée avec succès à ${email}`);
    } catch (error) {
      console.error(`Erreur lors de l’envoi à ${email} :`, error);
    }
  }
}, {
  scheduled: true,
  timezone: "Europe/Paris"
});