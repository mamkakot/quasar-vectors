<script setup>
// import VectorInput from './VectorInput.vue'
import { computed, ref } from 'vue'
import ArrowChart from '@/components/ArrowChart.vue'

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
        `I${index}`,
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
      `${i - 1}`,
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
    `In`,
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
        `U${index}`,
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
        `U${index}${index + 1}`,
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
  <div class="main-page">
    <ArrowChart :annotations="annotations" :show-grid="showGrid" />
    <nav
      class="z-20 flex shrink-0 grow-0 justify-around gap-4 border-t border-gray-200 bg-white/50 p-2.5 shadow-lg backdrop-blur-lg dark:border-slate-600/60 dark:bg-slate-800/50 fixed top-2/4 -translate-y-2/4 left-6 min-h-[auto] min-w-[64px] flex-col rounded-lg border"
    >
      <a
        href="#profile"
        class="flex aspect-square min-h-[32px] w-16 flex-col items-center justify-center gap-1 rounded-md p-1.5 bg-indigo-50 text-indigo-600 dark:bg-sky-900 dark:text-sky-50"
      >
        <!-- HeroIcon - User -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6 shrink-0"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
          />
        </svg>

        <small class="text-center text-xs font-medium"> Profile </small>
      </a>

      <a
        href="#analytics"
        class="flex aspect-square min-h-[32px] w-16 flex-col items-center justify-center gap-1 rounded-md p-1.5 text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800"
      >
        <!-- HeroIcon - Chart Bar -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6 shrink-0"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
          />
        </svg>

        <small class="text-center text-xs font-medium"> Analytics </small>
      </a>

      <a
        href="#settings"
        class="flex aspect-square min-h-[32px] w-16 flex-col items-center justify-center gap-1 rounded-md p-1.5 text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800"
      >
        <!-- HeroIcon - Cog-6-tooth -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6 shrink-0"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>

        <small class="text-center text-xs font-medium"> Settings </small>
      </a>

      <hr class="dark:border-gray-700/60" />

      <a
        href="/"
        class="flex h-16 w-16 flex-col items-center justify-center gap-1 text-fuchsia-900 dark:text-gray-400"
      >
        <!-- HeroIcon - Home Modern -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819"
          />
        </svg>

        <small className="text-xs font-medium">Home</small>
      </a>
    </nav>
    <!-- <div>
      <ul
        class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400"
      >
        <li class="me-2">
          <a
            href="#"
            aria-current="page"
            class="inline-block p-4 text-blue-600 bg-gray-100 rounded-t-lg active dark:bg-gray-800 dark:text-blue-500"
            >Звезда</a
          >
        </li>
        <li class="me-2">
          <a
            href="#"
            class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            >Треугольник</a
          >
        </li>
      </ul>

      <p class="rounded-lg bg-orange-600 bg-opacity-50 p-2 m-4 text-center text-white text-xl">I</p>
      <VectorInput
        v-for="coord in forceCoordinates"
        v-model:real-part="coord[1]"
        v-model:imaginary-part="coord[0]"
        :key="coord"
      />
      <p class="rounded-lg bg-orange-600 bg-opacity-50 p-2 m-4 text-center text-white text-xl">U</p>
      <VectorInput
        v-for="coord in voltageCoordinates"
        v-model:real-part="coord[1]"
        v-model:imaginary-part="coord[0]"
        :key="coord"
      />
      <div class="m-2">
        <input type="checkbox" id="grid" name="grid" checked v-model="showGrid" />
        <label for="grid">Сетка</label>
      </div>
      <div class="m-2">
        <input type="checkbox" id="labels" name="labels" checked v-model="showLabels" />
        <label for="labels">Надписи на векторах</label>
      </div>
      <div class="m-2">
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
      <div class="m-2">
        <label for="voltage-scale">mU, В/мм</label>
        <input
          type="number"
          id="voltage-scale"
          name="voltage-scale"
          v-model="voltageScale"
          class="rounded-lg border-gray-300 border-2 px-2 ml-1"
        />
      </div>
    </div> -->
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
