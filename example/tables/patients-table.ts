export interface PatientTable {
    patientId: string;
    name: string;
    created: boolean | null;
    staged: boolean | null;
    deleted: boolean | null;
    archived: boolean;
}
