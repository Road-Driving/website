<!-- src/components/home/RecentStories.vue -->

<template>
  <section class="story-records">
    <div class="story-header">
      <h1 class="story-main-title">
        테라리아 로드 기록
      </h1>

      <p class="story-sub-title">
        테라리아 도시에 사는 한도윤의 좌충우돌 운행 이야기.
      </p>
    </div>

    <div class="story-list">
      <RouterLink
        v-if="latestStory"
        :to="`/story?episode=${latestStory.episode}`"
        class="story-link"
      >
        <span class="story-label">
          최신 회차
        </span>

        <span class="story-title">
          {{ latestStory.episode }}화
        </span>
      </RouterLink>

      <RouterLink
        v-if="epilogueStory"
        :to="`/story?episode=${epilogueStory.episode}`"
        class="story-link"
      >
        <span class="story-label">
          에필로그
        </span>

        <span class="story-title">
          {{ epilogueStory.title }}
        </span>
      </RouterLink>
    </div>

    <RouterLink
      to="/story"
      class="all-story-link"
    >
      전체 회차 보기 →
    </RouterLink>

    <p class="story-note">
      실제 이야기와 여러 소재들을 바탕으로 재구성된 이야기입니다.
      편하게 읽어주세요.
    </p>

    <div class="story-divider"></div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { stories } from "../../data/stories.js";

const latestStory = computed(() => {
  return stories
    .filter((story) => story.episode > 0)
    .at(-1);
});

const epilogueStory = computed(() => {
  return stories.find((story) => story.episode === 0);
});
</script>

<style scoped>
.story-records {
  max-width: 1080px;
  margin: 0 auto;
  padding: 18px 24px 16px;
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

.story-list {
  border-top: 1px solid #242a35;
}

.story-link {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 20px;
  padding: 16px 0;
  border-bottom: 1px solid #242a35;
  text-decoration: none;
  transition: padding-left 0.2s ease;
}

.story-link:hover {
  padding-left: 6px;
}

.story-label {
  color: #7aa2ff;
  font-size: 13px;
  letter-spacing: 0.08em;
}

.story-title {
  color: #f2f4f8;
  font-size: 22px;
  line-height: 1.25;
  letter-spacing: -0.03em;
}

.all-story-link {
  display: inline-flex;
  margin-top: 14px;
  color: #aeb6c4;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;
}

.all-story-link:hover {
  color: #7aa2ff;
}

.story-note {
  margin: 14px 4px 0;
  color: #6f7785;
  font-size: 13px;
  line-height: 1.7;
}

.story-divider {
  width: 100%;
  height: 1px;
  margin-top: 14px;
  background: linear-gradient(
    to right,
    transparent,
    rgba(255, 255, 255, 0.08),
    transparent
  );
}

@media (max-width: 768px) {
  .story-records {
    padding: 16px 20px 14px;
  }

  .story-main-title {
    font-size: 28px;
  }

  .story-sub-title {
    font-size: 14px;
  }

  .story-link {
    grid-template-columns: 1fr;
    gap: 6px;
    padding: 14px 0;
  }

  .story-title {
    font-size: 20px;
  }
}
</style>