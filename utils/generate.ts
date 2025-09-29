export interface Absence {
  employeeId: number
  startDate: string
  endDate: string
}

export interface Employee {
  id: number
  firstName: string
  lastName: string
  personnelNumber: string
  absences: Absence[]
}

export function generateEmployees(count: number): Employee[] {
  const employees: Employee[] = []
  for (let i = 1; i <= count; i++) {
    employees.push({
      id: i,
      firstName: `Name${i}`,
      lastName: `Last${i}`,
      personnelNumber: `P${1000 + i}`,
      absences: []
    })
  }
  return employees
}