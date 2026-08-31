// Equivalente a ApiResponse<T> en C#
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Equivalente a Student en C#
export interface Student {
  id: number;
  name: string;
  scores?: Score[];
}

// Equivalente a Teacher en C#
export interface Teacher {
  id: number;
  name: string;
  scores?: Score[];
}

// Equivalente a Score (Notas) en C#
export interface Score {
  id: number;
  name: string;      // Nombre de la evaluación o materia
  value: number;     // Valor numérico de la nota (decimal en C# se mapea a number en TS)
  teacherId: number;
  teacher?: Teacher;
  studentId: number;
  student?: Student;
}