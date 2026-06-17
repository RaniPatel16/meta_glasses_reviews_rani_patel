const { exec } = require('child_process');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const DB_URI = process.env.MONGO_URI;
const BACKUP_PATH = path.join(__dirname, '../backups');

const backupDatabase = () => {
  if (!DB_URI) {
    console.error('MONGO_URI is not defined in .env file');
    return;
  }
  
  // Basic level backup script using mongodump
  // Note: requires MongoDB database tools installed locally
  const command = `mongodump --uri="${DB_URI}" --out="${BACKUP_PATH}"`;
  
  console.log('Starting basic database backup...');
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Backup Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`Backup Info: ${stderr}`);
    }
    console.log(`Backup completed successfully at ${BACKUP_PATH}`);
  });
};

backupDatabase();
