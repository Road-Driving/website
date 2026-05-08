<template>
  <section class="bus-records">
    <div class="section-header">
      <p class="eyebrow">Bus Record</p>
      <h2>길 위의 기록</h2>
      <p>
        대형면허, 자격증, 교육, 근무 준비까지.
        버스기사로 이어지는 현실적인 과정을 담습니다.
      </p>
    </div>

    <div class="record-list">
      <article
        v-for="record in records"
        :key="record.id"
        class="record-card"
      >
        <div>
          <p class="record-category">{{ record.category }}</p>
          <h3>{{ record.title }}</h3>
          <p class="record-description">
            {{ record.description }}
          </p>
        </div>

        <RouterLink :to="record.link" class="record-link">
          보기
        </RouterLink>
      </article>
    </div>
  </section>
</template>

<script setup>
const records = [
  {
    id: 1,
    category: "License",
    title: "대형면허 준비 기록",
    description: "버스기사로 가기 위한 첫 과정과 실제 준비 흐름을 정리합니다.",
    link: "/bus/license",
  },
  {
    id: 2,
    category: "Qualification",
    title: "버스운전 자격과 교육",
    description: "자격증, 운전정밀검사, 양성자 교육에 대한 공개 기록입니다.",
    link: "/bus/qualification",
  },
  {
    id: 3,
    category: "Work",
    title: "버스기사로 향하는 과정",
    description: "취업 준비와 근무를 앞두고 쌓아가는 현실적인 기록입니다.",
    link: "/bus/work",
  },
];
</script>

<style scoped>
.bus-records {
  max-width: 1080px;
  margin: 0 auto;
  padding: 96px 24px;
}

.section-header {
  max-width: 640px;
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

.record-list {
  display: grid;
  gap: 16px;
}

.record-card {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  padding: 28px;
  border: 1px solid #242a35;
  border-radius: 24px;
  background: linear-gradient(135deg, #181c23, #131720);
}

.record-category {
  margin: 0 0 12px;
  color: #7aa2ff;
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h3 {
  margin: 0;
  color: #f2f4f8;
  font-size: 22px;
}

.record-description {
  max-width: 680px;
  margin-top: 12px;
  color: #aeb6c4;
  line-height: 1.7;
}

.record-link {
  align-self: center;
  white-space: nowrap;
  color: #e8e8e8;
  text-decoration: none;
  font-weight: 600;
}

.record-link:hover {
  color: #7aa2ff;
}

@media (max-width: 768px) {
  .bus-records {
    padding: 72px 20px;
  }

  .record-card {
    flex-direction: column;
  }

  .record-link {
    align-self: flex-start;
  }
}
</style>