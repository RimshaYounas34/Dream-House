import ContactMessage from "../models/ContactMessage.js";

/* =========================================================
   GET ALL CONTACT QUERIES
========================================================= */

export async function listContactMessages(req, res) {
  const messages = await ContactMessage.find({})
    .sort({ createdAt: -1 })
    .lean();

  const newCount = await ContactMessage.countDocuments({
    status: "new",
  });

  return res.json({
    success: true,
    data: {
      messages,
      newCount,
      total: messages.length,
    },
  });
}

/* =========================================================
   GET SINGLE CONTACT QUERY
========================================================= */

export async function getContactMessage(req, res) {
  const { id } = req.params;

  const message = await ContactMessage.findById(id).lean();

  if (!message) {
    return res.status(404).json({
      success: false,
      message: "Contact query not found.",
    });
  }

  return res.json({
    success: true,
    data: message,
  });
}

/* =========================================================
   UPDATE QUERY STATUS
========================================================= */

export async function updateContactMessageStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatuses = ["new", "read", "resolved"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid query status.",
    });
  }

  const message = await ContactMessage.findByIdAndUpdate(
    id,
    { status },
    {
      new: true,
      runValidators: true,
    }
  ).lean();

  if (!message) {
    return res.status(404).json({
      success: false,
      message: "Contact query not found.",
    });
  }

  return res.json({
    success: true,
    message: "Query status updated successfully.",
    data: message,
  });
}

/* =========================================================
   DELETE CONTACT QUERY
========================================================= */

export async function deleteContactMessage(req, res) {
  const { id } = req.params;

  const message = await ContactMessage.findByIdAndDelete(id);

  if (!message) {
    return res.status(404).json({
      success: false,
      message: "Contact query not found.",
    });
  }

  return res.json({
    success: true,
    message: "Query deleted successfully.",
  });
}