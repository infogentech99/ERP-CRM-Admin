// const mongoose = require("mongoose");

// // Make sure we are running node 10.0+
// const [major, minor] = process.versions.node.split(".").map(parseFloat);
// if (major < 10 || (major === 10 && minor <= 0)) {
//   console.log(
//     "Please go to nodejs.org and download version 10 or greater. 👌\n "
//   );
//   process.exit();
// }

// // import environmental variables from our variables.env file
// require("dotenv").config({ path: ".variables.env" });


// mongoose.connect(process.env.DATABASE, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false,
//   useCreateIndex: true,
// });
// mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
// mongoose.connection.on("error", (err) => {
//   console.error(`🚫 Error → : ${err.message}`);
// });

// const glob = require("glob");
// const path = require("path");

// glob.sync("./models/*.js").forEach(function (file) {
//   require(path.resolve(file));
// });

// // Start our app!
// const app = require("./app");
// app.set("port", process.env.PORT || 80);
// const server = app.listen(app.get("port"), () => {
//   console.log(`Express running → On PORT : ${server.address().port}`);
// });



const mongoose = require("mongoose");
const glob = require("glob");
const path = require("path");
const app = require("./app");

// ✅ 1. Node version check
const [major, minor] = process.versions.node.split(".").map(parseFloat);
if (major < 10 || (major === 10 && minor <= 0)) {
  console.error("🚫 Please upgrade Node.js to version 10 or higher.");
  process.exit();
}

// ✅ 2. Load environment variables
require("dotenv").config({ path: ".variables.env" });

// ✅ 3. Connect to MongoDB
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,  // Optional in newer versions
  useCreateIndex: true,     // Optional in newer versions
});
mongoose.Promise = global.Promise;
mongoose.connection.on("error", (err) => {
  console.error(`🚫 MongoDB connection error → ${err.message}`);
});

// ✅ 4. Auto-load models
glob.sync("./models/*.js").forEach((file) => {
  require(path.resolve(file));
});

// ✅ 5. Start the app
const PORT = process.env.PORT || 80;
app.set("port", PORT);
const server = app.listen(PORT, () => {
  console.log(`✅ Express running → On PORT : ${server.address().port}`);
});
