const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const PostRoute = require("./routes/post");
const CommentRoute = require("./routes/comment");

// Load environment variables first!
dotenv.config();

const app = express();

const PORT = process.env.PORT || 4000;
const URI = process.env.MongoDBURI; // Moved here, before using in mongoose.connect

// Middleware to handle CORS
// This allows your server to accept requests from different origins
app.use(cors({
    origin: '*'
}));

// Connect to MongoDB
if (!URI) {
    console.error("Error: MongoDB URI is undefined. Check your .env file.");
    process.exit(1);
}

mongoose
    .connect(URI, {})
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("Error connecting to MongoDB:", error));

// Middleware
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// // Multer setup
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "public/images/");
//     },
//     filename: (req, file, cb) => {
//         const fileName = Date.now() + path.extname(file.originalname);
//         cb(null, fileName);
//     }    
// });

// const upload = multer({ storage });

// app.post('/api/upload', upload.single('file'), (req, res) => {
//     console.log("File upload request received");
//     try {
//         console.log(req.file);
//         res.status(200).json({ message: 'File uploaded successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Something went wrong during file upload.' });
//     }
// });

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images/");
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
        console.log("Uploaded file: ", req.file);
        res.status(200).json({ message: 'File uploaded successfully', filename: req.file.filename });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong during file upload.' });
    }
});


// Route Middleware
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", PostRoute);
app.use("/api/comments", CommentRoute);

// Routes
app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/users", (req, res) => {
    res.send("Hello Users!");
});

app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}`);
});
