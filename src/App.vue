<template>
  <div class="app">
    <header class="site-header">
      <RouterLink class="logo" to="/">
        Road Driving
      </RouterLink>

      <nav class="site-nav">
        <RouterLink to="/">HOME</RouterLink>
        <RouterLink to="/story">STORY</RouterLink>
        <RouterLink to="/bus">BUS</RouterLink>
        <RouterLink to="/about">ABOUT</RouterLink>
      </nav>
    </header>

    <main>
      <RouterView />
    </main>
  </div>
</template>