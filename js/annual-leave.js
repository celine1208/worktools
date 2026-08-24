// js/annual-leave.js

document.addEventListener('DOMContentLoaded', () => {
    const annualLeaveForm = document.getElementById('annualLeaveForm');
    const joinDateInput = document.getElementById('joinDate');
    const targetDateInput = document.getElementById('targetDate');

    const resultBox = document.getElementById('resultBox');
    const workingPeriod = document.getElementById('workingPeriod');
    const totalLeave = document.getElementById('totalLeave');
    const leaveDetail = document.getElementById('leaveDetail');

    // 오늘 날짜를 기본 조회 기준일로 설정
    const today = new Date().toISOString().split('T')[0];
    if (targetDateInput) {
        targetDateInput.value = today;
    }

    if (annualLeaveForm) {
        annualLeaveForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const joinDate = new Date(joinDateInput.value);
            const targetDate = new Date(targetDateInput.value);

            if (joinDate > targetDate) {
                alert('조회 기준일은 입사일보다 이후 날짜여야 합니다.');
                return;
            }

            // 근속 기간 계산 (년, 월, 일)
            let years = targetDate.getFullYear() - joinDate.getFullYear();
            let months = targetDate.getMonth() - joinDate.getMonth();
            let days = targetDate.getDate() - joinDate.getDate();

            if (days < 0) {
                months -= 1;
                const prevMonthLastDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0).getDate();
                days += prevMonthLastDay;
            }

            if (months < 0) {
                years -= 1;
                months += 12;
            }

            // 연차 계산 공식 적용 (근로기준법 제60조 기준)
            let totalAnnualLeave = 0;
            let detailText = '';

            if (years < 1) {
                // 1년 미만: 1개월 개근 시 1일씩 발생 (최대 11일)
                const monthDiff = (targetDate.getFullYear() - joinDate.getFullYear()) * 12 + (targetDate.getMonth() - joinDate.getMonth());
                let monthLeave = Math.min(monthDiff, 11);
                if (targetDate.getDate() < joinDate.getDate()) {
                    monthLeave = Math.max(0, monthLeave - 1);
                }

                totalAnnualLeave = monthLeave;
                detailText = `📌 <strong>1년 미만 근로자:</strong> 1개월 개근 시 1일씩 발생한 월차 총 <strong>${monthLeave}일</strong>이 산출되었습니다.`;
            } else {
                // 1년 이상: 1년 차에 15일 기본 + 1년 미만 월차(11일) + 가산 연차
                const firstYearMonthLeave = 11; // 1년 미만 시 발생한 월차
                let baseLeave = 15; // 기본 연차

                // 가산 연차 계산: 3년 이상부터 2년마다 1일씩 가산 (최대 25일 한도)
                let additionalLeave = 0;
                if (years >= 3) {
                    additionalLeave = Math.floor((years - 1) / 2);
                }

                const currentYearLeave = Math.min(25, baseLeave + additionalLeave);

                // 누적 생성 연차 (1년 미만 11일 + 연차별 생성분)
                let cumulativeLeave = firstYearMonthLeave;
                for (let y = 1; y <= years; y++) {
                    let add = 15 + (y >= 3 ? Math.floor((y - 1) / 2) : 0);
                    cumulativeLeave += Math.min(25, add);
                }

                totalAnnualLeave = currentYearLeave;
                detailText = `📌 <strong>${years}년 차 현재 주기 연차:</strong> 기본 15일 + 가산 연차 ${additionalLeave}일 = 총 <strong>${currentYearLeave}일</strong><br>
                            💡 (입사 이후 누적 총 발생 연차: <strong>${cumulativeLeave}일</strong> / 1년 미만 월차 11일 포함)`;
            }

            // 결과 화면 업데이트
            workingPeriod.textContent = `${years}년 ${months}개월 ${days}일`;
            totalLeave.textContent = `${totalAnnualLeave} 일`;
            leaveDetail.innerHTML = detailText;

            resultBox.classList.add('active');
        });
    }
});