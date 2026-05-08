<!-- src/components/home/BusRecords.vue -->

<template>
  <section class="bus-records">
    <div class="record-header">
      <h2 class="record-main-title">
        나의 버스기사 일정
      </h2>

      <p class="record-sub-title">
        실제 버스기사로 향하는 일정과 큰 기록들을 정리합니다.
      </p>
    </div>

    <div class="record-list">
      <div
        v-for="record in formattedRecords"
        :key="`${record.date}-${record.content}`"
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
        </div>

        <p class="record-content">
          {{ record.content }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { busRecords } from "../../data/busRecords.js";

function toDateOnly(dateText) {
  const [year, month, day] = dateText.split("-").map(Number);

  return new Date(year, month - 1, day);
}

function formatDate(dateText) {
  return dateText.replaceAll("-", ".");
}

function getToday() {
  const now = new Date();

  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
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

const formattedRecords = computed(() => {
  return busRecords
    .map((record, index) => {
      const targetDate =
        toDateOnly(record.date);

      const diffDays =
        getDiffDays(targetDate);

      // 미래 일정
      if (diffDays > 0) {
        return {
          ...record,

          dday: `D-${diffDays}`,

          displayDate:
            `${formatDate(record.date)}`,

          sortOrder: -diffDays,

          inputOrder: index,
        };
      }

      // 오늘 일정
      if (diffDays === 0) {
        return {
          ...record,

          dday: "D-day",

          displayDate:
            `${formatDate(record.date)}`,

          sortOrder: 0,

          inputOrder: index,
        };
      }

      // 과거 일정
      return {
        ...record,

        dday: "",

        displayDate:
          formatDate(record.date),

        sortOrder:
          Math.abs(diffDays) + 10000,

        inputOrder: index,
      };
    })

    .sort((a, b) => {
      // 날짜 우선 정렬
      if (a.sortOrder !== b.sortOrder) {
        return a.sortOrder - b.sortOrder;
      }

      // 같은 날짜면
      // 아래에 입력한 데이터가 위로
      return b.inputOrder - a.inputOrder;
    })

    // 홈은 상위 5개만
    .slice(0, 5);
});
</script>

<style scoped>
.bus-records {
  max-width: 1080px;
  margin: 0 auto;

  padding: 10px 24px 6px;
}

.record-header {
  margin-bottom: 16px;
}

.record-main-title {
  margin: 0;

  color: #f2f4f8;

  font-size: clamp(26px, 4vw, 36px);
  line-height: 1.15;
  letter-spacing: -0.04em;
}

.record-sub-title {
  margin: 8px 0 0;

  color: #aeb6c4;

  font-size: 15px;
  line-height: 1.6;
}

.record-list {
  border-top: 1px solid #242a35;
}

.record-item {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 20px;

  padding: 16px 0;

  border-bottom: 1px solid #242a35;
}

.record-date {
  display: flex;
  align-items: center;
  gap: 8px;

  color: #7f8794;

  font-size: 13px;
  white-space: nowrap;
}

.date {
  color: #aeb6c4;
}

.dday {
  padding: 3px 8px;

  border: 1px solid #343a46;
  border-radius: 999px;

  color: #7aa2ff;

  font-size: 11px;
}

.record-content {
  margin: 0;

  color: #d2d7df;

  font-size: 15px;
  line-height: 1.65;
}

@media (max-width: 768px) {
  .bus-records {
    padding: 8px 20px 2px;
  }

  .record-main-title {
    font-size: 28px;
  }

  .record-sub-title {
    font-size: 14px;
  }

  .record-item {
    grid-template-columns: 1fr;
    gap: 6px;

    padding: 14px 0;
  }
}
</style>