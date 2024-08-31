import { Hono } from "hono";
import { isAuthed, createCmacSign } from "../utils";

type Env = {
    API_KEY: string;
    PASSWORD_DIGEST: string;
    UUID: string;
    SECRET_KEY: string;
};

interface SesamiStatus {
    batteryPercentage: number;
    batteryVoltage: number;
    position: number;
    CHSesame2Status: string;
    timestamp: number;
}

interface CfRequest {
    password: string;
}

const API_ENTRY = "https://app.candyhouse.co/api/sesame2/";

const isSesamiLocked = async (apiKey: string, uuid: string) => {
    const result = await fetch(`${API_ENTRY}${uuid}`, {
        method: "GET",
        headers: {
            "x-api-key": apiKey,
        },
    });
    const json: SesamiStatus = await result.json();
    return json.CHSesame2Status === "locked";
};

const sesameRequest = async (
    cmd: number,
    apiKey: string,
    uuid: string,
    secretKey: string
) => {
    const sign = await createCmacSign(secretKey);
    const request = {
        cmd: cmd,
        history: btoa("cf_sesame_open"),
        sign: sign,
    };
    return await fetch(`${API_ENTRY}${uuid}/cmd`, {
        method: "POST",
        headers: {
            "x-api-key": apiKey,
            "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify(request),
    });
};

// Entry Point
const sesame = new Hono<{ Bindings: Env }>();

// Lock
sesame.post("/lock", async (c) => {
    if (c.req) {
        const param = await c.req.json<CfRequest>();
        if (
            (await isAuthed(param.password, c.env.PASSWORD_DIGEST)) &&
            !(await isSesamiLocked(c.env.API_KEY, c.env.UUID))
        ) {
            const result = await sesameRequest(
                82, //lock action
                c.env.API_KEY,
                c.env.UUID,
                c.env.SECRET_KEY
            );
            const newResponse = new Response(result.body, result)
            return newResponse;

        }
    }
    return c.text("already locked.");
});

// Unlock
sesame.post("/unlock", async (c) => {
    if (c.req) {
        const param = await c.req.json<CfRequest>();
        if (
            (await isAuthed(param.password, c.env.PASSWORD_DIGEST)) &&
            (await isSesamiLocked(c.env.API_KEY, c.env.UUID))
        ) {
            const result = await sesameRequest(
                83, //unlock action
                c.env.API_KEY,
                c.env.UUID,
                c.env.SECRET_KEY
            );
            const newResponse = new Response(result.body, result)
            return newResponse;

        }
    }
    return c.text("already unlocked.");
});

export { sesame };
