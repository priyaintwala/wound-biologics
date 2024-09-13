import busboy from "busboy";
import fs from "fs";
import os from "os";
const SCOPES = ["https://www.googleapis.com/auth/drive"];
import path from "path";
import { google } from "googleapis";
const SERVICE_ACCOUNT_FILE_NAME =
    process.env.SERVICE_ACCOUNT_FILE_NAME ??
    "woundbio-firebase-adminsdk-wk8ik-2f8a43c54c.json";
const auth = new google.auth.GoogleAuth({
    keyFile: `./${SERVICE_ACCOUNT_FILE_NAME}`,
    scopes: SCOPES,
});

const MAX_FILE_SIZE = Number(process.env.GOOGLE_DRIVE_MAX_FILE_SIZE); // 10 MB
const MAX_FILES = Number(process.env.GOOGLE_DRIVE_MAX_NUM_UPLOAD_FILES);

export default class GoogleDriveService {
    constructor() {}

    getFiles = async () => {
        const folderId = process.env.GOOGLE_DRIVE_READ_FOLDE_ID;
        const response = await google
            .drive({ version: "v3", auth: auth })
            .files.list({
                q: `'${folderId}' in parents and mimeType='application/pdf'`,
                fields: "files(id, name, webContentLink)",
            });
        // const files = response.data.files;
        const files = response.data.files.map((file) => ({
            id: file.id,
            name: file.name,
            downloadLink: file.webContentLink,
        }));

        return files;
    };

    upladFiles = async (headers: any, body: any, callback: any) => {
        const busboyi = busboy({ headers });
        const tmpdir = os.tmpdir();
        let fileCount = 0;
        let isValid = true;
        let errorMessage = "";

        // This object will accumulate all the uploaded files, keyed by their name.
        const uploadedFiles = [];
        const fileWrites = [];

        // This code will process each file uploaded.
        busboyi.on("file", async (fieldname, file, { filename, mimeType }) => {
            if (mimeType !== "application/pdf") {
                isValid = false;
                errorMessage = "Only PDF files are allowed";
                file.resume(); // Skip the file
                return;
            }

            fileCount += 1;
            if (fileCount > MAX_FILES) {
                isValid = false;
                errorMessage =
                    "Maximum 5 files are allowed ok                                                  ";
                file.resume(); // Skip the file
                return;
            }

            let fileSize = 0;

            file.on("data", (chunk) => {
                fileSize += chunk.length;
                if (fileSize > MAX_FILE_SIZE) {
                    isValid = false;
                    errorMessage = "File size should be less than 10 MB";
                    file.resume(); // Skip the file
                }
            });

            console.log(`Processed file ${filename}`);
            const filePath = path.join(tmpdir, filename);

            const writeStream = fs.createWriteStream(filePath);
            file.pipe(writeStream);
            uploadedFiles.push({ filename, mimeType, filePath });

            const promise = new Promise((resolve, reject) => {
                file.on("end", async () => {
                    writeStream.end();
                });
                writeStream.on("close", resolve);
                writeStream.on("error", reject);
            });
            fileWrites.push(promise);
        });

        busboyi.on("finish", async () => {
            await Promise.all(fileWrites);

            if (!isValid) {
                callback(400, errorMessage);
                // Clean up any saved files if validation failed
                uploadedFiles.forEach((file) => fs.unlinkSync(file.filePath));
                return;
            }
            for (const file of uploadedFiles) {
                const { filename, mimeType, filePath } = file;
                const { data } = await google
                    .drive({ version: "v3", auth: auth })
                    .files.create({
                        media: {
                            mimeType: mimeType,
                            body: fs.createReadStream(filePath),
                        },
                        requestBody: {
                            name: filename,
                            parents: [process.env.GOOGLE_DRIVE_WRITE_FOLDE_ID], //folder id in which file should be uploaded
                        },
                        fields: "id,name",
                    });

                console.log(
                    `File uploaded successfully -> ${JSON.stringify(data)}`
                );

                // Remove the file from the server after upload
                fs.unlinkSync(filePath);
            }
            callback(200, "Successfully uploaded");
        });

        busboyi.end(body);
    };
}
