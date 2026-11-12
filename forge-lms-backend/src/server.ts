import { createApp } from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";

async function startServer() {
  await connectDB();

  const app = createApp();

  const server = app.listen(env.PORT, () => {
    console.log(`🚀 Forge LMS API server running on: http://localhost:${env.PORT}`);
    console.log(`🏥 Health check at: http://localhost:${env.PORT}/api/health`);
  });

  const shutdown = () => {
    console.log("Stopping server gracefully…");
    server.close(() => {
      console.log("Server closed.");
      process.exit(0);
    });
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

startServer();
