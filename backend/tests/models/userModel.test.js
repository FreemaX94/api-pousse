const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../../models/userModel');

describe('User Model Tests', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/test_user');
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('User Creation and Validation', () => {
    test('should create a valid user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPass123',
        fullname: 'Test User'
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser.username).toBe(userData.username);
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.fullname).toBe(userData.fullname);
      expect(savedUser.isActive).toBe(false);
      expect(savedUser.role).toBe('user');
      expect(savedUser.emailVerified).toBe(false);
    });

    test('should hash password on save', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPass123'
      };

      const user = new User(userData);
      await user.save();

      const savedUser = await User.findById(user._id).select('+password');
      expect(savedUser.password).not.toBe(userData.password);
      expect(await bcrypt.compare(userData.password, savedUser.password)).toBe(true);
    });

    test('should enforce unique username and email', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPass123'
      };

      await new User(userData).save();

      // Test unique username
      const duplicateUsername = new User({
        ...userData,
        email: 'different@example.com'
      });
      await expect(duplicateUsername.save()).rejects.toThrow();

      // Test unique email
      const duplicateEmail = new User({
        ...userData,
        username: 'differentuser'
      });
      await expect(duplicateEmail.save()).rejects.toThrow();
    });

    test('should validate email format', async () => {
      const userData = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'TestPass123'
      };

      const user = new User(userData);
      await expect(user.save()).rejects.toThrow();
    });

    test('should validate username format', async () => {
      const userData = {
        username: 'test@user!',
        email: 'test@example.com',
        password: 'TestPass123'
      };

      const user = new User(userData);
      await expect(user.save()).rejects.toThrow();
    });

    test('should validate phone number format', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPass123',
        phoneNumber: 'invalid-phone'
      };

      const user = new User(userData);
      await expect(user.save()).rejects.toThrow();
    });

    test('should accept valid phone number', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPass123',
        phoneNumber: '+33123456789'
      };

      const user = new User(userData);
      const savedUser = await user.save();
      expect(savedUser.phoneNumber).toBe(userData.phoneNumber);
    });
  });

  describe('User Authentication Methods', () => {
    test('should compare passwords correctly', async () => {
      const password = 'TestPass123';
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password
      });
      await user.save();

      const savedUser = await User.findById(user._id).select('+password');
      expect(await savedUser.comparePassword(password)).toBe(true);
      expect(await savedUser.comparePassword('wrongpassword')).toBe(false);
    });

    test('should handle login attempts correctly', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPass123'
      });
      await user.save();

      // Test incrementing login attempts
      await user.incLoginAttempts();
      const updatedUser = await User.findById(user._id);
      expect(updatedUser.loginAttempts).toBe(1);

      // Test locking after max attempts
      for (let i = 0; i < 4; i++) {
        await updatedUser.incLoginAttempts();
      }

      const lockedUser = await User.findById(user._id);
      expect(lockedUser.isLocked).toBe(true);
      expect(lockedUser.lockUntil).toBeDefined();
    });

    test('should reset login attempts on successful login', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPass123',
        loginAttempts: 3
      });
      await user.save();

      await user.resetLoginAttempts();
      const updatedUser = await User.findById(user._id);
      expect(updatedUser.loginAttempts).toBeUndefined();
      expect(updatedUser.lastLogin).toBeDefined();
    });
  });

  describe('User Token Generation', () => {
    test('should generate activation token', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPass123'
      });

      const token = user.generateActivationToken();
      expect(token).toBeDefined();
      expect(token.length).toBe(64); // 32 bytes = 64 hex chars
      expect(user.activationToken).toBe(token);
      expect(user.activationExpires).toBeDefined();
    });

    test('should generate reset password token', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPass123'
      });

      const token = user.generateResetPasswordToken();
      expect(token).toBeDefined();
      expect(token.length).toBe(64);
      expect(user.resetPasswordToken).toBe(token);
      expect(user.resetPasswordExpires).toBeDefined();
    });
  });

  describe('User Permissions', () => {
    test('should check permissions correctly for admin', async () => {
      const admin = new User({
        username: 'admin',
        email: 'admin@example.com',
        password: 'AdminPass123',
        role: 'admin'
      });

      expect(admin.hasPermission('any-resource', 'any-action')).toBe(true);
    });

    test('should check permissions correctly for regular user', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPass123',
        permissions: [
          { resource: 'posts', actions: ['read', 'create'] },
          { resource: 'comments', actions: ['read'] }
        ]
      });

      expect(user.hasPermission('posts', 'read')).toBe(true);
      expect(user.hasPermission('posts', 'create')).toBe(true);
      expect(user.hasPermission('posts', 'delete')).toBe(false);
      expect(user.hasPermission('comments', 'read')).toBe(true);
      expect(user.hasPermission('comments', 'create')).toBe(false);
    });
  });

  describe('User Static Methods', () => {
    test('should find user by email or username', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPass123'
      };
      await new User(userData).save();

      const userByEmail = await User.findByEmailOrUsername('test@example.com');
      const userByUsername = await User.findByEmailOrUsername('testuser');

      expect(userByEmail.email).toBe(userData.email);
      expect(userByUsername.username).toBe(userData.username);
    });

    test('should get user statistics', async () => {
      // Create test users
      await User.create([
        { username: 'admin1', email: 'admin1@test.com', password: 'Pass123', role: 'admin', isActive: true },
        { username: 'admin2', email: 'admin2@test.com', password: 'Pass123', role: 'admin', isActive: false },
        { username: 'user1', email: 'user1@test.com', password: 'Pass123', role: 'user', isActive: true },
        { username: 'user2', email: 'user2@test.com', password: 'Pass123', role: 'user', isActive: true },
        { username: 'manager1', email: 'manager1@test.com', password: 'Pass123', role: 'manager', isActive: true }
      ]);

      const stats = await User.getStats();
      
      expect(stats).toHaveLength(3);
      
      const adminStats = stats.find(s => s._id === 'admin');
      const userStats = stats.find(s => s._id === 'user');
      const managerStats = stats.find(s => s._id === 'manager');

      expect(adminStats.count).toBe(2);
      expect(adminStats.active).toBe(1);
      expect(userStats.count).toBe(2);
      expect(userStats.active).toBe(2);
      expect(managerStats.count).toBe(1);
      expect(managerStats.active).toBe(1);
    });
  });

  describe('User Data Sanitization', () => {
    test('should remove sensitive data in toJSON', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPass123',
        resetPasswordToken: 'secret-token',
        twoFactorSecret: 'secret-2fa'
      });

      const jsonUser = user.toJSON();
      expect(jsonUser.password).toBeUndefined();
      expect(jsonUser.resetPasswordToken).toBeUndefined();
      expect(jsonUser.twoFactorSecret).toBeUndefined();
    });

    test('should return safe object without sensitive data', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPass123',
        loginAttempts: 2,
        lockUntil: new Date()
      });

      const safeUser = user.toSafeObject();
      expect(safeUser.password).toBeUndefined();
      expect(safeUser.loginAttempts).toBeUndefined();
      expect(safeUser.lockUntil).toBeUndefined();
      expect(safeUser.username).toBe('testuser');
      expect(safeUser.email).toBe('test@example.com');
    });

    test('should set emailVerified to false when email is modified', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPass123',
        emailVerified: true
      });
      await user.save();

      user.email = 'newemail@example.com';
      await user.save();

      expect(user.emailVerified).toBe(false);
    });
  });

  describe('User Virtual Properties', () => {
    test('should correctly identify locked users', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPass123'
      });

      // User not locked
      expect(user.isLocked).toBe(false);

      // Lock user
      user.lockUntil = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
      expect(user.isLocked).toBe(true);

      // Expired lock
      user.lockUntil = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago
      expect(user.isLocked).toBe(false);
    });
  });
});