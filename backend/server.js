const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const flightRoutes = require("./routes/flights");

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use("/api/flights", flightRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
