<template>
  <section class="counter-section">
    <div class="counter-wrap">
      <h2 class="counter-title">
        누적 기록
      </h2>

      <div
        v-if="counterRecords.length === 0"
        class="empty-text"
      >
        누적 기록이 없습니다.
      </div>

      <div
        v-for="counter in counterRecords"
        :key="counter.id"
        class="counter-item"
      >
        <div>
          <p class="counter-label">
            {{ counter.label }}
          </p>

          <p class="counter-start">
            시작:
            {{ counter.startedText }}
          </p>
        </div>

        <strong class="counter-time">
          {{ counter.durationText }}
        </strong>
      </div>
    </div>
  </section>
</template>

<script setup>
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
} from "vue";

import {
  ref as dbRef,
  onValue,
} from "firebase/database";

import { db } from "../../lib/firebase.js";

const records = ref([]);
const now = ref(new Date());

let timer = null;
let unsubscribeRecords = null;

onMounted(() => {
  timer = setInterval(() => {
    now.value = new Date();
  }, 1000);

  loadRecords();
});

onUnmounted(() => {
  clearInterval(timer);

  if (unsubscribeRecords) {
    unsubscribeRecords();
  }
});

function loadRecords() {
  const recordsRef = dbRef(db, "busRecords");

  unsubscribeRecords = onValue(recordsRef, (snapshot) => {
    const data = snapshot.val();

    if (!data) {
      records.value = [];
      return;
    }

    records.value = Object.entries(data).map(([id, value]) => {
      return {
        id,
        ...value,
      };
    });
  });
}

function formatStartedAt(startedAt) {
  const date = new Date(startedAt);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${year}/${month}/${day} ${hour}:${minute}`;
}

function formatDuration(totalMinutes) {
  const years = Math.floor(totalMinutes / (365 * 24 * 60));
  let rest = totalMinutes % (365 * 24 * 60);

  const days = Math.floor(rest / (24 * 60));
  rest %= 24 * 60;

  const hours = Math.floor(rest / 60);
  const minutes = rest % 60;

  if (years > 0) {
    return `${years}년 ${days}일 ${hours}시간 ${minutes}분`;
  }

  if (days > 0) {
    return `${days}일 ${hours}시간 ${minutes}분`;
  }

  if (hours > 0) {
    return `${hours}시간 ${minutes}분`;
  }

  return `${minutes}분`;
}

const counterRecords = computed(() => {
  return records.value
    .filter((record) => {
      return record.counterLabel && record.counterStartedAt;
    })
    .map((record) => {
      const startedAt = new Date(record.counterStartedAt);

      const totalMinutes = Math.max(
        0,
        Math.floor(
          (now.value.getTime() - startedAt.getTime()) /
          (1000 * 60)
        )
      );

      return {
        id: record.id,
        label: record.counterLabel,
        startedText: formatStartedAt(record.counterStartedAt),
        durationText: formatDuration(totalMinutes),
        totalMinutes,
      };
    })
    .sort((a, b) => {
      return b.totalMinutes - a.totalMinutes;
    });
});
</script>

<style scoped>
.counter-section {
  padding: 32px 20px 10px;
}

.counter-wrap {
  max-width: 720px;
  margin: 0 auto;
}

.counter-title {
  margin: 0 0 20px;
  color: #f2f4f8;
  font-size: 28px;
}

.empty-text {
  color: #7f8794;
}

.counter-item {
  display: flex;
  justify-content: space-between;
  gap: 20px;

  padding: 18px;

  border: 1px solid #242a35;
  border-radius: 18px;

  background: #181c23;
}

.counter-item + .counter-item {
  margin-top: 14px;
}

.counter-label {
  margin: 0 0 8px;
  color: #7aa2ff;
  font-size: 15px;
  font-weight: 700;
}

.counter-start {
  margin: 0;
  color: #7f8794;
  font-size: 13px;
}

.counter-time {
  color: #f2f4f8;
  font-size: 18px;
  text-align: right;
}

@media (max-width: 768px) {
  .counter-item {
    flex-direction: column;
  }

  .counter-time {
    text-align: left;
  }
}
</style>