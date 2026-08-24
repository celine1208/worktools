// js/dday-calculator.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. 탭 전환 처리
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // 오늘 날짜 설정 (YYYY-MM-DD)
    const todayStr = new Date().toISOString().split('T')[0];

    // Form 1 Elements: D-Day
    const baseDateInput = document.getElementById('baseDate');
    const targetDateInput = document.getElementById('targetDate');
    const includeBaseDayCheck = document.getElementById('includeBaseDay');
    const ddayForm = document.getElementById('ddayForm');
    const ddayResultBox = document.getElementById('ddayResultBox');
    const ddayValue = document.getElementById('ddayValue');
    const ddayDetail = document.getElementById('ddayDetail');

    // Form 2 Elements: N일 전/후
    const startDateInput = document.getElementById('startDate');
    const dayOffsetInput = document.getElementById('dayOffset');
    const dateAddForm = document.getElementById('dateAddForm');
    const dateAddResultBox = document.getElementById('dateAddResultBox');
    const calculatedDate = document.getElementById('calculatedDate');
    const dateAddDetail = document.getElementById('dateAddDetail');

    // 기본 날짜 초기화
    if (baseDateInput) baseDateInput.value = todayStr;
    if (startDateInput) startDateInput.value = todayStr;

    // 2. D-Day 계산 로직
    if (ddayForm) {
        ddayForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const baseDate = new Date(baseDateInput.value);
            const targetDate = new Date(targetDateInput.value);
            const isIncludeBase = includeBaseDayCheck.checked;

            // 시/분/초 차이로 인한 오류 방지를 위해 UTC 자정 기준으로 변환
            const utcBase = Date.UTC(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
            const utcTarget = Date.UTC(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

            const msPerDay = 1000 * 60 * 60 * 24;
            let diffDays = Math.round((utcTarget - utcBase) / msPerDay);

            if (isIncludeBase) {
                if (diffDays >= 0) diffDays += 1;
                else diffDays -= 1;
            }

            let displayText = '';
            let detailText = '';

            if (diffDays === 0) {
                displayText = 'D-Day (오늘)';
                detailText = '목표일이 바로 오늘입니다!';
            } else if (diffDays > 0) {
                displayText = `D-${diffDays}`;
                detailText = `목표일까지 <strong>${diffDays}일</strong> 남았습니다.`;
            } else {
                const absDays = Math.abs(diffDays);
                displayText = `D+${absDays}`;
                detailText = `목표일로부터 <strong>${absDays}일</strong> 지났습니다.`;
            }

            ddayValue.textContent = displayText;
            ddayDetail.innerHTML = detailText;
            ddayResultBox.classList.add('active');
        });
    }

    // 3. N일 전/후 계산 로직
    if (dateAddForm) {
        dateAddForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const startDate = new Date(startDateInput.value);
            const offset = parseInt(dayOffsetInput.value, 10);

            if (isNaN(offset)) {
                alert('올바른 숫자 값을 입력해주세요.');
                return;
            }

            // 날짜 더하기/빼기
            const resultDate = new Date(startDate);
            resultDate.setDate(resultDate.getDate() + offset);

            const year = resultDate.getFullYear();
            const month = String(resultDate.getMonth() + 1).padStart(2, '0');
            const day = String(resultDate.getDate()).padStart(2, '0');
            const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][resultDate.getDay()];

            const formattedDate = `${year}-${month}-${day} (${dayOfWeek})`;

            calculatedDate.textContent = formattedDate;
            dateAddDetail.innerHTML = `기준일로부터 <strong>${offset >= 0 ? offset + '일 후' : Math.abs(offset) + '일 전'}</strong> 날짜입니다.`;
            dateAddResultBox.classList.add('active');
        });
    }
});