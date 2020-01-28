const { connect } = require('mongoose');

module.exports = async () => {
  try {
    await connect(process.env.MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
