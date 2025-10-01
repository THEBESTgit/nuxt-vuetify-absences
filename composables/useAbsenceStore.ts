// Importaciones corregidas
import { reactive, readonly } from 'vue'
import type { Absence, Employee } from '~/types/absence'

// Estado reactivo
const state = reactive({
  employees: [] as Employee[],
  absences: [] as Absence[],
  selectedDate: null as string | null,
  selectedEmployee: null as Employee | null,
  isDialogOpen: false,
  editingAbsence: null as Absence | null
})

export const useAbsenceStore = () => {
  // example data
  const generateSampleData = () => {
    const sampleEmployees: Employee[] = [
      { id: '1', firstName: 'John', lastName: 'Doe', personnelNumber: 'EMP001' },
      { id: '2', firstName: 'Jane', lastName: 'Smith', personnelNumber: 'EMP002' },
      { id: '3', firstName: 'Bob', lastName: 'Johnson', personnelNumber: 'EMP003' },
      { id: '4', firstName: 'Alice', lastName: 'Brown', personnelNumber: 'EMP004' },
      { id: '5', firstName: 'Charlie', lastName: 'Wilson', personnelNumber: 'EMP005' },
    ]

    const sampleAbsences: Absence[] = state.absences.length === 0 ? [
    {
      id: '1',
      employeeId: '1',
      startDate: '2024-01-15',
      endDate: '2024-01-20',
      reason: 'Vacation',
      type: 'vacation'
    },
    {
      id: '2',
      employeeId: '2',
      startDate: '2024-02-01',
      endDate: '2024-02-03',
      reason: 'Sick leave',
      type: 'sick'
    }
  ] : state.absences

  state.employees = sampleEmployees
  // ✅ NO sobreescribir las ausencias existentes
  if (state.absences.length === 0) {
    state.absences = sampleAbsences
  }

  }

  // get absence for specific date
  const getAbsenceForDate = (employeeId: string, date: string): Absence | undefined => {
    return state.absences.find(absence => 
      absence.employeeId === employeeId && 
      date >= absence.startDate && 
      date <= absence.endDate
    )
  }

  // verify if weekend
  const isWeekend = (date: string): boolean => {
    const day = new Date(date).getDay()
    return day === 0 || day === 6
  }

  //cell color based on absence
  const getCellColor = (employeeId: string, date: string): string => {
    if (isWeekend(date)) return 'grey-lighten-2'
    
    const absence = getAbsenceForDate(employeeId, date)
    return absence ? 'red-lighten-2' : 'green-lighten-2'
  }

  // open dialog
  const openDialog = (employee: Employee, date: string) => {
    state.selectedEmployee = employee
    state.selectedDate = date
    
    const existingAbsence = getAbsenceForDate(employee.id, date)
    state.editingAbsence = existingAbsence || null
    state.isDialogOpen = true
  }

  // close dialog
  const closeDialog = () => {
    state.isDialogOpen = false
    state.editingAbsence = null
    state.selectedEmployee = null
    state.selectedDate = null
  }

  // save absence (create or update)
  const saveAbsence = (absenceData: Omit<Absence, 'id'> & { id?: string }) => {
    if (absenceData.id) {
      const index = state.absences.findIndex(a => a.id === absenceData.id)
      if (index !== -1) {
        state.absences[index] = { ...absenceData, id: absenceData.id } as Absence
      }
    } else {
      const newAbsence: Absence = {
        ...absenceData,
        id: Date.now().toString()
      } as Absence
      state.absences.push(newAbsence)
    }
    
    closeDialog()
  }

  // delete absence
  const deleteAbsence = (absenceId: string) => {
    state.absences = state.absences.filter(a => a.id !== absenceId)
    closeDialog()
  }

  // get all dates in a year
  const getYearDates = (year: number = 2024): string[] => {
    const dates: string[] = []
    const startDate = new Date(year, 0, 1)
    const endDate = new Date(year, 11, 31)
    
    const currentDate = new Date(startDate)
    while (currentDate <= endDate) {
      const dateString = currentDate.toISOString().split('T')[0]
      if (dateString) {
        dates.push(dateString)
      }
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    return dates
  }

  // verify if date is today
  const isToday = (date: string): boolean => {
    const today = new Date().toISOString().split('T')[0]
    return date === today
  }

  return {
    state: readonly(state),
    generateSampleData,
    getAbsenceForDate,
    getCellColor,
    openDialog,
    closeDialog,
    saveAbsence,
    deleteAbsence,
    getYearDates,
    isToday,
    isWeekend
  }
}