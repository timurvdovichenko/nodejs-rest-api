const app = require('./app');

const mongoose = require('mongoose');

const DB_HOST =
  'mongodb+srv://contacts_db_admin:UjVSgP1kAkCISOQK@cluster0.hguz3za.mongodb.net/db-contacts?retryWrites=true&w=majority';

mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log('Database connection successful');
    app.listen(3000, () => {
      console.log('Server running. Use our API on port: 3000');
    });
  })
  .catch(e => {
    console.log(e.message);
    process.exit(1);
  });

// app.listen(3000, () => {
//   console.log('Server running. Use our API on port: 3000');
// });
