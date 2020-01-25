const express = require("express");
const connectDB = require("./config/db");

const app = express();

//solving corse errors 
app.use((req, res, next) => {
     res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
      res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
      if (req.method === 'OPTIONS') {
        return res.send(204);
      }
      next();
});

connectDB();

//express body parser middleware
app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("API running"));

app.use("/api/users", require("./routes/api/users"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/posts", require("./routes/api/posts"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
