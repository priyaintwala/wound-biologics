import { PDFDocument } from "pdf-lib";
import * as fs from "fs/promises";
import path from "path";

export class PdfService {
    constructor() {}

    fillPdfForm = async () => {
        try {
            const pdfData = await fs.readFile(
                path.resolve(
                    globalThis.__dirname,
                    "src/files/Legacy-Impax-IVR.pdf"
                )
            );
            const pdfDoc = await PDFDocument.load(pdfData);
            const form = pdfDoc.getForm();
            const fields = form.getFields();
            fields.forEach((field) => {
                const type = field.constructor.name;
                const name = field.getName();
                console.log(`${type}: ${name}`);
            });
            // Get the form fields by their names.
            const nameField = form.getTextField("SalesRepName");
            const patientNameField = form.getTextField("PatientName");
            const heightField = form.getTextField("DateOfBirth");
            const weightField = form.getTextField("Address");
            const eyesField = form.getTextField("City");
            const skinField = form.getTextField("FacilityCity");
            const hairField = form.getTextField("State");

            form.getCheckBox("NewPatient").check();
            form.getCheckBox("HospitalOutpatient").check();

            // form.getRadioGroup('Group3').select('Choice3');
            // const alliesField = form.getTextField("FacilityState");
            // const factionField = form.getTextField("Zip");
            // const backstoryField = form.getTextField("FacilityZip");
            // const traitsField = form.getTextField("CPTCodes");
            // const treasureField = form.getTextField("DateOfProcedure");
            form.getSignature("Signature");
            // Set the values for the form fields.
            nameField.setText("Template");
            heightField.setText("5' 1\"");
            weightField.setText("196 lbs");
            eyesField.setText("blue");
            skinField.setText("white");
            hairField.setText("brown");

            const signImageBytes = await fs.readFile(
                path.resolve(globalThis.__dirname, "src/files/sample-sign.png")
            );
            const marioImage = await pdfDoc.embedPng(signImageBytes);
            patientNameField.setImage(marioImage);
            form.flatten();
            const filledFormBytes = await pdfDoc.save();
            await fs.writeFile(
                path.resolve(globalThis.__dirname, "src/files/Impax-IVR.pdf"),
                filledFormBytes
            );
            return pdfDoc;
        } catch (err) {
            console.error("Error:", err);
        }
    };
}
