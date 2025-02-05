require("dotenv").config();
const express = require("express");
const cors = require("cors");
const proxy = require("express-http-proxy");
const bouncer = require("./app/middlewares/bouncer");
const port = process.env.PORT || 8080;
const proxyURIAuth = process.env.PROXY_URI_AUTH;
const proxyURIOffers = process.env.PROXY_URI_OFFERS;

const allowedOrigins = process.env.CORS_ORIGIN.split(',');

const app = express();
app.use(express.json());

const corsOptions = {
  origin: allowedOrigins,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use("/api/auth", proxy(proxyURIAuth));
app.use("/api/offers", bouncer, proxy(proxyURIOffers));

app.listen(port, () => {
  console.log(`API Gateway en cours d'exécution sur le port ${port}`);
});