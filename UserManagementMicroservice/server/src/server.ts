import app from "./app.js";
import { config } from "./config/index.config.js";
import prisma from "./config/database.config.js";
const PORT = config.port;
const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("connected to database successfully 🚀");
  } catch (error) {
    console.error("database connection failed ", error);
    process.exit(1);
  }
};
const connectServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} 🚀`);
    });
  } catch {
    console.error("server connection failed");
  }
};
connectServer();
