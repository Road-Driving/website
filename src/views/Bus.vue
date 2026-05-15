<!-- src/views/Bus.vue -->

<template>
  <main class="bus-page">
    <section class="bus-wrap">
      <div class="bus-header">
        <h1 class="bus-main-title">
          나의 버스기사 일정
        </h1>

        <p class="bus-sub-title">
          관리자 페이지에 저장된 일정과 큰 기록들을 표시합니다.
        </p>
      </div>

      <div class="record-list">
        <p
          v-if="formattedRecords.length === 0"
          class="empty-text"
        >
          저장된 기록이 없습니다.
        </p>

        <div
          v-for="record in formattedRecords"
          :key="record.id"
          class="record-item"
        >
          <div class="record-date">
            <span
              v-if="record.dday"
              class="dday"
            >
              {{ record.dday }}
            </span>

            <span class="date">
              {{ record.displayDate }}
            </span>

            <span
              v-if="record.time"
              class="time"
            >
              {{ record.time }}
            </span>

            <span
              v-if="record.remainingText"
              class="remaining"
            >
              {{ record.remainingText }}
            </span>
          </div>

          <p class="record-content">
            {{ record.content }}
          </p>
        </div>
      </div>
    </section>
  </main>
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

import { db } from "../lib/firebase.js";

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

function isValidDateText(dateText) {
  return /^\d{4}\/\d{2}\/\d{2}$/.test(dateText);
}

function toDateOnly(dateText) {
  const [year, month, day] = dateText.split("/").map(Number);

  return new Date(year, month - 1, day);
}

function toDateTime(dateText, timeText) {
  const [year, month, day] = dateText.split("/").map(Number);
  const safeTime = timeText || "00:00";
  const [hour, minute] = safeTime.split(":").map(Number);

  return new Date(year, month - 1, day, hour, minute, 0);
}

function formatDate(dateText) {
  return dateText.replaceAll("/", ".");
}

function getToday() {
  return new Date(
    now.value.getFullYear(),
    now.value.getMonth(),
    now.value.getDate()
  );
}

function getDiffDays(targetDate) {
  const today = getToday();

  const diffTime =
    targetDate.getTime() - today.getTime();

  return Math.ceil(
    diffTime / (1000 * 60 * 60 * 24)
  );
}

function formatRemaining(milliseconds) {
  const totalMinutes = Math.max(
    0,
    Math.ceil(milliseconds / (1000 * 60))
  );

  const days = Math.floor(totalMinutes / (24 * 60));
  let rest = totalMinutes % (24 * 60);

  const hours = Math.floor(rest / 60);
  const minutes = rest % 60;

  if (days > 0) {
    return `${days}일 ${hours}시간 ${minutes}분 남음`;
  }

  if (hours > 0) {
    return `${hours}시간 ${minutes}분 남음`;
  }

  return `${minutes}분 남음`;
}

const formattedRecords = computed(() => {
  return records.value
    .filter((record) => {
      return record.date && isValidDateText(record.date);
    })
    .map((record) => {
      const targetDate = toDateOnly(record.date);
      const targetDateTime = toDateTime(record.date, record.time);
      const diffDays = getDiffDays(targetDate);
      const remainingMilliseconds =
        targetDateTime.getTime() - now.value.getTime();

      return {
        ...record,
        diffDays,
        dday:
          diffDays > 0
            ? `D-${diffDays}`
            : diffDays === 0
              ? "D-day"
              : "",
        displayDate: formatDate(record.date),
        remainingText:
          remainingMilliseconds > 0
            ? formatRemaining(remainingMilliseconds)
            : "",
      };
    })
    .sort((a, b) => {
      const aFuture = a.diffDays >= 0;
      const bFuture = b.diffDays >= 0;

      if (aFuture && !bFuture) {
        return -1;
      }

      if (!aFuture && bFuture) {
        return 1;
      }

      if (aFuture && bFuture) {
        if (a.diffDays !== b.diffDays) {
          return b.diffDays - a.diffDays;
        }

        return (b.time || "00:00").localeCompare(a.time || "00:00");
      }

      return b.diffDays - a.diffDays;
    });
});
</script>

<style scoped>
.bus-page {
  background: #0f1115;
  color: #f2f4f8;
}

.bus-wrap {
  max-width: 1080px;
  margin: 0 auto;
  padding: 18px 24px 28px;
}

.bus-header {
  margin-bottom: 16px;
}

.bus-main-title {
  margin: 0;
  color: #f2f4f8;
  font-size: clamp(26px, 4vw, 36px);
  line-height: 1.15;
  letter-spacing: -0.04em;
}

.bus-sub-title {
  margin: 8px 0 0;
  color: #aeb6c4;
  font-size: 15px;
  line-height: 1.6;
}

.record-list {
  border-top: 1px solid #242a35;
}

.empty-text {
  margin: 16px 0 0;
  color: #7f8794;
  font-size: 14px;
}

.record-item {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 20px;
  padding: 16px 0;
  border-bottom: 1px solid #242a35;
}

.record-date {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  color: #7f8794;
  font-size: 13px;
}

.date {
  color: #aeb6c4;
}

.time {
  color: #7f8794;
}

.dday {
  padding: 3px 8px;
  border: 1px solid #343a46;
  border-radius: 999px;
  color: #7aa2ff;
  font-size: 11px;
}

.remaining {
  color: #7aa2ff;
  font-size: 12px;
}

.record-content {
  margin: 0;
  color: #d2d7df;
  font-size: 15px;
  line-height: 1.65;
}

@media (max-width: 768px) {
  .bus-wrap {
    padding: 16px 20px 24px;
  }

  .bus-main-title {
    font-size: 28px;
  }

  .bus-sub-title {
    font-size: 14px;
  }

  .record-item {
    grid-template-columns: 1fr;
    gap: 6px;
    padding: 14px 0;
  }
}
</style>