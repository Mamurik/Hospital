// interfaces/IProcedure.ts
export default interface IProcedure {
    id: number;         // Убедитесь, что это поле уникально
    name: string;
    patient: number;    // ID пациента
    doctor: number;     // ID врача
    date: string;       // Дата процедуры в формате YYYY-MM-DD
}
