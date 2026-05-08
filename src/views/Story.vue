<!-- src/views/Story.vue -->

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

      <nav class="episode-pagination top">
        <button
          v-if="hasPrev"
          type="button"
          class="pagination-link"
          @click="movePrev"
        >
          이전
        </button>

        <span
          v-else
          class="pagination-disabled"
        >
          이전
        </span>

        <button
          v-for="page in pages"
          :key="page.episode"
          type="button"
          class="pagination-link"
          :class="{ active: page.episode === currentEpisode.episode }"
          @click="moveToEpisode(page.episode)"
        >
          {{ page.label }}
        </button>

        <button
          v-if="hasNext"
          type="button"
          class="pagination-link"
          @click="moveNext"
        >
          다음
        </button>

        <span
          v-else
          class="pagination-disabled"
        >
          다음
        </span>
      </nav>

      <article class="episode-content">
        <p class="episode-label">
          {{ currentEpisode.label }}
        </p>

        <h2 class="episode-title">
          {{ currentEpisode.title }}
        </h2>

        <div class="episode-body">
          <p
            v-for="paragraph in paragraphs"
            :key="paragraph"
          >
            {{ paragraph }}
          </p>
        </div>
      </article>

      <nav class="episode-pagination bottom">
        <button
          v-if="hasPrev"
          type="button"
          class="pagination-link"
          @click="movePrev"
        >
          이전
        </button>

        <span
          v-else
          class="pagination-disabled"
        >
          이전
        </span>

        <button
          v-for="page in pages"
          :key="`bottom-${page.episode}`"
          type="button"
          class="pagination-link"
          :class="{ active: page.episode === currentEpisode.episode }"
          @click="moveToEpisode(page.episode)"
        >
          {{ page.label }}
        </button>

        <button
          v-if="hasNext"
          type="button"
          class="pagination-link"
          @click="moveNext"
        >
          다음
        </button>

        <span
          v-else
          class="pagination-disabled"
        >
          다음
        </span>
      </nav>

      <p class="story-note">
        실제 이야기와 여러 소재들을 바탕으로 재구성된 이야기입니다.
        편하게 읽어주세요.
      </p>
    </section>
  </main>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { stories } from "../data/stories.js";

const route = useRoute();
const router = useRouter();

function getEpisodeFromQuery() {
  const episodeNumber = Number(route.query.episode);

  if (Number.isNaN(episodeNumber)) {
    return stories[0]?.episode ?? 0;
  }

  const matchedStory = stories.find((story) => {
    return story.episode === episodeNumber;
  });

  return matchedStory?.episode ?? stories[0]?.episode ?? 0;
}

const currentEpisodeNumber = ref(getEpisodeFromQuery());

watch(
  () => route.query.episode,
  () => {
    currentEpisodeNumber.value = getEpisodeFromQuery();
  }
);

const currentEpisode = computed(() => {
  return stories.find((story) => {
    return story.episode === currentEpisodeNumber.value;
  }) ?? stories[0];
});

const currentIndex = computed(() => {
  return stories.findIndex((story) => {
    return story.episode === currentEpisodeNumber.value;
  });
});

const hasPrev = computed(() => {
  return currentIndex.value > 0;
});

const hasNext = computed(() => {
  return currentIndex.value >= 0 && currentIndex.value < stories.length - 1;
});

const pages = computed(() => {
  const maxVisible = 8;
  const half = Math.floor(maxVisible / 2);

  let start = currentIndex.value - half;
  let end = start + maxVisible;

  if (start < 0) {
    start = 0;
    end = maxVisible;
  }

  if (end > stories.length) {
    end = stories.length;
    start = Math.max(0, end - maxVisible);
  }

  return stories.slice(start, end).map((story) => {
    return {
      episode: story.episode,
      label: story.episode === 0
        ? "에필로그"
        : `${story.episode}화`,
    };
  });
});

const paragraphs = computed(() => {
  return currentEpisode.value.content
    .trim()
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
});

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function moveToEpisode(episodeNumber) {
  router.push({
    path: "/story",
    query: {
      episode: episodeNumber,
    },
  });

  currentEpisodeNumber.value = episodeNumber;

  scrollToTop();
}

function movePrev() {
  if (!hasPrev.value) return;

  moveToEpisode(stories[currentIndex.value - 1].episode);
}

function moveNext() {
  if (!hasNext.value) return;

  moveToEpisode(stories[currentIndex.value + 1].episode);
}
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

.episode-pagination {
  display: flex;
  align-items: center;
  gap: 8px;

  padding: 14px 0;

  border-top: 1px solid #242a35;
  border-bottom: 1px solid #242a35;

  overflow-x: auto;
}

.episode-pagination.bottom {
  margin-top: 24px;
}

.pagination-link,
.pagination-disabled {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-width: 44px;
  height: 32px;

  padding: 0 12px;

  border: 1px solid #2a303b;
  border-radius: 999px;

  color: #8d96a5;
  background: transparent;

  font-size: 12px;
  font-weight: 600;
  text-decoration: none;

  white-space: nowrap;
}

.pagination-link {
  cursor: pointer;

  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    background 0.2s ease;
}

.pagination-link:hover {
  border-color: #7aa2ff;
  color: #7aa2ff;
}

.pagination-link.active {
  border-color: #7aa2ff;
  background: #7aa2ff;
  color: #0f1115;
}

.pagination-disabled {
  opacity: 0.35;
}

.episode-content {
  padding: 28px 0 0;
}

.episode-label {
  margin: 0 0 8px;
  color: #7aa2ff;
  font-size: 13px;
  letter-spacing: 0.08em;
}

.episode-title {
  margin: 0;
  color: #f2f4f8;
  font-size: clamp(26px, 4vw, 38px);
  line-height: 1.2;
  letter-spacing: -0.04em;
}

.episode-body {
  max-width: 760px;
  margin-top: 24px;
}

.episode-body p {
  margin: 0 0 22px;

  color: #d2d7df;

  font-size: 17px;
  line-height: 2;
  word-break: keep-all;
}

.story-note {
  margin: 18px 4px 0;

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

  .episode-pagination {
    gap: 6px;
    padding: 12px 0;
  }

  .pagination-link,
  .pagination-disabled {
    min-width: 40px;
    height: 30px;
    padding: 0 10px;
  }

  .episode-content {
    padding-top: 24px;
  }

  .episode-title {
    font-size: 28px;
  }

  .episode-body {
    margin-top: 20px;
  }

  .episode-body p {
    font-size: 16px;
    line-height: 1.9;
  }
}
</style>