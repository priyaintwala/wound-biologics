// import { CollectionCreateSchema } from "typesense/lib/Typesense/Collections.js";

export const typesenseSchemas = {
    userTypesenseSchema: {
        name: "users",
        fields: [
            { name: "id", type: "string" },
            { name: "firstname", type: "string" },
            { name: "lastname", type: "string" },
        ],
    },
};
