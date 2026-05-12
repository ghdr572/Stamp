const express = require("express");
const app = express();
const mysql = require("mysql2"); // Database driver
const { check, validationResult } = require("express-validator");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("website"));

// MAMP Database Connection Configuration
const dbConfig = {
    host: "127.0.0.1",
    user: "root",
    password: "root",
    port: "8889",
    database: "tutorial"
};

// --- TABLE 1: CONTACT US ---
const contactValidation = [
    check("fname")
        .isLength({ min: 3, max: 50 }).withMessage("يجب أن يحتوي الاسم على 3 أحرف على الأقل.")
        .matches(/^[A-Za-zأ-ي\s]+$/).withMessage("يجب أن يحتوي الاسم على أحرف فقط.")
        .trim().escape(),
    check("email")
        .isEmail().withMessage("اكتب بريدًا إلكتورنيًا صالحًا.")
        .trim().escape(),
    check("mobile")
        .matches(/^05[0-9]{8}$/).withMessage("اكتب رقم جوال صحيح من 10 أرقام يبدأ ب 05.")
        .trim().escape(),
    check("message")
        .isLength({ min: 10, max: 2500 }).withMessage("يجب أن تحتوي الرسالة على 10 أحرف على الأقل.")
        .trim().escape()
];

app.post("/process-contact", contactValidation, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ status: false, errors: errors.array().map(err => err.msg) });
    }

    const { fname, email, mobile, gender, dob, language, message } = req.body;
    const db = mysql.createConnection(dbConfig);
    
    db.connect((err) => {
        if (err) throw err;
        const sql = "INSERT INTO contacts (fname, email, mobile, gender, dob, language, message) VALUES (?, ?, ?, ?, ?, ?, ?)";
        db.query(sql, [fname, email, mobile, gender, dob, language, message], (err) => {
            if (err) throw err;
            db.end();
            res.json({ status: true, message: "تم إرسال نموذج التواصل وحفظه بنجاح!" });
        });
    });
});

// --- TABLE 2: MONTHLY PARTICIPATION (STORAGE) ---
app.post("/process-participation", [
    check("name").isLength({ min: 3 }).trim().escape(),
    check("email").isEmail().trim().escape(),
    check("message").isLength({ min: 10 }).trim().escape()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.json({ status: false, errors: errors.array().map(err => err.msg) });

    const { name, email, type, message } = req.body;
    const db = mysql.createConnection(dbConfig);

    db.connect((err) => {
        if (err) throw err;
        const sql = "INSERT INTO contributions (name, email, type, message) VALUES (?, ?, ?, ?)";
        db.query(sql, [name, email, type, message], (err) => {
            if (err) throw err;
            db.end();
            res.json({ status: true, message: "تم حفظ مشاركتك بنجاح!" });
        });
    });
});

// --- RETRIEVE DATA (SELECT QUERY) ---
app.get("/get-contributions", (req, res) => {
    const db = mysql.createConnection(dbConfig);
    db.connect((err) => {
        if (err) throw err;
        // Fetching data to display in the frontend gallery
        db.query("SELECT name, type, message FROM contributions ORDER BY id DESC", (err, results) => {
            if (err) throw err;
            db.end();
            res.json(results);
        });
    });
});

const port = 4000;
app.listen(port, () => {
    console.log("Server running on http://localhost:" + port);
});