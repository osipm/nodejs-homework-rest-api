const mongoose = require("mongoose");

const app = require("./app");

const { DB_HOST, PORT = 3000 } = process.env;

mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log("Database connection successful");
    app.listen(PORT);
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });

// const app = require("./app");
// const { PORT = 3000 } = process.env;
// app.listen(PORT, () => {
//   console.log(`Server running. Use our API on port: ${PORT}`);
// });
