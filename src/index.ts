import { Hono } from "hono";
import { generateSHA512 } from "./utils";
import { sesame } from "./sesame/api";

const app = new Hono();

app.get("/", (c) => c.text("cf-sesame-open"));

app.get("/generate/:pass", async (c) => {
    if (c.req) {
        const pass = c.req.param("pass");
        const digest = await generateSHA512(pass);
        return c.text(digest);
    }
    return c.text("Parameter not found");
});

app.route("/api/sesame", sesame);

export default app;
