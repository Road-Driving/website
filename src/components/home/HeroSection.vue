<template>
  <section class="hero">
    <p class="eyebrow">Road Driving</p>

    <h1>
      길 위에서 기록하고,<br />
      이야기 속에서 이어가는 공간.
    </h1>

    <p class="description">
      버스기사로 살아가는 과정과 그 안에서 쌓여가는 이야기들을 기록합니다.
      공개된 소설과 길 위의 기록을 함께 담아갑니다.
    </p>

    <div class="actions">
      <RouterLink to="/story" class="primary-button">
        소설 읽기
      </RouterLink>

      <RouterLink to="/bus" class="secondary-button">
        버스 이야기
      </RouterLink>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
.hero {
  min-height: 72vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 96px 24px;
  max-width: 1080px;
  margin: 0 auto;
}

.eyebrow {
  margin-bottom: 20px;
  color: #7aa2ff;
  font-size: 14px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  color: #f2f4f8;
  font-size: clamp(40px, 7vw, 72px);
  line-height: 1.15;
  letter-spacing: -0.04em;
}

.description {
  max-width: 640px;
  margin-top: 28px;
  color: #b8beca;
  font-size: 18px;
  line-height: 1.8;
}

.actions {
  display: flex;
  gap: 12px;
  margin-top: 36px;
  flex-wrap: wrap;
}

.primary-button,
.secondary-button {
  padding: 14px 22px;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 600;
}

.primary-button {
  background: #7aa2ff;
  color: #0f1115;
}

.secondary-button {
  border: 1px solid #343a46;
  color: #e8e8e8;
}
</style>