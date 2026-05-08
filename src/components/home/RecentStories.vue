<template>
  <section class="recent-stories">
    <div class="section-header">
      <p class="eyebrow">Story</p>
      <h2>최근 이야기</h2>
      <p>
        아직 완성되지 않은 세계와 조금씩 이어지는 장면들을 기록합니다.
      </p>
    </div>

    <div class="story-grid">
      <article
        v-for="story in stories"
        :key="story.id"
        class="story-card"
      >
        <p class="story-status">{{ story.status }}</p>
        <h3>{{ story.title }}</h3>
        <p class="story-description">{{ story.description }}</p>

        <RouterLink :to="`/story/${story.id}`" class="read-link">
          읽기
        </RouterLink>
      </article>
    </div>
  </section>
</template>

<script setup>
const stories = [
  {
    id: 1,
    status: "연재 준비",
    title: "첫 번째 이야기",
    description: "아직 이름 붙이지 않은 세계의 시작점입니다.",
  },
  {
    id: 2,
    status: "구상 중",
    title: "길 위의 장면",
    description: "어느 순간 멈춰 선 사람들의 이야기입니다.",
  },
  {
    id: 3,
    status: "비공개 초안",
    title: "조용한 기록",
    description: "공개 전 분위기만 남겨둔 이야기입니다.",
  },
];
</script>

<style scoped>
.recent-stories {
  max-width: 1080px;
  margin: 0 auto;
  padding: 96px 24px;
}

.section-header {
  max-width: 620px;
  margin-bottom: 36px;
}

.eyebrow {
  margin-bottom: 12px;
  color: #7aa2ff;
  font-size: 13px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

h2 {
  margin: 0;
  color: #f2f4f8;
  font-size: clamp(30px, 5vw, 44px);
  letter-spacing: -0.03em;
}

.section-header p:last-child {
  margin-top: 16px;
  color: #aeb6c4;
  line-height: 1.8;
}

.story-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.story-card {
  min-height: 240px;
  padding: 28px;
  border: 1px solid #242a35;
  border-radius: 24px;
  background: #181c23;
  display: flex;
  flex-direction: column;
}

.story-status {
  margin: 0 0 18px;
  color: #7aa2ff;
  font-size: 13px;
}

h3 {
  margin: 0;
  color: #f2f4f8;
  font-size: 22px;
}

.story-description {
  margin-top: 16px;
  color: #aeb6c4;
  line-height: 1.7;
  flex: 1;
}

.read-link {
  margin-top: 24px;
  color: #e8e8e8;
  text-decoration: none;
  font-weight: 600;
}

.read-link:hover {
  color: #7aa2ff;
}

@media (max-width: 768px) {
  .recent-stories {
    padding: 72px 20px;
  }

  .story-grid {
    grid-template-columns: 1fr;
  }
}
</style>