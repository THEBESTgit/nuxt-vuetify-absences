export interface Employee {
  id: string
  firstName: string
  lastName: string
  personnelNumber: string
}

export interface Absence {
  id: string
  employeeId: string
  startDate: string // YYYY-MM-DD
  endDate: string // YYYY-MM-DD
  reason: string
  type: 'vacation' | 'sick' | 'personal' | 'other'
}

export interface AbsenceState {
  employees: Employee[]
  absences: Absence[]
  selectedDate: string | null
  selectedEmployee: Employee | null
  isDialogOpen: boolean
  editingAbsence: Absence | null
}