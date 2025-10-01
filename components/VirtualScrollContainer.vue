<template>
  <div class="virtual-scroll-container" ref="containerRef" @scroll="handleScroll">
    <div class="horizontal-wrapper" :style="{ width: `${totalCols * colWidth}px` }">
      <!-- Espaciador superior -->
      <div 
        class="vertical-spacer" 
        :style="{ height: `${verticalSpacerTop}px` }"
      ></div>
      
      <div class="content-area" :style="contentTransform">
        <slot
          :visible-rows="visibleRows"
          :visible-cols="visibleCols"
        ></slot>
      </div>
      
      <!-- Espaciador inferior -->
      <div 
        class="vertical-spacer" 
        :style="{ height: `${verticalSpacerBottom}px` }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  totalRows: number
  totalCols: number
  rowHeight: number
  colWidth: number
  overScan?: number
  containerHeight?: number
  containerWidth?: number
}

const props = withDefaults(defineProps<Props>(), {
  overScan: 3,
  containerHeight: 600,
  containerWidth: 1200
})

const containerRef = ref<HTMLDivElement>()
const scrollTop = ref(0)
const scrollLeft = ref(0)

// Calcular elementos visibles
const visibleRowCount = computed(() => 
  Math.ceil(props.containerHeight / props.rowHeight) + props.overScan * 2
)

const visibleColCount = computed(() => 
  Math.ceil(props.containerWidth / props.colWidth) + props.overScan * 2
)

// Calcular índices visibles
const startRow = computed(() => {
  const row = Math.floor(scrollTop.value / props.rowHeight) - props.overScan
  return Math.max(0, row)
})

const endRow = computed(() => {
  const row = startRow.value + visibleRowCount.value
  return Math.min(props.totalRows, row)
})

const startCol = computed(() => {
  const col = Math.floor(scrollLeft.value / props.colWidth) - props.overScan
  return Math.max(0, col)
})

const endCol = computed(() => {
  const col = startCol.value + visibleColCount.value
  return Math.min(props.totalCols, col)
})

// Filas y columnas visibles
const visibleRows = computed(() => 
  Array.from({ length: endRow.value - startRow.value }, (_, i) => startRow.value + i)
)

const visibleCols = computed(() => 
  Array.from({ length: endCol.value - startCol.value }, (_, i) => startCol.value + i)
)

// Espaciadores
const verticalSpacerTop = computed(() => startRow.value * props.rowHeight)
const verticalSpacerBottom = computed(() => 
  (props.totalRows - endRow.value) * props.rowHeight
)

const horizontalSpacerLeft = computed(() => startCol.value * props.colWidth)

// Transform para el contenido
const contentTransform = computed(() => ({
  transform: `translateX(${-horizontalSpacerLeft.value}px) translateY(${-verticalSpacerTop.value}px)`
}))

// Manejar scroll
const handleScroll = (event: Event) => {
  const target = event.target as HTMLDivElement
  scrollTop.value = target.scrollTop
  scrollLeft.value = target.scrollLeft
}

// Métodos para control externo
const scrollTo = (row: number, col: number) => {
  if (containerRef.value) {
    containerRef.value.scrollTop = row * props.rowHeight
    containerRef.value.scrollLeft = col * props.colWidth
  }
}

const scrollToToday = () => {
  const today = new Date()
  const startOfYear = new Date(today.getFullYear(), 0, 1)
  const daysDiff = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24))
  
  if (containerRef.value) {
    containerRef.value.scrollLeft = Math.max(0, daysDiff - 10) * props.colWidth
  }
}

defineExpose({
  scrollTo,
  scrollToToday
})
</script>

<style scoped>
.virtual-scroll-container {
  height: 100%;
  width: 100%;
  overflow: auto;
  position: relative;
}

.horizontal-wrapper {
  position: relative;
  height: 100%;
}

.vertical-spacer {
  width: 100%;
}

.content-area {
  position: relative;
  will-change: transform;
}

/* Scrollbar styling mejorado */
.virtual-scroll-container::-webkit-scrollbar {
  width: 16px;
  height: 16px;
}

.virtual-scroll-container::-webkit-scrollbar-track {
  background: #f8f9fa;
  border-radius: 8px;
}

.virtual-scroll-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 8px;
  border: 3px solid #f8f9fa;
}

.virtual-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.virtual-scroll-container::-webkit-scrollbar-corner {
  background: #f8f9fa;
}
</style>