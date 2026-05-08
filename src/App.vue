<!-- src/App.vue -->

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
      </nav>
    </header>

    <RouterView />

    <GlobalFooter />
  </div>
</template>

<script setup>
import GlobalFooter from "./components/common/GlobalFooter.vue";
</script>

<style scoped>
.app {
  min-height: 100vh;
  background: #0f1115;
  color: #f2f4f8;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 50;

  height: 56px;
  padding: 0 24px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  background: rgba(15, 17, 21, 0.78);
  backdrop-filter: blur(18px);

  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.logo {
  color: #f2f4f8;
  text-decoration: none;

  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.03em;
}

.site-nav {
  display: flex;
  align-items: center;
  gap: 18px;
}

.site-nav a {
  color: #7f8794;
  text-decoration: none;

  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;

  transition: color 0.2s ease;
}

.site-nav a:hover {
  color: #f2f4f8;
}

.site-nav a.router-link-active {
  color: #7aa2ff;
}

.site-footer {
  max-width: 1080px;

  margin: 10px auto 0;

  padding: 0 24px 36px;

  text-align: center;
}

.footer-divider {
  width: 100%;
  height: 1px;

  margin-bottom: 22px;

  background: linear-gradient(
    to right,
    transparent,
    rgba(255, 255, 255, 0.08),
    transparent
  );
}

.footer-title {
  margin: 0;

  color: #7f8794;

  font-size: 12px;
  letter-spacing: 0.08em;
}

.footer-description {
  margin: 10px 0 0;

  color: #5f6672;

  font-size: 12px;
  line-height: 1.7;
}

@media (max-width: 768px) {
  .site-header {
    padding: 0 20px;
  }

  .site-nav {
    gap: 14px;
  }

  .logo {
    font-size: 14px;
  }

  .site-footer {
    margin-top: 6px;
    padding: 0 20px 32px;
  }

  .footer-divider {
    margin-bottom: 18px;
  }
}
</style>