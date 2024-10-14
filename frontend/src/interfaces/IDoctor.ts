// interfaces/IDoctor.ts
import IProcedure from "./IProcedure"; // Импортируйте интерфейс процедуры

export default interface IDoctor {
    id: number;
    name: string;
    experience_years: number;
    specialization: {
        id: number;
        name: string; // Поле name для специализации
    } | null; // Специализация может быть null, если не указана
    procedures: IProcedure[];
}
