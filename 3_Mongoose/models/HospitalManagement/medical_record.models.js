import mongoose from 'mongoose'

const medicalRecondSchema = new mongoose.Schema(
     {},
     {dateStamps : true}
)

export const MedicalRecord = new mongoose.model("MedicalRecord", medicalRecondSchema);