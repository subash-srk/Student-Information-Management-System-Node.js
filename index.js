import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import multer from "multer"
import session from "express-session"; 
import flash from "connect-flash";
import cookieParser from "cookie-parser";
import env from "dotenv";

const port = process.env.PORT || 3000;
const app = express();
env.config();

const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
  });
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static("."));

app.use(cookieParser());

app.use(session({
    secret: "process.env.SESSION_SECRET",
    cookie: { maxAge: 6000 },
    resave: true,
    saveUninitialized: true
}));
app.use(flash());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get("/add", (req, res) => {
    res.render("add_student.ejs");
});

app.post("/add", upload.single('photo'), async (req, res) => {
    // console.log(req.body);
    // console.log(req.file);
    const newRegno = req.body.regno;
    const newName = req.body.studname;
    const newDept = req.body.dept;
    const newFname = req.body.fname;
    const newGender = req.body.gender;
    const newDob = req.body.dob;
    const newPhno = req.body.phno;
    const newEmail = req.body.email;
    const newAddress = req.body.address;
    const newPhoto = req.file.path;
    try{
        if (newRegno != ""){
        await db.query("INSERT INTO student (regno, name, dept, fname, dob, gender, phno, email, address, photo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", [newRegno, newName, newDept, newFname, newDob, newGender, newPhno, newEmail, newAddress, newPhoto]);
        console.log("New Student Added");
        req.flash("message", "Saved Successfully");
        res.redirect("/studentlist");
        }
    }
    catch (err){
        console.log(err);
    }
});

app.get("/studentlist", async (req, res) => {
    try{
        const result = await db.query("SELECT * FROM student ORDER BY regno ASC");
        const items = result.rows;
        // console.log(items);
        res.render("studentlist.ejs", {
            students: items,
            message: req.flash("message")
        });

    }catch (err){
        console.log(err);
    } 
});

app.post("/edit", async (req, res) => {
    const regno = req.body.regno;
    // console.log(regno);
    const edit = await db.query("SELECT * FROM student WHERE regno = $1", [regno]);
    const items_edit = edit.rows[0];
    // console.log(items_edit);
    res.render("edit.ejs", {student: items_edit});
});


// Submits the edited details
app.post("/update", async (req, res) => {
    const newRegno = req.body.regno;
    const newName = req.body.studname;
    const newDept = req.body.dept;
    const newFname = req.body.fname;
    const newGender = req.body.gender;
    const newDob = req.body.dob;
    const newPhno = req.body.phno;
    const newEmail = req.body.email;
    const newAddress = req.body.address;

    try{
        await db.query("UPDATE student SET regno=($1), name=($2), dept=($3), fname=($4), dob=($5), gender=($6), phno=($7), email=($8), address=($9) WHERE regno = $1;", [newRegno, newName, newDept, newFname, newDob, newGender, newPhno, newEmail, newAddress]);
        res.redirect("/studentlist");   
    }
    catch (err){
        console.log(err);
    }
});

// To view individual student detail
app.post("/view", async (req, res) => {
    const regno = req.body.regno;
    // console.log(regno);
    const view = await db.query("SELECT * FROM student WHERE regno = $1", [regno]);
    const items = view.rows[0];
    res.render("view.ejs", {student: items});
});

app.post("/delete", async (req, res) => {
    const regno = req.body.regno;
    try{
        await db.query("DELETE FROM student WHERE regno = $1", [regno]);
        res.redirect("/studentlist");
    }
    catch (err){
        console.log(err);
    }
});

app.get("/dashboard", async (req, res) => {
    const id = 1;
    const view = await db.query("SELECT insname, insaddress FROM institution WHERE id = $1", [id]);
    // console.log(view)
    const items = view.rows[0];
    // console.log(items);
    res.render("dashboard.ejs", {institution: items});
});

app.get("/settings", async (req, res) => {
    const id = 1;
    const view = await db.query("SELECT insname, insaddress FROM institution WHERE id = $1", [id]);
    const items = view.rows[0];
    res.render("settings.ejs", {institution: items} )
});

app.post("/settings", upload.single('insphoto'), async (req, res) => {
    // console.log(req.body);
    const id = 1;
    const newInsName = req.body.insname;
    const newInsAddress = req.body.insaddress;
    // console.log(req.file);
    try{
        await db.query("UPDATE institution SET insname=($2), insaddress=($3) WHERE id = $1;", [id, newInsName, newInsAddress]);
        res.redirect("/dashboard");   
    }
    catch (err){
        console.log(err);
    }
});

app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.post("/login", async (req, res) => {
    const id = 1;
    const failDisplay = " ";
    const userid = req.body.userid;
    const password = req.body.password;
    // console.log(req.body);
    const cred = await db.query("SELECT insid, password FROM institution WHERE id = $1", [id])
    const items = cred.rows[0];
    console.log(items.password);
    if (userid === items.insid && password === items.password) {
        res.redirect("/");
    }
    else{
        res.render("login.ejs");
    }
    
});

app.listen(port, () => {
    console.log(`Server Started at http://localhost:${port}/`);
});
