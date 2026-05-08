<template>
  <main class="story-page">
    <section class="story-wrap">
      <div class="story-header">
        <h1 class="story-main-title">
          테라리아 로드 기록
        </h1>

        <p class="story-sub-title">
          테라리아 도시에 사는 한도윤의 좌충우돌 운행 이야기.
        </p>
      </div>

      <div class="episode-list">
        <RouterLink
          v-for="episode in episodes"
          :key="episode.id"
          :to="episode.link"
          class="episode-item"
        >
          <div class="episode-number">
            {{ episode.episode }}
          </div>

          <h2 class="episode-title">
            {{ episode.title }}
          </h2>
        </RouterLink>
      </div>

      <p class="story-note">
        실제 이야기와 여러 소재들을 바탕으로 재구성된 이야기입니다.
        편하게 읽어주세요.
      </p>
    </section>
  </main>
</template>

<script setup>
const episodes = [
  {
    id: 1,
    episode: "에필로그",
    title: "길 위의 기록",
    link: "/story",
  },
  {
    id: 2,
    episode: "1화",
    title: "첫 번째 이야기",
    link: "/story",
  },
]
</script>

<style scoped>
.story-page {
  background: #0f1115;
  color: #f2f4f8;
}

.story-wrap {
  max-width: 1080px;
  margin: 0 auto;
  padding: 18px 24px 28px;
}

.story-header {
  margin-bottom: 16px;
}

.story-main-title {
  margin: 0;

  color: #f2f4f8;

  font-size: clamp(26px, 4vw, 36px);
  line-height: 1.15;
  letter-spacing: -0.04em;
}

.story-sub-title {
  margin: 8px 0 0;

  color: #aeb6c4;

  font-size: 15px;
  line-height: 1.6;
}

.episode-list {
  border-top: 1px solid #242a35;
}

.episode-item {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 20px;

  padding: 16px 0;

  border-bottom: 1px solid #242a35;

  text-decoration: none;

  transition:
    padding-left 0.2s ease,
    color 0.2s ease;
}

.episode-item:hover {
  padding-left: 6px;
}

.episode-number {
  color: #7aa2ff;

  font-size: 13px;
  letter-spacing: 0.08em;
}

.episode-title {
  margin: 0;

  color: #f2f4f8;

  font-size: 22px;
  line-height: 1.25;
  letter-spacing: -0.03em;
}

.story-note {
  margin: 14px 4px 0;

  color: #6f7785;

  font-size: 13px;
  line-height: 1.7;
}

@media (max-width: 768px) {
  .story-wrap {
    padding: 16px 20px 24px;
  }

  .story-main-title {
    font-size: 28px;
  }

  .story-sub-title {
    font-size: 14px;
  }

  .episode-item {
    grid-template-columns: 1fr;
    gap: 6px;

    padding: 14px 0;
  }

  .episode-title {
    font-size: 20px;
  }
}
</style>