const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const connectDb = require("./config/database");


const app = express();
const http=require("http");


app.use(
  cors({
    origin: "https://postgramm.netlify.app",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// app.use(cors({
//     origin: "https://astonishing-snickerdoodle-17c3e4.netlify.app/",
//     credentials: true
// }));
app.options("*", cors()); 
app.use(express.json());
app.use(cookieParser());


const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const postRouter = require("./routes/post");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", postRouter);

const server=http.createServer(app);




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

