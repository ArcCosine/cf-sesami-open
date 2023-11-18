import { AesCmac } from "aes-cmac";
import { Buffer } from "node:buffer";

export const generateSHA512 = async (message: string) => {
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest(
        { name: "SHA-512" },
        msgUint8
    );
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    return hashHex;
};

export const isAuthed = async (
    inputPassword: string,
    passwordDigest: string
) => {
    return (await generateSHA512(inputPassword)) === passwordDigest;
};

// Ref:https://doc.candyhouse.co/ja/SesameAPI#aes-cmac-%E4%BD%BF%E7%94%A8%E6%96%B9%E6%B3%95
export const createCmacSign = async (secretKey: string) => {
    // * key:key-secret_hex to data
    const key = Buffer.from(secretKey, "hex");

    // message
    // 1. timestamp  (SECONDS SINCE JAN 01 1970. (UTC))  // 1621854456905
    // 2. timestamp to uint32  (little endian)   //f888ab60
    // 3. remove most-significant byte    //0x88ab60
    const date = Math.floor(Date.now() / 1000);
    const dateDate = Buffer.allocUnsafe(4);
    dateDate.writeUInt32LE(date);
    const message = Buffer.from(dateDate.slice(1, 4));

    const aesCmac = new AesCmac(key);
    return Buffer.from(await aesCmac.calculate(message)).toString("hex");
};

export default generateSHA512;
