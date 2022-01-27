const mongoose = require("mongoose");

require("dotenv").config();

const { DB__HOST } = process.env;

mongoose
  .connect(DB__HOST)
  .then(() => console.log("database connect success"))
  .catch((error) => console.log(error.message));

// const app = require("./app");
// const { PORT = 3000 } = process.env;
// app.listen(PORT, () => {
//   console.log(`Server running. Use our API on port: ${PORT}`);
// });
