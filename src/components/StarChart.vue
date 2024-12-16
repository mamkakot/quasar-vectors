<script setup>
import VectorInput from './VectorInput.vue'
import { computed, ref } from 'vue'
import ArrowChart from 'components/ArrowChart.vue'

const forceCoordinates = ref([
  [-2.2, 4.1],
  [-3.7, -2.2],
  [-2.7, -4.5],
])
const voltageCoordinates = ref([
  [0, 250],
  [200, -110],
  [-160, -110],
])

function getAnnotation(
  name,
  xMin,
  yMin,
  xMax,
  yMax,
  color,
  isDashed = false,
  showArrowHead = true,
) {
  return {
    key: name,
    value: {
      type: 'line',
      xMin: xMin,
      xMax: xMax,
      yMin: yMin,
      yMax: yMax,
      borderColor: color,
      borderWidth: 2,
      borderDash: isDashed ? [5, 15] : [],
      label: {
        content: name,
        display: showLabels.value,
      },
      arrowHeads: {
        end: {
          display: showArrowHead,
        },
      },
    },
  }
}

function getSum(array, index) {
  return array.reduce(
    (accumulator, currentValue, currentIndex) =>
      accumulator + (currentIndex < index ? currentValue : 0),
    0,
  )
}

const annotations = computed(() => {
  const forceAnnotations = forceCoordinates.value
    .map((item, index) =>
      getAnnotation(
        `I_${index}`,
        0,
        0,
        -item[0] / forceScale.value,
        item[1] / forceScale.value,
        'rgb(225, 42, 126)',
      ),
    )
    .reduce((acc, item) => Object.assign(acc, { [item.key]: item.value }), {})

  const forceSumAnnotationsArray = []
  for (let i = 1; i < forceCoordinates.value.length; i++) {
    const annotation = getAnnotation(
      `_${i - 1}`,
      -getSum(
        forceCoordinates.value.map((hi) => hi[0]),
        i,
      ) / forceScale.value,
      getSum(
        forceCoordinates.value.map((hi) => hi[1]),
        i,
      ) / forceScale.value,
      -getSum(
        forceCoordinates.value.map((hi) => hi[0]),
        i + 1,
      ) / forceScale.value,
      getSum(
        forceCoordinates.value.map((hi) => hi[1]),
        i + 1,
      ) / forceScale.value,
      'rgb(20, 20, 20)',
      true,
      false,
    )
    forceSumAnnotationsArray.push(annotation)
  }

  const forceSumAnnotation = getAnnotation(
    `I_N`,
    0,
    0,
    -getSum(
      forceCoordinates.value.map((item) => item[0]),
      forceCoordinates.value.length,
    ) / forceScale.value,
    getSum(
      forceCoordinates.value.map((item) => item[1]),
      forceCoordinates.value.length,
    ) / forceScale.value,
    'rgb(10, 10, 10)',
  )

  forceSumAnnotationsArray.push(forceSumAnnotation)

  const forceSumAnnotations = forceSumAnnotationsArray.reduce(
    (acc, item) => Object.assign(acc, { [item.key]: item.value }),
    {},
  )

  const voltageAnnotations = voltageCoordinates.value
    .map((item, index) =>
      getAnnotation(
        `U_${index}`,
        0,
        0,
        item[0] / voltageScale.value,
        item[1] / voltageScale.value,
        'rgb(63, 220, 220)',
      ),
    )
    .reduce((acc, item) => Object.assign(acc, { [item.key]: item.value }), {})
  const voltageSumAnnotations = voltageCoordinates.value
    .map((item, index) =>
      getAnnotation(
        voltageCoordinates.value.length - index - 1 === 0
          ? `U_${index}0`
          : `U_${index}${index + 1}`,
        (index < voltageCoordinates.value.length - 1
          ? voltageCoordinates.value[index + 1][0]
          : voltageCoordinates.value[0][0]) / voltageScale.value,
        (index < voltageCoordinates.value.length - 1
          ? voltageCoordinates.value[index + 1][1]
          : voltageCoordinates.value[0][1]) / voltageScale.value,
        item[0] / voltageScale.value,
        item[1] / voltageScale.value,
        'rgb(186, 220, 63)',
      ),
    )
    .reduce((acc, item) => Object.assign(acc, { [item.key]: item.value }), {})

  return {
    ...forceAnnotations,
    ...voltageAnnotations,
    ...voltageSumAnnotations,
    ...forceSumAnnotations,
  }
})

const showGrid = ref(true)
const showLabels = ref(true)
const forceScale = ref(0.12)
const voltageScale = ref(5)
</script>

<template>
  <div class="flex flex-col md:flex-row justify-center align-center">
    <ArrowChart :annotations="annotations" :show-grid="showGrid" />

    <div>
      <p class="rounded-lg bg-orange-600 bg-opacity-50 p-2 m-4 text-center text-white text-xl">
        Сила
      </p>
      <VectorInput
        v-for="coord in forceCoordinates"
        v-model:real-part="coord[1]"
        v-model:imaginary-part="coord[0]"
        :key="coord"
      />
      <p class="rounded-lg bg-orange-600 bg-opacity-50 p-2 m-4 text-center text-white text-xl">
        Напряжение
      </p>
      <VectorInput
        v-for="coord in voltageCoordinates"
        v-model:real-part="coord[1]"
        v-model:imaginary-part="coord[0]"
        :key="coord"
      />
      <div class="m-4">
        <input class="mr-2" type="checkbox" id="grid" name="grid" checked v-model="showGrid" />
        <label for="grid">Сетка</label>
      </div>
      <div class="m-4">
        <input
          class="mr-2"
          type="checkbox"
          id="labels"
          name="labels"
          checked
          v-model="showLabels"
        />
        <label for="labels">Надписи на векторах</label>
      </div>
      <div class="m-4">
        <label for="force-scale">mI, А/мм</label>
        <input
          type="number"
          step="0.1"
          id="force-scale"
          name="force-scale"
          v-model="forceScale"
          class="rounded-lg border-gray-300 border-2 px-2 ml-1"
        />
      </div>
      <div class="m-4">
        <label for="voltage-scale">mU, В/мм</label>
        <input
          type="number"
          id="voltage-scale"
          name="voltage-scale"
          v-model="voltageScale"
          class="rounded-lg border-gray-300 border-2 px-2 ml-1"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-page {
  display: flex;
  justify-content: space-between;
  margin: 20px;
}
</style>
/
