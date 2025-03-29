const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const connectDb = require("./config/database");
const initializeSocket=require("./utils/socket");

const app = express();
const http=require("http");


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, 
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"], 
  })
);


app.options("*", cors({
    origin: ["http://localhost:5173"],
    credentials: true
}));
app.options("*", cors()); 
app.use(express.json());
app.use(cookieParser());


const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const postRouter = require("./routes/post");

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user", userRouter);
app.use("/post", postRouter);

const server=http.createServer(app);
initializeSocket(server);



connectDb()
  .then(() => {
    console.log("Database connected successfully!!");
    server.listen(8000, () => {
      console.log("Server is started on port 8000");
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

