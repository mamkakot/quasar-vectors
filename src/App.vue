<template>
  <header>
    <nav class="flex justify-between w-full bg-purple-500 text-white p-4">
      <a href="#"><span class="font-semibold text-xl tracking-tight">Электро-векторы!</span></a>
      <div class="md:items-center md:w-auto flex">
        <div class="md:flex">
          <RouterLink class="block md:text-white mr-4" to="/">Звезда</RouterLink>
          <RouterLink class="block md:text-white mr-4" to="/triangle">Треугольник</RouterLink>
        </div>
      </div>
    </nav>
  </header>
  <main>
    <main>
      <RouterView />
    </main>
  </main>
</template>
