require("dotenv").config();
const http = require("http");
const app = require("./src/app");

server = http.createServer(app);

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
