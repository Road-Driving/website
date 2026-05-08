<!-- src/components/common/GlobalFooter.vue -->

<template>
  <footer class="site-footer">
    <div class="footer-divider"></div>

    <div class="footer-content">
      <div class="footer-empty"></div>

      <div class="footer-meta">
        <p class="footer-title">
          Road Driving
        </p>

        <p class="footer-description">
          본 사이트는 ChatGPT와 Vue를 기반으로 제작되었습니다.
        </p>
      </div>

      <div class="footer-clock">
        <p class="clock-date">
          {{ todayText }}
        </p>

        <p class="clock-time">
          {{ timeText }}
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";

const todayText = ref("");
const timeText = ref("");

let timer = null;

function updateDateTime() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const date = String(now.getDate()).padStart(2, "0");

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  todayText.value = `${year}.${month}.${date}`;
  timeText.value = `${hours}:${minutes}`;
}

onMounted(() => {
  updateDateTime();

  timer = setInterval(updateDateTime, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style scoped>
.site-footer {
  max-width: 1080px;

  margin: 10px auto 0;

  padding: 0 24px 34px;
}

.footer-divider {
  width: 100%;
  height: 1px;

  margin-bottom: 18px;

  background: linear-gradient(
    to right,
    transparent,
    rgba(255, 255, 255, 0.08),
    transparent
  );
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
}

.footer-empty {
  width: 100%;
}

.footer-meta {
  text-align: center;
}

.footer-title {
  margin: 0;

  color: #7f8794;

  font-size: 12px;
  letter-spacing: 0.08em;
}

.footer-description {
  margin: 8px 0 0;

  color: #5f6672;

  font-size: 12px;
  line-height: 1.7;
}

.footer-clock {
  justify-self: end;

  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.clock-date {
  margin: 0;

  color: #6f7785;

  font-size: 13px;
  letter-spacing: 0.06em;
}

.clock-time {
  margin: 2px 0 0;

  color: #f2f4f8;

  font-size: 34px;
  font-weight: 700;
  letter-spacing: -0.05em;
  line-height: 1;
}

@media (max-width: 768px) {
  .site-footer {
    margin-top: 6px;

    padding: 0 20px 30px;
  }

  .footer-divider {
    margin-bottom: 16px;
  }

  .footer-content {
    grid-template-columns: 1fr;

    gap: 18px;
  }

  .footer-empty {
    display: none;
  }

  .footer-clock {
    justify-self: center;
    align-items: center;
  }

  .clock-time {
    font-size: 30px;
  }
}
</style>