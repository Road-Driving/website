<template>
  <section class="about-section">
    <div class="about-content">
      <p class="eyebrow">About</p>

      <h2>
        기록과 이야기 사이를
        천천히 이어가는 공간.
      </h2>

      <p class="description">
        이곳은 개인 기록과 창작을 함께 정리하는 공간입니다.
        공개 가능한 일부 소설과 버스기사로 이어지는 기록들을
        천천히 쌓아가고 있습니다.
      </p>

      <p class="description">
        모든 내용이 공개되지는 않으며,
        일부 영역은 개인 작업 공간으로 관리됩니다.
      </p>

      <RouterLink to="/about" class="about-link">
        더 보기
      </RouterLink>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
.about-section {
  max-width: 1080px;
  margin: 0 auto;
  padding: 120px 24px;
}

.about-content {
  max-width: 760px;
}

.eyebrow {
  margin-bottom: 14px;
  color: #7aa2ff;
  font-size: 13px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

h2 {
  margin: 0;
  color: #f2f4f8;
  font-size: clamp(32px, 5vw, 52px);
  line-height: 1.2;
  letter-spacing: -0.04em;
}

.description {
  margin-top: 24px;
  color: #aeb6c4;
  font-size: 17px;
  line-height: 1.9;
}

.about-link {
  display: inline-flex;
  margin-top: 36px;
  color: #e8e8e8;
  text-decoration: none;
  font-weight: 600;
}

.about-link:hover {
  color: #7aa2ff;
}

@media (max-width: 768px) {
  .about-section {
    padding: 88px 20px;
  }
}
</style>