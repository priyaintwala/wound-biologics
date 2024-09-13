import Typesense from "typesense";

export const typesense = new Typesense.Client({
    nodes: [
        {
            host: "qholmefi1ubw9vjtp-1.a1.typesense.net",
            port: 443,
            protocol: "https",
        },
    ],
    apiKey: "KvWW1nVbClDuwBiNI5FPCj0fx8NxNJoR",
});
