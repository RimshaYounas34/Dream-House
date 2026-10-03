import jwt from "jsonwebtoken";
import crypto from "crypto";

import User from "../models/User.js";
import Setting from "../models/Setting.js";
import firebaseAdmin from "../config/firebaseAdmin.js";
import { sendPasswordResetEmail } from "../utils/mailer.js";

// ============================================================
// PUBLIC USER
// ============================================================
function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    authProvider: user.authProvider || "email",
    photoURL: user.photoURL || "",
  };
}

// ============================================================
// JWT TOKEN
// ============================================================
function tokenFor(user) {
  return jwt.sign(
    {
      sub: String(user._id),
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
}

// ============================================================
// NORMAL EMAIL / PASSWORD REGISTER
// ============================================================
export async function register(req, res) {
  const settings = await Setting.getGlobal();

  if (!settings.registrationOpen) {
    return res.status(403).json({
      success: false,
      message: "New registrations are currently closed",
    });
  }

  const { name, email, password } = req.body || {};

  if (!name?.trim() || !email?.trim() || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email and password are required",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existing = await User.findOne({
    email: normalizedEmail,
  });

  if (existing) {
    return res.status(409).json({
      success: false,
      message: "An account with that email already exists",
    });
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: "user",
    status: "active",
    authProvider: "email",
    lastLoginAt: new Date(),
  });

  return res.status(201).json({
    success: true,
    data: {
      user: publicUser(user),
      token: tokenFor(user),
    },
  });
}

// ============================================================
// NORMAL EMAIL / PASSWORD LOGIN
// ============================================================
export async function login(req, res) {
  const { email, password } = req.body || {};

  const normalizedEmail = String(email || "")
    .trim()
    .toLowerCase();

  const user = await User.findOne({
    email: normalizedEmail,
  }).select("+password");

  if (!user || !(await user.comparePassword(password || ""))) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  if (user.status === "inactive") {
    return res.status(403).json({
      success: false,
      message:
        "Your account has been deactivated. Contact the administrator.",
    });
  }

  user.lastLoginAt = new Date();

  await user.save({
    validateModifiedOnly: true,
  });

  return res.json({
    success: true,
    data: {
      user: publicUser(user),
      token: tokenFor(user),
    },
  });
}

// ============================================================
// GOOGLE LOGIN / SIGNUP
// ============================================================
export async function googleLogin(req, res) {
  console.log("");
  console.log("==============================================");
  console.log("GOOGLE AUTH REQUEST RECEIVED");
  console.log("==============================================");

  const { idToken } = req.body || {};

  if (!idToken) {
    console.log("❌ No Firebase ID token received");

    return res.status(400).json({
      success: false,
      message: "Google authentication token is required",
    });
  }

  console.log("✅ Firebase ID token received");
  console.log("Token length:", idToken.length);

  try {
    console.log("Checking Firebase ID token...");

    const decodedToken = await firebaseAdmin.verifyIdToken(idToken);

    console.log("✅ Firebase token verified");
    console.log("Firebase UID:", decodedToken.uid);
    console.log("Firebase email:", decodedToken.email);
    console.log("Firebase name:", decodedToken.name || "Not provided");

    const email = decodedToken.email?.trim().toLowerCase();

    const name =
      decodedToken.name?.trim() ||
      decodedToken.email?.split("@")[0] ||
      "Google User";

    const photoURL = decodedToken.picture || "";

    if (!email) {
      console.log("❌ Google email not available");

      return res.status(400).json({
        success: false,
        message: "Google account email could not be verified",
      });
    }

    console.log("Google account:");
    console.log({
      email,
      name,
      hasPhoto: Boolean(photoURL),
    });

    console.log("MongoDB database:", User.db.name);

    console.log("Searching MongoDB for:", email);

    let user = await User.findOne({
      email,
    });

    if (user) {
      console.log("✅ Existing MongoDB user found");
      console.log("User ID:", String(user._id));
      console.log("User provider:", user.authProvider);
      console.log("User role:", user.role);

      if (user.status === "inactive") {
        console.log("❌ User account is inactive");

        return res.status(403).json({
          success: false,
          message:
            "Your account has been deactivated. Contact the administrator.",
        });
      }

      if (!user.name?.trim()) {
        user.name = name;
      }

      if (photoURL) {
        user.photoURL = photoURL;
      }

      user.lastLoginAt = new Date();

      if (!user.authProvider) {
        user.authProvider = "google";
      }

      await user.save({
        validateModifiedOnly: true,
      });

      console.log("✅ Existing user updated successfully");

      return res.json({
        success: true,
        data: {
          user: publicUser(user),
          token: tokenFor(user),
        },
      });
    }

    console.log("No existing user found.");
    console.log("Creating new Google user...");

    const settings = await Setting.getGlobal();

    console.log(
      "Registration open:",
      settings.registrationOpen
    );

    if (!settings.registrationOpen) {
      console.log("❌ Registration is closed");

      return res.status(403).json({
        success: false,
        message: "New registrations are currently closed",
      });
    }

    const internalPassword = crypto
      .randomBytes(32)
      .toString("hex");

    user = await User.create({
      name,
      email,
      password: internalPassword,
      role: "user",
      status: "active",
      authProvider: "google",
      photoURL,
      lastLoginAt: new Date(),
    });

    console.log("");
    console.log("🎉 GOOGLE USER CREATED SUCCESSFULLY");
    console.log("----------------------------------------------");
    console.log("MongoDB ID:", String(user._id));
    console.log("Name:", user.name);
    console.log("Email:", user.email);
    console.log("Role:", user.role);
    console.log("Status:", user.status);
    console.log("Provider:", user.authProvider);
    console.log("Database:", User.db.name);
    console.log("----------------------------------------------");

    return res.status(201).json({
      success: true,
      data: {
        user: publicUser(user),
        token: tokenFor(user),
      },
    });
  } catch (error) {
    console.error("");
    console.error("==============================================");
    console.error("❌ GOOGLE AUTHENTICATION ERROR");
    console.error("==============================================");
    console.error("Message:", error.message);
    console.error("Name:", error.name);
    console.error("Code:", error.code || "N/A");
    console.error("==============================================");

    return res.status(401).json({
      success: false,
      message: "Google authentication failed",
    });
  }
}

