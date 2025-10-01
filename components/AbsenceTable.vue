<template>
  <div class="absence-manager">
    <!-- Header -->
    <div class="header">
      <div class="header-content">
        <div class="header-main">
          <v-icon icon="mdi-calendar" class="header-icon"></v-icon>
          <h1 class="header-title">Employee Absence Calendar</h1>
        </div>
        <div class="header-actions">
          <v-btn 
            color="primary" 
            @click="scrollToToday"
            prepend-icon="mdi-calendar-today"
            class="action-btn"
            variant="flat"
            size="small"
          >
            Today
          </v-btn>
          <v-btn 
            color="white" 
            @click="refreshData"
            prepend-icon="mdi-refresh"
            variant="outlined"
            class="action-btn"
            size="small"
          >
            Refresh
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Calendar Table -->
    <div class="calendar-container">
      <div class="calendar-wrapper">
        <!-- Fixed Header Row -->
        <div class="table-header" ref="headerRef">
          <div class="header-cell employee-header">
            Employee Information
          </div>
          <div 
            v-for="date in visibleDates" 
            :key="date"
            class="header-cell date-header"
            :class="{ 'today': isToday(date) }"
          >
            <div class="date-display">
              <div class="day">{{ getDayName(date) }}</div>
              <div class="number">{{ getDateNumber(date) }}</div>
              <div class="month">{{ getMonthName(date) }}</div>
            </div>
          </div>
        </div>

        <!-- Scrollable Body -->
        <div class="table-body" ref="bodyRef" @scroll="handleBodyScroll">
          <div 
            v-for="employee in employees" 
            :key="employee.id"
            class="table-row"
          >
            <!-- Employee Info  -->
            <div class="employee-header body-cell employee-cell" >
              <div class="employee-info">
                <div class="name">{{ employee.firstName }} {{ employee.lastName }}</div>
                <div class="personnel">#{{ employee.personnelNumber }}</div>
              </div>
            </div>

            <!-- Date Cells  -->
            <div 
              v-for="date in visibleDates" 
              :key="`${employee.id}-${date}`"
              class="body-cell date-cell"
              :class="getCellClass(employee.id, date)"
              @click="handleCellClick(employee, date)"
            >
              <div class="cell-content">
                <v-icon 
                  v-if="getAbsenceForDate(employee.id, date)" 
                  size="small"
                  color="white"
                >
                  mdi-calendar-remove
                </v-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <AbsenceDialog />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAbsenceStore } from '~/composables/useAbsenceStore'

const absenceStore = useAbsenceStore()
const bodyRef = ref<HTMLDivElement>()
const headerRef = ref<HTMLDivElement>()


const horizontalScroll = ref(0)


const visibleDateCount = 365 

// Computed
const employees = computed(() => absenceStore.state.employees)
const allDates = computed(() => absenceStore.getYearDates()) 

// ✅ VIRTUAL SCROLLING para el año completo
const startDateIndex = computed(() => {
  const scrollDays = Math.floor(horizontalScroll.value / 60)
  return Math.max(0, Math.min(allDates.value.length - visibleDateCount, scrollDays))
})

const visibleDates = computed(() => {
  return allDates.value.slice(
    startDateIndex.value, 
    startDateIndex.value + visibleDateCount
  )
})


const handleBodyScroll = (event: Event) => {
  const target = event.target as HTMLDivElement
  horizontalScroll.value = target.scrollLeft
  

  if (headerRef.value) {
    headerRef.value.scrollLeft = target.scrollLeft
  }
}

// Métodos
const handleCellClick = (employee: any, date: string) => {
  if (absenceStore.isWeekend(date)) return
  absenceStore.openDialog(employee, date)
}

const getCellClass = (employeeId: string, date: string) => {
  const classes = []
  
  if (absenceStore.isWeekend(date)) {
    classes.push('weekend')
  } else if (absenceStore.getAbsenceForDate(employeeId, date)) {
    classes.push('absent')
  } else {
    classes.push('present')
  }
  
  if (absenceStore.isToday(date)) {
    classes.push('today')
  }
  
  return classes
}

const scrollToToday = () => {
  const today = new Date()
  const startOfYear = new Date(today.getFullYear(), 0, 1)
  const daysDiff = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24))
  
  if (bodyRef.value) {
    bodyRef.value.scrollLeft = Math.max(0, (daysDiff - 15)) * 60 
  }
}

// Refresh data
const refreshData = () => {
  const currentAbsences = [...absenceStore.state.absences]
  absenceStore.generateSampleData()
  
  setTimeout(() => {
    currentAbsences.forEach(absence => {
      absenceStore.saveAbsence(absence)
    })
  }, 100)
}

// helpers 
const getDayName = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', { weekday: 'narrow' })
}

const getDateNumber = (dateString: string) => {
  return new Date(dateString).getDate()
}

