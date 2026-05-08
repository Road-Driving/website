<template>
  <div class="app">
    <header class="site-header">
      <RouterLink class="logo" to="/">Road Driving</RouterLink>

      <nav>
        <RouterLink to="/">HOME</RouterLink>
        <RouterLink to="/log">LOG</RouterLink>
        <RouterLink to="/vehicles">VEHICLES</RouterLink>
        <RouterLink to="/schedule">SCHEDULE</RouterLink>
        <RouterLink to="/story">STORY</RouterLink>
        <RouterLink to="/about">ABOUT</RouterLink>
      </nav>
    </header>

    <main>
      <RouterView />
    </main>
  </div>
</template>