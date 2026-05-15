<!-- src/views/Admin.vue -->

<template>
  <main class="admin-page">
    <section class="admin-wrap">
      <h1 class="admin-title">관리자</h1>

      <p class="admin-description">
        일정 기록 입력 및 관리
      </p>

      <div v-if="user" class="admin-user">
        <p>로그인됨</p>
        <strong>{{ user.email }}</strong>

        <button type="button" @click="logout">
          로그아웃
        </button>
      </div>

      <div v-else class="login-wrap">
        <button type="button" class="login-button" @click="login">
          Google 로그인
        </button>
      </div>

      <form
        v-if="user"
        class="record-form"
        @submit.prevent="saveRecord"
      >
        <div class="date-time-row">
          <label class="form-group">
            <span>날짜</span>

            <input
              v-model="form.date"
              type="text"
              placeholder="YYYY/MM/DD"
              inputmode="numeric"
            />
          </label>

          <label class="form-group">
            <span>시간</span>

            <input
              v-model="form.time"
              type="time"
            />
          </label>
        </div>

        <label class="form-group">
          <span>내용</span>

          <textarea
            v-model="form.content"
            rows="5"
          ></textarea>
        </label>

        <label class="checkbox-group">
          <input
            v-model="form.useCounter"
            type="checkbox"
          />

          <span>누적 기록 적용</span>
        </label>

        <label
          v-if="form.useCounter"
          class="form-group"
        >
          <span>누적 기록 이름</span>

          <input
            v-model="form.counterLabel"
            type="text"
            placeholder="버스기사 여정"
          />
        </label>

        <div class="form-actions">
          <button
            type="submit"
            class="save-button"
            :disabled="isSaving"
          >
            {{ editingId ? "수정 저장" : isSaving ? "저장 중..." : "저장" }}
          </button>

          <button
            v-if="editingId"
            type="button"
            class="cancel-button"
            @click="cancelEdit"
          >
            수정 취소
          </button>
        </div>

        <p v-if="message" class="message">
          {{ message }}
        </p>
      </form>

      <section
        v-if="user"
        class="counter-section"
      >
        <h2>누적 기록</h2>

        <p
          v-if="counterRecords.length === 0"
          class="empty-text"
        >
          누적 기록이 없습니다.
        </p>

        <div
          v-for="counter in counterRecords"
          :key="counter.id"
          class="counter-item"
        >
          <span class="counter-label">
            {{ counter.label }}
          </span>

          <strong class="counter-time">
            {{ counter.durationText }}
          </strong>
        </div>
      </section>

      <section
        v-if="user"
        class="record-manage"
      >
        <h2>저장된 기록</h2>

        <p
          v-if="displayRecords.length === 0"
          class="empty-text"
        >
          저장된 기록이 없습니다.
        </p>

        <div
          v-for="record in displayRecords"
          :key="record.id"
          class="record-item"
        >
          <div class="record-info">
            <p class="record-date">
              {{ record.date }}
              <span v-if="record.time">
                {{ record.time }}
              </span>
            </p>

            <div
              v-if="record.dday || record.remainingText"
              class="record-status"
            >
              <span v-if="record.dday">
                {{ record.dday }}
              </span>

              <span v-if="record.remainingText">
                {{ record.remainingText }}
              </span>
            </div>

            <p class="record-content">
              {{ record.content }}
            </p>

            <p
              v-if="record.counterLabel"
              class="record-counter"
            >
              누적 기록: {{ record.counterLabel }}
              <br />
              시작 기준: {{ formatStartedAt(record.counterStartedAt) }}
            </p>
          </div>

          <div class="record-actions">
            <button
              type="button"
              @click="startEdit(record)"
            >
              수정
            </button>

            <button
              type="button"
              class="delete-button"
              @click="deleteRecord(record)"
            >
              삭제
            </button>
          </div>
        </div>
      </section>
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
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import {
  ref as dbRef,
  push,
  set,
  update,
  remove,
  onValue,
  serverTimestamp,
} from "firebase/database";

import {
  auth,
  provider,
  db,
} from "../lib/firebase.js";

const ADMIN_EMAIL = "evepoi86@gmail.com";

const user = ref(null);
const isSaving = ref(false);
const message = ref("");
const editingId = ref("");
const records = ref([]);
const now = ref(new Date());

let timer = null;
let unsubscribeAuth = null;
let unsubscribeRecords = null;

const form = ref({
  date: "",
  time: "",
  content: "",
  useCounter: false,
  counterLabel: "",
});

onMounted(() => {
  timer = setInterval(() => {
    now.value = new Date();
  }, 1000);

  unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
    if (
      currentUser &&
      currentUser.email === ADMIN_EMAIL
    ) {
      user.value = currentUser;
      loadRecords();
      return;
    }

    user.value = null;
    records.value = [];

    if (unsubscribeRecords) {
      unsubscribeRecords();
      unsubscribeRecords = null;
    }

    if (currentUser) {
      alert("관리자 계정만 접근 가능합니다.");
      signOut(auth);
    }
  });
});

