import cors from "cors";
import express from "express";
import { userRouter } from "./router/userRouter";
import { postRouter } from "./router/postRouter";
import dotenv from "dotenv";
import { commentRouter } from "./router/commentRouter";

dotenv.config();

// Configurando a instância do express
const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/posts/:id/comments", commentRouter);

// Porta
app.listen(Number(process.env.PORT || 3003), () => {
    console.log(`Servidor rodando na porta ${process.env.PORT}`);
})