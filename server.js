const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
    console.log('uncaught Exception');
    console.log(err);
    process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require("./app");

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
}).then(con => {
    // console.log(con.connections);
    console.log("DB Connections Successful!");
});
// console.log(process.env);


const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}`);
});

process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log('UNHADLED REJECTION');
    server.close(() => {
        process.exit(1);
    });
});