onUnmounted(() => {
  clearInterval(timer);

  if (unsubscribeAuth) {
    unsubscribeAuth();
  }

  if (unsubscribeRecords) {
    unsubscribeRecords();
  }
});

async function login() {
  await signInWithPopup(auth, provider);
}

async function logout() {
  await signOut(auth);
  records.value = [];
  cancelEdit();
}

function loadRecords() {
  if (unsubscribeRecords) {
    unsubscribeRecords();
  }

  const recordsRef = dbRef(db, "busRecords");

  unsubscribeRecords = onValue(recordsRef, (snapshot) => {
    const data = snapshot.val();

    if (!data) {
      records.value = [];
      return;
    }

    records.value = Object.entries(data)
      .map(([id, value]) => {
        return {
          id,
          ...value,
        };
      })
      .sort((a, b) => {
        const aDateTime = `${a.date} ${a.time || "00:00"}`;
        const bDateTime = `${b.date} ${b.time || "00:00"}`;

        return bDateTime.localeCompare(aDateTime);
      });
  });
}

function resetForm() {
  form.value = {
    date: "",
    time: "",
    content: "",
    useCounter: false,
    counterLabel: "",
  };
}

function cancelEdit() {
  editingId.value = "";
  resetForm();
  message.value = "";
}

function startEdit(record) {
  editingId.value = record.id;

  form.value = {
    date: record.date || "",
    time: record.time || "",
    content: record.content || "",
    useCounter: Boolean(record.counterLabel),
    counterLabel: record.counterLabel ?? "",
  };

  message.value = "수정할 기록을 불러왔습니다.";

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function isValidDateText(dateText) {
  const match = /^(\d{4})\/(\d{2})\/(\d{2})$/.exec(dateText);

  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function splitDate(dateText) {
  const [year, month, day] = dateText.split("/").map(Number);

  return {
    year,
    month,
    day,
  };
}

function toDateOnly(dateText) {
  const {
    year,
    month,
    day,
  } = splitDate(dateText);

  return new Date(year, month - 1, day);
}

function toDateTime(dateText, timeText) {
  const {
    year,
    month,
    day,
  } = splitDate(dateText);

  const safeTime = timeText || "00:00";
  const [hour, minute] = safeTime.split(":").map(Number);

  return new Date(year, month - 1, day, hour, minute, 0);
}

function toCounterStartedAt(dateText, timeText) {
  const {
    year,
    month,
    day,
  } = splitDate(dateText);

  const monthText = String(month).padStart(2, "0");
  const dayText = String(day).padStart(2, "0");

  return `${year}-${monthText}-${dayText}T${timeText}:00`;
}

function formatStartedAt(startedAt) {
  if (!startedAt) {
    return "";
  }

  const date = new Date(startedAt);

  if (Number.isNaN(date.getTime())) {
    return startedAt;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${year}/${month}/${day} ${hour}:${minute}`;
}

function formatDurationFromMinutes(totalMinutes) {
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

function getDdayInfo(record) {
  if (!record.date || !isValidDateText(record.date)) {
    return {
      dday: "",
      remainingText: "",
    };
  }

  const today = new Date(
    now.value.getFullYear(),
    now.value.getMonth(),
    now.value.getDate()
  );

  const targetDate = toDateOnly(record.date);
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let dday = "";

  if (diffDays > 0) {
    dday = `D-${diffDays}`;
  } else if (diffDays === 0) {
    dday = "D-day";
  }

  const targetDateTime = toDateTime(record.date, record.time);
  const remainingMilliseconds =
    targetDateTime.getTime() - now.value.getTime();

  return {
    dday,
    remainingText:
      remainingMilliseconds > 0
        ? formatRemaining(remainingMilliseconds)
        : "",
  };
}

const displayRecords = computed(() => {
  return records.value.map((record) => {
    const ddayInfo = getDdayInfo(record);

    return {
      ...record,
      ...ddayInfo,
    };
  });
});

const counterRecords = computed(() => {
  return records.value
    .filter((record) => {
      return record.counterLabel && record.counterStartedAt;
    })
    .map((record) => {
      const startedAt = new Date(record.counterStartedAt);
      const diffMilliseconds = now.value.getTime() - startedAt.getTime();

      const totalMinutes = Math.max(
        0,
        Math.floor(diffMilliseconds / (1000 * 60))
      );

      return {
        id: record.id,
        label: record.counterLabel,
        totalMinutes,
        durationText: formatDurationFromMinutes(totalMinutes),
      };
    })
    .sort((a, b) => {
      return b.totalMinutes - a.totalMinutes;
    });
});

async function saveRecord() {
  message.value = "";

  const date = form.value.date.trim();
  const time = form.value.time.trim();
  const content = form.value.content.trim();
  const counterLabel = form.value.counterLabel.trim();

  if (!date) {
    message.value = "날짜를 입력해주세요.";
    return;
  }

  if (!isValidDateText(date)) {
    message.value = "날짜는 YYYY/MM/DD 형식으로 입력해주세요.";
    return;
  }

  if (!time) {
    message.value = "시간을 입력해주세요.";
    return;
  }

  if (!content) {
    message.value = "내용을 입력해주세요.";
    return;
  }

  if (
    form.value.useCounter &&
    !counterLabel
  ) {
    message.value = "누적 기록 이름을 입력해주세요.";
    return;
  }

  try {
    isSaving.value = true;

    const counterStartedAt =
      form.value.useCounter
        ? toCounterStartedAt(date, time)
        : "";

    const recordData = {
      date,
      time,
      content,
      counterLabel: form.value.useCounter
        ? counterLabel
        : "",
      counterStartedAt,
      updatedAt: serverTimestamp(),
    };

    if (editingId.value) {
      await update(
        dbRef(db, `busRecords/${editingId.value}`),
        recordData
      );

      cancelEdit();
      message.value = "수정되었습니다.";
      return;
    }

    const newRecordRef = push(dbRef(db, "busRecords"));

    await set(newRecordRef, {
      ...recordData,
      createdAt: serverTimestamp(),
    });

    resetForm();
    message.value = "저장되었습니다.";
  } catch (error) {
    console.error(error);
    message.value = "저장 중 오류가 발생했습니다.";
  } finally {
    isSaving.value = false;
  }
}

async function deleteRecord(record) {
  const confirmed = confirm(
    `"${record.content}" 기록을 삭제할까요?`
  );

  if (!confirmed) return;

  try {
    await remove(dbRef(db, `busRecords/${record.id}`));

    if (editingId.value === record.id) {
      cancelEdit();
    }

    message.value = "삭제되었습니다.";
  } catch (error) {
    console.error(error);
    message.value = "삭제 중 오류가 발생했습니다.";
  }
}
</script>

<style scoped>
.admin-page {
  background: #0f1115;
  color: #f2f4f8;
}

.admin-wrap {
  max-width: 720px;
  margin: 0 auto;
  padding: 24px;
}

.admin-title {
  margin: 0;
  font-size: 34px;
}

.admin-description {
  margin: 10px 0 28px;
  color: #9ea7b5;
}

.admin-user {
  margin-bottom: 28px;
  padding: 18px;
  border: 1px solid #242a35;
  border-radius: 18px;
  background: #181c23;
}

.admin-user p {
  margin: 0 0 6px;
  color: #7aa2ff;
}

.admin-user strong {
  display: block;
  margin-bottom: 16px;
}

.login-button,
.admin-user button,
.save-button,
.cancel-button,
.record-actions button {
  padding: 12px 18px;
  border: none;
  border-radius: 999px;
  background: #7aa2ff;
  color: #0f1115;
  font-weight: 700;
  cursor: pointer;
}

.save-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cancel-button {
  background: #343a46;
  color: #f2f4f8;
}

.record-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.date-time-row {
  display: grid;
  grid-template-columns: 1fr 160px;
  gap: 12px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group span {
  color: #aeb6c4;
  font-size: 14px;
}

.form-group input,
.form-group textarea {
  padding: 14px;
  border: 1px solid #242a35;
  border-radius: 14px;
  background: #181c23;
  color: #f2f4f8;
  font-size: 15px;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.checkbox-group span {
  color: #d4d8e0;
}

.form-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.message {
  margin: 0;
  color: #7aa2ff;
  font-size: 14px;
}

.counter-section,
.record-manage {
  margin-top: 36px;
}

.counter-section h2,
.record-manage h2 {
  margin: 0 0 16px;
  font-size: 24px;
}

.empty-text {
  color: #7f8794;
}

.counter-item {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 0;
  border-top: 1px solid #242a35;
}

.counter-item:last-child {
  border-bottom: 1px solid #242a35;
}

.counter-label {
  color: #7aa2ff;
  font-size: 14px;
}

.counter-time {
  color: #f2f4f8;
  font-size: 15px;
  text-align: right;
}

.record-item {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  padding: 16px 0;
  border-top: 1px solid #242a35;
}

.record-item:last-child {
  border-bottom: 1px solid #242a35;
}

.record-date {
  margin: 0 0 6px;
  color: #7aa2ff;
  font-size: 13px;
}

.record-date span {
  margin-left: 8px;
  color: #8d96a5;
}

.record-status {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.record-status span {
  padding: 4px 8px;
  border: 1px solid #343a46;
  border-radius: 999px;
  color: #aeb6c4;
  font-size: 12px;
}

.record-content {
  margin: 0;
  color: #d2d7df;
  line-height: 1.6;
}

.record-counter {
  margin: 8px 0 0;
  color: #7f8794;
  font-size: 13px;
  line-height: 1.6;
}

.record-actions {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  white-space: nowrap;
}

.record-actions .delete-button {
  background: #3a2228;
  color: #ff9aa8;
}

@media (max-width: 768px) {
  .admin-wrap {
    padding: 20px;
  }

  .date-time-row {
    grid-template-columns: 1fr;
  }

  .counter-item,
  .record-item {
    flex-direction: column;
  }

  .counter-time {
    text-align: left;
  }

  .record-actions {
    justify-content: flex-start;
  }
}
</style>