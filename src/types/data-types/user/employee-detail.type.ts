export interface EmployeeDetail {
  id: string;
  userId: string;

  designation: string | null;
  joinDate: string;

  baseSalary: number;

  nidNumber: string | null;
  address: string | null;
  emergencyContact: string | null;

  createdAt: string;
  updatedAt: string;
}