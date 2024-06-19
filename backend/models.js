import { DataTypes } from 'sequelize';
import sequelize from './database.js';
import bcrypt from 'bcryptjs';

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('student', 'teacher', 'admin'),
    allowNull: false
  }
});

User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  
  user.password = await bcrypt.hash(user.password, salt);
});

const Notes = sequelize.define('Notes', {
  note1: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    validate: {
      min: 0,
      max: 10
    }
  },
  note2: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    validate: {
      min: 0,
      max: 10
    }
  },
  note3: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    validate: {
      min: 0,
      max: 10
    }
  },
  finalNote: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    get() {
      const note1 = this.getDataValue('note1');
      const note2 = this.getDataValue('note2');
      const note3 = this.getDataValue('note3');
      if (note1 !== null && note2 !== null && note3 !== null) {
        return (note1 * 0.30 + note2 * 0.30 + note3 * 0.40).toFixed(2);
      }
      return null;
    }
  },
  studentId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users', // refers to table name
      key: 'id'
    },
    allowNull: false
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false
  },
  teacherId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users', // refers to table name
      key: 'id'
    },
    allowNull: false
  }
});

// Associations
User.hasMany(Notes, { as: 'studentNotes', foreignKey: 'studentId' });
User.hasMany(Notes, { as: 'teacherNotes', foreignKey: 'teacherId' });
Notes.belongsTo(User, { as: 'student', foreignKey: 'studentId' });
Notes.belongsTo(User, { as: 'teacher', foreignKey: 'teacherId' });

export { User, Notes };