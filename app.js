// const express = require("express");
// const session = require("express-session");
// const MongoStore = require("connect-mongo");
// const path = require("path");
// const bodyParser = require("body-parser");
// const promisify = require("es6-promisify");

// const apiRouter = require("./routes/api");
// const authApiRouter = require("./routes/authApi");

// const errorHandlers = require("./handlers/errorHandlers");

// const { isValidToken } = require("./controllers/authController");

// require("dotenv").config({ path: ".variables.env" });

// const app = express();

// app.use(express.static(path.join(__dirname, "public")));

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.use(
//   session({
//     secret: process.env.SECRET,
//     key: process.env.KEY,
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({ mongoUrl: process.env.DATABASE }),
//   })
// );

// app.use((req, res, next) => {
//   res.locals.admin = req.admin || null;
//   res.locals.currentPath = req.path;
//   next();
// });

// app.use((req, res, next) => {
//   req.login = promisify(req.login, req);
//   next();
// });

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header("Access-Control-Allow-Methods", "GET,PATCH,PUT,POST,DELETE");
//   res.header("Access-Control-Expose-Headers", "Content-Length");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Accept, Authorization,x-auth-token, Content-Type, X-Requested-With, Range"
//   );
//   if (req.method === "OPTIONS") {
//     return res.sendStatus(200);
//   } else {
//     return next();
//   }
// });

// app.use("/api", authApiRouter);

// app.use("/api", apiRouter);
// app.use(errorHandlers.notFound);

// if (app.get("env") === "development") {
//   app.use(errorHandlers.developmentErrors);
// }
// app.use(errorHandlers.productionErrors);
// module.exports = app;





const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const promisify = require("es6-promisify");

const apiRouter = require("./routes/api");
const authApiRouter = require("./routes/authApi");

const errorHandlers = require("./handlers/errorHandlers");
const { isValidToken } = require("./controllers/authController");

require("dotenv").config({ path: ".variables.env" });

const app = express();

// ✅ Setup CORS properly
const allowedOrigins = [
  "https://crm-admin-nu.vercel.app", // your frontend domain
  "http://localhost:3000",           // optional for local dev
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS Not Allowed"));
      }
    },
    credentials: true,
  })
);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Sessions
app.use(
  session({
    secret: process.env.SECRET,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  })
);

// Add login support + locals
app.use((req, res, next) => {
  res.locals.admin = req.admin || null;
  res.locals.currentPath = req.path;
  req.login = promisify(req.login, req);
  next();
});

// Routes
app.use("/api", authApiRouter);
app.use("/api", apiRouter);

// 404 handler
app.use(errorHandlers.notFound);

// Error handler
if (app.get("env") === "development") {
  app.use(errorHandlers.developmentErrors);
}
app.use(errorHandlers.productionErrors);

module.exports = app;
