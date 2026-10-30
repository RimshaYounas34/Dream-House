
import "dotenv/config";

import app from "./app.js";
import { connectDatabase } from "./config/db.js";

const PORT = Number(process.env.PORT || 7210);

async function startServer() {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(
        `Dream House API listening on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Unable to start Dream House backend:",
      error.message
    );

    process.exit(1);
  }
}

startServer();
