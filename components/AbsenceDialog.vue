<template>
  <v-dialog 
    v-model="isDialogOpen" 
    max-width="600px"
    persistent
  >
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon 
          :icon="editingAbsence ? 'mdi-pencil' : 'mdi-plus'" 
          class="mr-2"
        ></v-icon>
        {{ editingAbsence ? 'Edit Absence' : 'Create Absence' }}
        
        <v-spacer></v-spacer>
        <v-btn 
          icon="mdi-close" 
          variant="text" 
          @click="closeDialog"
        ></v-btn>
      </v-card-title>

      <v-card-text>
        <v-form v-model="isFormValid" @submit.prevent="save">
          <!-- Employee Information -->
          <v-card variant="outlined" class="mb-4">
            <v-card-text>
              <div class="text-subtitle-2 text-medium-emphasis mb-2">
                Employee Information
              </div>
              <div class="employee-info">
                <strong>{{ selectedEmployee?.firstName }} {{ selectedEmployee?.lastName }}</strong>
                <br>
                <span class="text-caption">Personnel #: {{ selectedEmployee?.personnelNumber }}</span>
              </div>
            </v-card-text>
          </v-card>

          <!-- Date -->
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="formData.startDate"
                label="Start Date"
                type="date"
                :rules="[requiredRule, dateRule]"
                required
              ></v-text-field>
            </v-col>
            
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="formData.endDate"
                label="End Date"
                type="date"
                :rules="[requiredRule, dateRule, endDateRule]"
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Absence Type -->
          <v-select
            v-model="formData.type"
            :items="absenceTypes"
            label="Absence Type"
            :rules="[requiredRule]"
            required
          ></v-select>

          <!-- Reason -->
          <v-textarea
            v-model="formData.reason"
            label="Reason"
            rows="3"
            :rules="[requiredRule]"
            required
          ></v-textarea>

          <!-- Summary-->
          <v-card 
            v-if="dateRange.length > 0" 
            variant="outlined" 
            class="mt-4"
          >
            <v-card-text>
              <div class="text-subtitle-2 text-medium-emphasis mb-2">
                Absence Summary
              </div>
              <div class="text-caption">
                Duration: {{ dateRange.length }} day(s)
                <br>
                Dates: {{ formatDateRange() }}
              </div>
            </v-card-text>
          </v-card>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        
        <v-btn 
          v-if="editingAbsence"
          color="error"
          variant="text"
          @click="deleteAbsence"
          prepend-icon="mdi-delete"
        >
          Delete
        </v-btn>
        
        <v-btn 
          variant="text" 
          @click="closeDialog"
        >
          Cancel
        </v-btn>
        
        <v-btn 
          color="primary" 
          @click="save"
          :disabled="!isFormValid"
          prepend-icon="mdi-content-save"
        >
          {{ editingAbsence ? 'Update' : 'Create' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">

import { computed, reactive, ref, watch } from 'vue'
import { useAbsenceStore } from '~/composables/useAbsenceStore'
import type { Absence, Employee } from '~/types/absence'

interface AbsenceFormData {
  startDate: string
  endDate: string
  type: 'vacation' | 'sick' | 'personal' | 'other'
  reason: string
}

const absenceStore = useAbsenceStore()
const isFormValid = ref(false)

// Computed store
const isDialogOpen = computed(() => absenceStore.state.isDialogOpen)
const selectedEmployee = computed(() => absenceStore.state.selectedEmployee)
const editingAbsence = computed(() => absenceStore.state.editingAbsence)
const selectedDate = computed(() => absenceStore.state.selectedDate)

// form data
const formData = reactive<AbsenceFormData>({
  startDate: '',
  endDate: '',
  type: 'vacation',
  reason: ''
})

// watchers
watch([selectedEmployee, selectedDate, editingAbsence], () => {
  if (selectedEmployee.value && selectedDate.value) {
    const baseDate = selectedDate.value
    
    if (editingAbsence.value) {
      // edit mode
      formData.startDate = editingAbsence.value.startDate
      formData.endDate = editingAbsence.value.endDate
      formData.type = editingAbsence.value.type
      formData.reason = editingAbsence.value.reason
    } else {
      // create mode
      formData.startDate = baseDate
      formData.endDate = baseDate
      formData.type = 'vacation'
      formData.reason = ''
    }
  }
})

// absence types
const absenceTypes = [
  { title: 'Vacation', value: 'vacation' },
  { title: 'Sick Leave', value: 'sick' },
  { title: 'Personal', value: 'personal' },
  { title: 'Other', value: 'other' }
]

// validation rules
const requiredRule = (v: any) => !!v || 'This field is required'

const dateRule = (v: string) => {
  if (!v) return true
  const date = new Date(v)
  return !isNaN(date.getTime()) || 'Invalid date'
}

const endDateRule = (v: string) => {
  if (!formData.startDate || !v) return true
  return v >= formData.startDate || 'End date must be after start date'
}

// date range computed
const dateRange = computed(() => {
  if (!formData.startDate || !formData.endDate) return []
  
  const start = new Date(formData.startDate)
  const end = new Date(formData.endDate)
  const dates: string[] = []
  
  const current = new Date(start)
  while (current <= end) {
    const dateString = current.toISOString().split('T')[0]
    if (dateString) {
      dates.push(dateString)
    }
    current.setDate(current.getDate() + 1)
  }
  
  return dates
})

// methods
const closeDialog = () => {
  absenceStore.closeDialog()
}

const save = () => {
  if (!isFormValid.value || !selectedEmployee.value) return
  
  const absenceData = {
    id: editingAbsence.value?.id,
    employeeId: selectedEmployee.value.id,
    startDate: formData.startDate,
    endDate: formData.endDate,
    type: formData.type,
    reason: formData.reason
  }
  
  absenceStore.saveAbsence(absenceData)
}

const deleteAbsence = () => {
  if (editingAbsence.value) {
    absenceStore.deleteAbsence(editingAbsence.value.id)
  }
}

// format date range for display
const formatDateRange = (): string => {
  if (dateRange.value.length === 0) return ''
  
  const firstDate = dateRange.value[0]
  const lastDate = dateRange.value[dateRange.value.length - 1]
  
  if (!firstDate || !lastDate) return ''
  
  if (dateRange.value.length === 1) {
    return new Date(firstDate).toLocaleDateString()
  }
  
  const firstDateFormatted = new Date(firstDate).toLocaleDateString()
  const lastDateFormatted = new Date(lastDate).toLocaleDateString()
  
  return `${firstDateFormatted} - ${lastDateFormatted}`
}
</script>

<style scoped>
.employee-info {
  line-height: 1.4;
}
</style>