const getMonthName = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short' })
}

// store methods
const { getAbsenceForDate, isToday } = absenceStore

onMounted(() => {
  absenceStore.generateSampleData()
  setTimeout(() => {
    scrollToToday()
  }, 100)
})
</script>

<style scoped>
.absence-manager {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1400px;
  margin: 0 auto;
  gap: 1rem;
}

.header-main {
  display: flex;
  align-items: center;
  flex: 1;
}

.header-icon {
  font-size: 2rem;
  margin-right: 1rem;
}

.header-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.action-btn {
  white-space: nowrap;
}

.calendar-container {
  flex: 1;
  padding: 1rem;
  overflow: hidden;
  min-height: 0;
}

.calendar-wrapper {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.table-header {
  display: flex;
  background: #f8f9fa;
  border-bottom: 2px solid #e9ecef;
  position: sticky;
  top: 0;
  z-index: 100;
  overflow-x: hidden;
  flex-shrink: 0;
}

.header-cell {
  flex-shrink: 0;
  padding: 0.75rem 0.5rem;
  border-right: 1px solid #e9ecef;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
}

.employee-header {
  width: 200px;
  min-width: 200px;
  justify-content: flex-start;
  padding-left: 1rem;
  background: #f8f9fa;
  position: sticky;
  left: 0;
  z-index: 110;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
}

.date-header {
  width: 60px;
  min-width: 60px;
  height: 70px;
  flex-direction: column;
  font-size: 0.75rem;
}

.date-header.today {
  background: #e3f2fd;
  color: #1976d2;
  font-weight: 700;
}

.date-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.day {
  font-size: 0.7rem;
  color: #6c757d;
  font-weight: 500;
}

.number {
  font-size: 0.9rem;
  font-weight: 600;
}

.month {
  font-size: 0.7rem;
  color: #6c757d;
  font-weight: 500;
}

.table-body {
  flex: 1;
  overflow: auto;
  position: relative;
}

.table-row {
  display: flex;
  border-bottom: 1px solid #e9ecef;
  transition: background-color 0.2s ease;
  position: relative;
}

.table-row:hover {
  background-color: #f8f9fa;
}

.body-cell {
  flex-shrink: 0;
  border-right: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}


.employee-cell {
  width: 200px;
  min-width: 200px;
  justify-content: flex-start;
  padding: 0.5rem 1rem;
  background: white;
  position: sticky;
  left: 0;
  
  border-right: 2px solid #e9ecef;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
}

.employee-info {
  min-width: 0;
  position: sticky;
}

.name {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.875rem;
  color: #212529;
}

.personnel {
  font-size: 0.75rem;
  color: #6c757d;
}

.date-cell {
  width: 60px;
  min-width: 60px;
  height: 60px;
  cursor: pointer;
  position: relative;
}

.date-cell:hover {
  transform: scale(1.05);
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.cell-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* cells */
.present {
  background: #c8e6c9;
}

.present:hover {
  background: #a5d6a7;
}

.absent {
  background: #ffcdd2;
}

.absent:hover {
  background: #ef9a9a;
}

.weekend {
  background: #f5f5f5;
  cursor: not-allowed;
}

.weekend:hover {
  transform: none;
  box-shadow: none;
}

.today {
  border: 2px solid #1976d2 !important;
}

/* Scrollbar styling */
.table-body::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

.table-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 6px;
}

.table-body::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 6px;
}

.table-body::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/*  móvil */
@media (max-width: 768px) {
  .header {
    padding: 1rem;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .header-main {
    justify-content: center;
    text-align: center;
  }
  
  .header-title {
    font-size: 1.25rem;
  }
  
  .header-actions {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .action-btn {
    min-width: 120px;
  }
  
  .calendar-container {
    padding: 0.5rem;
  }
  
  .employee-header,
  .employee-cell {
    width: 150px;
    min-width: 150px;
    padding-left: 0.75rem;
  }
  
  .date-header,
  .date-cell {
    width: 50px;
    min-width: 50px;
  }
  
  .date-header {
    height: 60px;
  }
  
  .date-cell {
    height: 50px;
  }
  
  .name {
    font-size: 0.8rem;
  }
  
  .personnel {
    font-size: 0.7rem;
  }
}

@media (max-width: 480px) {
  .header {
    padding: 0.75rem;
  }
  
  .header-title {
    font-size: 1.1rem;
  }
  
  .header-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
  
  .action-btn {
    width: 100%;
    justify-content: center;
  }
  
  .employee-header,
  .employee-cell {
    width: 130px;
    min-width: 130px;
    padding: 0.5rem;
  }
  
  .date-header,
  .date-cell {
    width: 45px;
    min-width: 45px;
  }
  
  .calendar-container {
    padding: 0.25rem;
  }
}
</style>