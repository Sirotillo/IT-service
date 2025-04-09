const express = require("express");
const config = require("config");
const mainRouter = require("./routes/index.routes");
const PORT = config.get("port") || 3030;

const sequelize = require("./config/db");

const app = express();

app.use(express.json());
app.use("/api", mainRouter);
async function start() {
  try {
    await sequelize.authenticate(); // databaza ga ulandmi yoqmi test qiladi
    await sequelize.sync({ alter: true });
    app.listen(PORT, () => {
      console.log(`Server started at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();
