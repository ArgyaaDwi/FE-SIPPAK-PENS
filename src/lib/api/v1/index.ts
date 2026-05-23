import { Hono } from "hono";
import auth from "./routes/auth";
import mahasiswaRouter from "./routes/mahasiswa";
import predictRouter from "./routes/predict";

const v1 = new Hono();

v1.route("/auth", auth);
v1.route("/mahasiswa", mahasiswaRouter);
v1.route("/predict", predictRouter);

export default v1;
