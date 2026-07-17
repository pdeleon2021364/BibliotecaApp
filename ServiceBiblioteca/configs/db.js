import mongoose from "mongoose";

export const dbConnection = async () => {
  if (!process.env.URI_MONGO) {
    console.log('[Servicio A] MongoDB | URI_MONGO no configurada, se omite la conexión.');
    return;
  }

  try {
    mongoose.connection.on("connected", () => {
      console.log("[Servicio A] MongoDB | conectado correctamente");
    });

    mongoose.connection.on("error", () => {
      console.log("[Servicio A] MongoDB | error de conexión");
      mongoose.disconnect();
    });

    await mongoose.connect(process.env.URI_MONGO, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    });
  } catch (error) {
    console.log(`[Servicio A] Error al conectar MongoDB: ${error}`);
  }
};

const gracefulShutdown = async (signal) => {
  console.log(`[Servicio A] Recibido ${signal}. Cerrando conexiones...`);
  await mongoose.connection.close();
  process.exit(0);
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
