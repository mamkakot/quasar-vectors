<script setup>
import { Scatter } from 'vue-chartjs'
import { Chart as ChartJS, registerables } from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'
import { computed } from 'vue'

ChartJS.register(...registerables, annotationPlugin)

const props = defineProps(['annotations', 'showLabels', 'showGrid'])

const chartData = {
  datasets: [
    {
      data: [
        {
          x: 0,
          y: 0,
        },
      ],
      backgroundColor: 'rgb(255, 99, 132)',
    },
  ],
}
const chartOptions = computed(() => {
  return {
    maintainAspectRatio: true,
    aspectRatio: 1,
    responsive: true,
    scales: {
      x: {
        display: props.showGrid,
        title: {
          display: false,
          text: 'im',
        },
        ticks: {
          display: false,
        },
        min: -75,
        max: 75,
      },
      y: {
        display: props.showGrid,
        title: {
          display: false,
          text: 'real',
        },
        ticks: {
          display: false,
        },
        min: -75,
        max: 75,
      },
    },
    plugins: {
      annotation: {
        annotations: props.annotations,
      },

      legend: {
        display: false,
      },
    },
  }
})

function saveImage() {
  const link = document.createElement('a')
  link.download = 'chart.png'
  link.href = document.getElementById('my_chart_id').toDataURL('image/png')
  link.click()
}
</script>

<template>
  <div style="width: 600px" class="m-4 flex flex-col">
    <Scatter id="my_chart_id" :data="chartData" :options="chartOptions" />
    <button
      class="middle none center mt-4 rounded-lg bg-blue-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
      data-ripple-light="true"
      @click="saveImage()"
    >
      Сохранить
    </button>
  </div>
</template>