// ============================================================
// FORGOT PASSWORD
// ============================================================
export async function forgotPassword(req, res) {
  console.log("");
  console.log("==============================================");
  console.log("🔐 FORGOT PASSWORD ROUTE HIT");
  console.log("==============================================");

  const { email } = req.body || {};

  console.log("Request received");
  console.log("Email provided:", email ? "YES" : "NO");

  const normalizedEmail = String(email || "")
    .trim()
    .toLowerCase();

  console.log("Normalized email:", normalizedEmail);

  if (!normalizedEmail) {
    console.log("❌ Email is missing");

    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  const genericMessage =
    "If an account with that email exists, a password reset link has been sent.";

  console.log("Searching MongoDB for user...");

  const user = await User.findOne({
    email: normalizedEmail,
  });

  if (!user) {
    console.log("⚠️ No user found with this email");
    console.log("Returning generic response");

    return res.json({
      success: true,
      message: genericMessage,
    });
  }

  console.log("✅ User found");
  console.log("User ID:", String(user._id));
  console.log("User name:", user.name);
  console.log("User provider:", user.authProvider);
  console.log("User status:", user.status);

  // Google-only accounts should continue using Google login.
  if (user.authProvider === "google") {
    console.log("⚠️ This is a Google account");
    console.log("Password reset email will not be sent");

    return res.json({
      success: true,
      message: genericMessage,
    });
  }

  if (user.status === "inactive") {
    console.log("⚠️ User account is inactive");

    return res.json({
      success: true,
      message: genericMessage,
    });
  }

  console.log("Generating password reset token...");

  const rawToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  user.resetPasswordToken = hashedToken;

  user.resetPasswordExpires = new Date(
    Date.now() + 15 * 60 * 1000
  );

  console.log("Saving reset token in MongoDB...");

  await user.save({
    validateModifiedOnly: true,
  });

  console.log("✅ Reset token saved");

  const clientUrl =
    process.env.CLIENT_URL || "http://localhost:5173";

  const resetUrl =
    `${clientUrl}/reset-password?token=${encodeURIComponent(rawToken)}`;

  console.log("Reset URL generated");
  console.log("Client URL:", clientUrl);
  console.log("Reset URL ready: YES");

  console.log("==============================================");
  console.log("📧 CALLING PASSWORD RESET MAILER");
  console.log("==============================================");

  try {
    const emailInfo = await sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      resetUrl,
    });

    console.log("==============================================");
    console.log("✅ PASSWORD RESET EMAIL FUNCTION COMPLETED");
    console.log("==============================================");

    if (emailInfo) {
      console.log("Message ID:", emailInfo.messageId);
      console.log("Accepted:", emailInfo.accepted);
      console.log("Rejected:", emailInfo.rejected);
      console.log("Response:", emailInfo.response);
    }

    console.log("==============================================");
  } catch (error) {
    console.error("");
    console.error("==============================================");
    console.error("❌ PASSWORD RESET EMAIL FAILED");
    console.error("==============================================");
    console.error("Error message:", error.message);
    console.error("Error name:", error.name);
    console.error("Error code:", error.code || "N/A");
    console.error("==============================================");

    // Remove token if email could not be sent.
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save({
      validateModifiedOnly: true,
    });

    return res.status(500).json({
      success: false,
      message:
        "Unable to send password reset email. Please try again later.",
    });
  }

  console.log("Returning success response to frontend");

  return res.json({
    success: true,
    message: genericMessage,
  });
}

// ============================================================
// RESET PASSWORD
// ============================================================
export async function resetPassword(req, res) {
  const { token, password } = req.body || {};

  if (!token || !password) {
    return res.status(400).json({
      success: false,
      message: "Reset token and new password are required",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters",
    });
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: {
      $gt: new Date(),
    },
  }).select(
    "+password +resetPasswordToken +resetPasswordExpires"
  );

  if (!user) {
    return res.status(400).json({
      success: false,
      message:
        "This password reset link is invalid or has expired.",
    });
  }

  user.password = password;
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;

  await user.save();

  return res.json({
    success: true,
    message:
      "Your password has been reset successfully. You can now log in.",
  });
}

// ============================================================
// CURRENT LOGGED-IN USER
// ============================================================
export function me(req, res) {
  return res.json({
    success: true,
    data: {
      user: publicUser(req.user),
    },
  });
}