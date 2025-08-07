#!/usr/bin/env node

const mongoose = require('mongoose');
const User = require('../models/userModel');
const Role = require('../models/Role');
const Permission = require('../models/Permission');
require('dotenv').config();

async function setupSuperAdmin() {
  try {
    console.log('🔧 Configuration Super Admin pour Freex94...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/api-pousse');
    console.log('✅ Connecté à MongoDB');

    // Create super admin role manually
    console.log('🚀 Création du rôle Super Admin...');
    
    let superAdminRole = await Role.findOne({ name: 'super_admin' });
    if (!superAdminRole) {
      superAdminRole = new Role({
        name: 'super_admin',
        displayName: 'Super Administrateur',
        description: 'Accès total au système',
        level: 100,
        isSystem: true,
        color: '#DC2626',
        permissions: [] // Will be populated with all permissions
      });
      await superAdminRole.save();
      console.log('✅ Rôle Super Admin créé');
    } else {
      console.log('✅ Rôle Super Admin existe déjà');
    }

    // Find user Freex94
    const user = await User.findOne({ 
      $or: [
        { username: 'Freex94' },
        { username: 'freex94' },
        { email: { $regex: /freex94/i } }
      ]
    });

    if (!user) {
      console.log('❌ Utilisateur Freex94 non trouvé');
      console.log('📝 Création de l\'utilisateur Freex94...');
      
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('SuperAdmin2025!', 12);
      
      const newUser = new User({
        username: 'Freex94',
        email: 'freex94@api-pousse.com',
        fullname: 'Freex94 Super Admin',
        password: hashedPassword,
        isActive: true,
        role: 'admin'
      });
      
      await newUser.save();
      console.log('✅ Utilisateur Freex94 créé');
      
      // Assign super_admin role
      newUser.roles = [superAdminRole._id];
      await newUser.save();
      console.log('👑 Rôle Super Admin assigné à Freex94');
      
      console.log('📧 Email: freex94@api-pousse.com');
      console.log('🔑 Mot de passe: SuperAdmin2025!');
      
    } else {
      console.log(`✅ Utilisateur trouvé: ${user.username} (${user.email})`);
      
      // Ensure user is active
      if (!user.isActive) {
        user.isActive = true;
        await user.save();
        console.log('✅ Utilisateur activé');
      }
      
      // Assign super_admin role
      if (!user.roles.includes(superAdminRole._id)) {
        user.roles.push(superAdminRole._id);
        await user.save();
      }
      console.log('👑 Rôle Super Admin assigné à Freex94');
    }

    // Success message
    const finalUser = user || newUser;
    console.log(`🔐 Utilisateur configuré: ${finalUser.username} (${finalUser.email})`);
    console.log(`👑 Niveau d'accès: Super Administrateur (niveau ${superAdminRole.level})`);

    console.log('\n🎉 Configuration terminée avec succès!');
    console.log('🔗 Freex94 a maintenant accès complet à toutes les fonctionnalités');
    
  } catch (error) {
    console.error('❌ Erreur lors de la configuration:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

// Run setup
setupSuperAdmin();