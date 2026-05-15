<template>
  <section class="bus-records">
    <div class="bus-records-wrap">
      <h2 class="section-title">
        다가오는 일정
      </h2>

      <p
        v-if="homeRecords.length === 0"
        class="empty-text"
      >
        다가오는 일정이 없습니다.
      </p>

      <div
        v-for="record in homeRecords"
        :key="record.id"
        class="record-item"
      >
        <div class="record-date">
          <span class="dday">
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

const homeRecords = computed(() => {
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
          diffDays === 0
            ? "D-day"
            : `D-${diffDays}`,
        displayDate: formatDate(record.date),
        remainingText:
          remainingMilliseconds > 0
            ? formatRemaining(remainingMilliseconds)
            : "",
      };
    })
    .filter((record) => {
      return record.diffDays >= 0;
    })
    .sort((a, b) => {
      if (a.diffDays !== b.diffDays) {
        return a.diffDays - b.diffDays;
      }

      return (a.time || "00:00").localeCompare(b.time || "00:00");
    })
    .slice(0, 5)
    .sort((a, b) => {
      if (a.diffDays !== b.diffDays) {
        return b.diffDays - a.diffDays;
      }

      return (b.time || "00:00").localeCompare(a.time || "00:00");
    });
});
</script>

<style scoped>
.bus-records {
  padding: 24px 20px 10px;
}

.bus-records-wrap {
  max-width: 720px;
  margin: 0 auto;
}

.section-title {
  margin: 0 0 16px;
  color: #f2f4f8;
  font-size: 24px;
}

.empty-text {
  color: #7f8794;
  font-size: 14px;
}

.record-item {
  padding: 16px 0;
  border-top: 1px solid #242a35;
}

.record-item:last-child {
  border-bottom: 1px solid #242a35;
}

.record-date {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 13px;
}

.dday {
  padding: 3px 8px;
  border: 1px solid #343a46;
  border-radius: 999px;
  color: #7aa2ff;
  font-size: 11px;
}

.date {
  color: #aeb6c4;
}

.time {
  color: #7f8794;
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
</style>