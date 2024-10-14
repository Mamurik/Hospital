// interfaces/IPatient.ts
import IProcedure from "./IProcedure";
import IDoctor from "./IDoctor";
export default interface IPatient {
    id: number;
    name: string;
    age: number;
    doctor: IDoctor; // Изменяем тип doctor на объект IDoctor
    procedures: IProcedure[];
  }
