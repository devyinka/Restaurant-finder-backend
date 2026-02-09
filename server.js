require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const latlogrouter = require("./Routes/getlatlog");
const RestuarantRouter = require("./Routes/Getrestaurant");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: true, // Allow all origins in development
  }),
);
app.use(helmet());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/", latlogrouter);
app.use("/", RestuarantRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
