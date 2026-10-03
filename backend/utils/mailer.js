import nodemailer from "nodemailer";

// ============================================================
// GMAIL TRANSPORTER
// ============================================================

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

// ============================================================
// SEND PASSWORD RESET EMAIL
// ============================================================

export async function sendPasswordResetEmail({
  to,
  name,
  resetUrl,
}) {
  if (!process.env.MAIL_USER || !process.env.MAIL_PASSWORD) {
    throw new Error(
      "MAIL_USER or MAIL_PASSWORD is missing in backend .env"
    );
  }

  const mailOptions = {
    from: `"Dream House Planner" <${process.env.MAIL_USER}>`,

    to,

    subject: "Reset Your Dream House Planner Password",

    // ========================================================
    // PLAIN TEXT EMAIL
    // ========================================================

    text: `
Hello ${name || "User"},

We received a request to reset your Dream House Planner password.

Use the link below to create a new password:

${resetUrl}

This link will expire in 15 minutes.

If you did not request a password reset, you can safely ignore this email.

Dream House Planner
`,

    // ========================================================
    // HTML EMAIL
    // ========================================================

    html: `
      <!DOCTYPE html>

      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Reset Your Password</title>
        </head>

        <body
          style="
            margin:0;
            padding:0;
            background:#f4f7f5;
            font-family:Arial,Helvetica,sans-serif;
          "
        >

          <div
            style="
              padding:40px 15px;
              background:#f4f7f5;
            "
          >

            <div
              style="
                max-width:560px;
                margin:0 auto;
                background:#ffffff;
                border-radius:18px;
                padding:35px;
                box-shadow:0 8px 30px rgba(0,0,0,0.08);
              "
            >

              <!-- LOGO / BRAND -->

              <div
                style="
                  text-align:center;
                  margin-bottom:28px;
                "
              >

                <div
                  style="
                    font-size:28px;
                    font-weight:800;
                    color:#0b5d46;
                  "
                >
                  Dream House Planner
                </div>

                <div
                  style="
                    margin-top:7px;
                    font-size:13px;
                    color:#777777;
                  "
                >
                  Design your dream home
                </div>

              </div>


              <!-- TITLE -->

              <h2
                style="
                  margin:0 0 15px;
                  color:#222222;
                  font-size:24px;
                "
              >
                Reset Your Password
              </h2>


              <!-- GREETING -->

              <p
                style="
                  margin:0 0 15px;
                  color:#555555;
                  line-height:1.7;
                  font-size:15px;
                "
              >
                Hello ${name || "User"},
              </p>


              <!-- MESSAGE -->

              <p
                style="
                  margin:0 0 20px;
                  color:#555555;
                  line-height:1.7;
                  font-size:15px;
                "
              >
                We received a request to reset your Dream House Planner
                account password. Click the button below to create a new
                password.
              </p>


              <!-- BUTTON -->

              <div
                style="
                  text-align:center;
                  margin:30px 0;
                "
              >

                <a
                  href="${resetUrl}"
                  target="_blank"
                  style="
                    display:inline-block;
                    padding:14px 28px;
                    background:#0b5d46;
                    color:#ffffff;
                    text-decoration:none;
                    border-radius:10px;
                    font-weight:700;
                    font-size:14px;
                  "
                >
                  Reset Password
                </a>

              </div>


              <!-- EXPIRY -->

              <p
                style="
                  margin:0 0 12px;
                  color:#777777;
                  font-size:13px;
                  line-height:1.6;
                "
              >
                This password-reset link will expire in
                <strong>15 minutes</strong>.
              </p>


              <!-- SECURITY -->

              <p
                style="
                  margin:0;
                  color:#777777;
                  font-size:13px;
                  line-height:1.6;
                "
              >
                If you did not request a password reset, you can safely
                ignore this email.
              </p>


              <!-- DIVIDER -->

              <hr
                style="
                  border:none;
                  border-top:1px solid #eeeeee;
                  margin:28px 0;
                "
              />


              <!-- FOOTER -->

              <p
                style="
                  margin:0;
                  text-align:center;
                  color:#999999;
                  font-size:12px;
                "
              >
                Dream House Planner
              </p>

            </div>

          </div>

        </body>
      </html>
    `,
  };

  // ==========================================================
  // SEND EMAIL
  // ==========================================================

  const info = await transporter.sendMail(mailOptions);

  // ==========================================================
  // DEBUG INFORMATION
  // ==========================================================

  console.log("");
  console.log("==============================================");
  console.log("📧 PASSWORD RESET EMAIL");
  console.log("==============================================");
  console.log("From:", process.env.MAIL_USER);
  console.log("To:", to);
  console.log("Message ID:", info.messageId);
  console.log("Accepted:", info.accepted);
  console.log("Rejected:", info.rejected);
  console.log("Response:", info.response);
  console.log("==============================================");
  console.log("");

  return info;
}