import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';

export default (sequelize) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Joke, {
        foreignKey: 'createdBy',
        as: 'jokes'
      });
    }

    // Instance method to verify password
    async verifyPassword(password) {
      return bcrypt.compare(password, this.hash_password);
    }
  }

  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'user_id'
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    hash_password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'password_hash'
    },
    profile_picture: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    registration_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'registration_date'
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_login'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_admin'
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: false,
    underscored: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.hash_password) {
          user.hash_password = await bcrypt.hash(user.hash_password, 12);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('hash_password')) {
          user.hash_password = await bcrypt.hash(user.hash_password, 12);
        }
      }
    }
  });

  return User;
};
