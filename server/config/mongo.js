const debug = require('debug')('mongo');
const { connect } = require('mongoose');

module.exports = async () => {
  try {
    await connect(process.env.MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    debug('Connected to MongoDB');
  } catch (err) {
    debug(err.message);
    process.exit(1);
  }
}
