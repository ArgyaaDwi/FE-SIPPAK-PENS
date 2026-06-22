import { Hono } from "hono";
import auth from "./routes/auth";
import mahasiswaRouter from "./routes/mahasiswa";
import predictRouter from "./routes/predict";
import academicRouter from "./routes/academic";

const v1 = new Hono();

v1.route("/auth", auth);
v1.route("/mahasiswa", mahasiswaRouter);
v1.route("/predict", predictRouter);
v1.route("/academic", academicRouter);

export default v1;
