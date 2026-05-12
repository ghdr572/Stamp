const express = require("express");
const app = express();
const { check, validationResult } = require("express-validator");

// Enable JSON parsing for background communication
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static assets from your project folders
app.use( express.static("website"));

// Define backend validation rules to replicate frontend logic
const contactValidation = [
    check("fname")
        .isLength({ min: 3, max: 50 }).withMessage("يجب أن يحتوي الاسم على 3 أحرف على الأقل.")
        .matches(/^[A-Za-zأ-ي\s]+$/).withMessage("يجب أن يحتوي الاسم على أحرف فقط.")
        .trim().escape(), // Sanitize input to prevent harmful content
    check("email")
        .isEmail().withMessage("اكتب بريدًا إلكتورنيًا صالحًا.")
        .trim().escape(),
    check("mobile")
        .matches(/^05[0-9]{8}$/).withMessage("اكتب رقم جوال صحيح من 10 أرقام يبدأ ب 05.")
        .trim().escape(),
    check("message")
        .isLength({ min: 10, max: 2500 }).withMessage("يجب أن تحتوي الرسالة 50 حرفًا على الأقل ولا تتجاوز 2500 حرف.")
        .trim().escape()
];

// Handle form submission using JSON routing
app.post("/process-contact", contactValidation, (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        // Send back validation errors as JSON
        return res.json({ 
            status: false, 
            errors: errors.array().map(err => err.msg) 
        });
    }

    // Success response for AJAX/Fetch
    res.json({ 
        status: true, 
        message: "'.تم إرسال النموذج بنجاح!. شكراً لتواصلك معنا" 
    });
});

const port = 4000;
app.listen(port, () => {
    console.log("Server running on http://localhost:" + port);
});