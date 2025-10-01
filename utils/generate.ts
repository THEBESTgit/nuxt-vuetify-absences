import { v4 as uuid } from 'uuid'
import type { Employee, Absence } from '@/stores/absences'
import { generateYearDates } from '~/composables/useAbsenceStore'


const FIRST = ['Ana','Luis','María','Carlos','Sofía','Pablo','Lucía','Mateo']
const LAST = ['González','Rodríguez','Pérez','Sánchez','Ramírez']


export function generateRandomData(count = 50, year = new Date().getFullYear()) {
const employees: Employee[] = []
const absences: Absence[] = []
const dates = generateYearDates(year)


for (let i = 0; i < count; i++) {
const id = uuid()
employees.push({ id, firstName: FIRST[i % FIRST.length]! + (i>0?i:''), lastName: LAST[i % LAST.length]!, personnelNumber: (1000 + i).toString() })


// crear algunas ausencias aleatorias
if (Math.random() < 0.5) {
  const startIdx = Math.floor(Math.random() * (dates.length - 7))
  const span = Math.floor(Math.random() * 6) + 1
  const start = dates[startIdx]
  const end = dates[Math.min(startIdx + span, dates.length - 1)]

  // Solo agregar si ambos existen
  if (start && end) {
    absences.push({ id: uuid(), employeeId: id, startDate: start, endDate: end, reason: 'Sick' })
  }
}
}


return { employees, absences }
}
