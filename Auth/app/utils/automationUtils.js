// app/utils/automationUtils.js
const User = require('../models/user'); // Modèle utilisateur

const getUsersForNewsletter = async () => {
  try {
    // On retire le 'select' pour récupérer tout l'utilisateur
    const users = await User.find({ newsSubscription: true });
    return users; // On retourne tous les utilisateurs complets
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs :', error);
    return [];
  }
};

const getEmailsForEmailConfirmationFirst = async () => {
  try {
    // Calcul des dates
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    const sixDaysAgo = new Date();
    sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);

    // Requête pour trouver les utilisateurs avec l'email non confirmé et dont la dernière connexion remonte entre 2 et 6 jours
    const users = await User.find({
      emailConfirmed: false,
      lastConnected: { $gte: twoDaysAgo, $lt: sixDaysAgo } // Plage entre 2 et 6 jours
    });

    // Retourne un tableau contenant les emails des utilisateurs trouvés
    return users;
  } catch (error) {
    console.error('Erreur lors de la récupération des emails :', error);
    return [];
  }
};

const getEmailsForEmailConfirmationSecond = async () => {
  try {
    // Calcul des dates
    const sixDaysAgo = new Date();
    sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Requête pour trouver les utilisateurs avec l'email non confirmé et dont la dernière connexion remonte entre 6 et 7 jours
    const users = await User.find({
      emailConfirmed: false,
      lastConnected: { $gte: sevenDaysAgo, $lt: sixDaysAgo } // Plage entre 6 et 7 jours
    });

    // Retourne un tableau contenant les emails des utilisateurs trouvés
    return users;
  } catch (error) {
    console.error('Erreur lors de la récupération des emails :', error);
    return [];
  }
};

const getEmailsForAccountDeletion = async () => {
  try {
    // Calcul de la date il y a une semaine
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Requête pour trouver les utilisateurs avec l'email non confirmé et dont la dernière connexion remonte à au moins une semaine
    const usersToDelete = await User.find({
      emailConfirmed: false,
      lastConnected: { $lt: oneWeekAgo }
    });

    // Si aucun utilisateur trouvé, retourner un tableau vide
    if (usersToDelete.length === 0) {
      return [];
    }

    // Extraire les emails des utilisateurs à notifier
    const usersToNotify = usersToDelete;

    // Supprimer les utilisateurs de la base de données
    await User.deleteMany({ _id: { $in: usersToDelete.map(user => user._id) } });

    // Retourner la liste des emails des utilisateurs à contacter
    return usersToNotify;
  } catch (error) {
    console.error('Erreur lors de la récupération des emails :', error);
    return [];
  }
};

module.exports = { getUsersForNewsletter, getEmailsForEmailConfirmationFirst, getEmailsForEmailConfirmationSecond, getEmailsForAccountDeletion };