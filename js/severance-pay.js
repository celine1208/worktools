// js/severance-pay.js

document.addEventListener('DOMContentLoaded', () => {
    const severanceForm = document.getElementById('severanceForm');
    const joinDateInput = document.getElementById('joinDate');
    const retireDateInput = document.getElementById('retireDate');
    const monthlyBaseInput = document.getElementById('monthlyBase');
    const monthlyAllowInput = document.getElementById('monthlyAllow');
    const annualBonusInput = document.getElementById('annualBonus');
    const annualLeavePayInput = document.getElementById('annualLeavePay');

    const resultBox = document.getElementById('resultBox');
    const totalSeverance = document.getElementById('totalSeverance');
    const detailWorkingDays = document.getElementById('detailWorkingDays');
    const detail3MonthWage = document.getElementById('detail3MonthWage');
    const detailAvgWage = document.getElementById('detailAvgWage');

    // 기본 퇴사일자를 오늘로 설정
    const today = new Date().toISOString().split('T')[0];
    if (retireDateInput) {
        retireDateInput.value = today;
    }

    if (severanceForm) {
        severanceForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const joinDate = new Date(joinDateInput.value);
            const retireDate = new Date(retireDateInput.value);

            if (joinDate >= retireDate) {
                alert('퇴사일자는 입사일자보다 이후여야 합니다.');
                return;
            }

            // 1. 재직일수 계산
            const msPerDay = 1000 * 60 * 60 * 24;
            const workingDays = Math.round((retireDate - joinDate) / msPerDay);

            if (workingDays < 365) {
                alert(`총 재직일수가 ${workingDays}일입니다. 근로기준법상 계속 근로 기간이 1년(365일) 미만인 경우 퇴직금 지급 대상이 아닙니다.`);
            }

            // 입력값 파싱 (숫자 변환 및 기본값 처리)
            const monthlyBase = parseFloat(monthlyBaseInput.value) || 0;
            const monthlyAllow = parseFloat(monthlyAllowInput.value) || 0;
            const annualBonus = parseFloat(annualBonusInput.value) || 0;
            const annualLeavePay = parseFloat(annualLeavePayInput.value) || 0;

            // 2. 3개월간 총 임금 산정 (3개월 기본급+수당 + 상여금 3/12 + 연차수당 3/12)
            const threeMonthWage = (monthlyBase + monthlyAllow) * 3;
            const bonusAdd = annualBonus * (3 / 12);
            const leaveAdd = annualLeavePay * (3 / 12);
            const total3MonthPay = threeMonthWage + bonusAdd + leaveAdd;

            // 3. 평균 3개월 일수 (표준 92일 산정)
            const avg3MonthDays = 92;

            // 4. 1일 평균임금 계산
            const dailyAvgWage = total3MonthPay / avg3MonthDays;

            // 5. 예상 퇴직금 계산 = 1일 평균임금 * 30일 * (재직일수 / 365)
            const calculatedSeverance = dailyAvgWage * 30 * (workingDays / 365);
            const finalSeverance = Math.floor(calculatedSeverance); // 원 단위 절사

            // UI 출력 업데이트
            totalSeverance.textContent = `${finalSeverance.toLocaleString()} 원`;
            detailWorkingDays.textContent = `${workingDays.toLocaleString()} 일`;
            detail3MonthWage.textContent = `${Math.round(total3MonthPay).toLocaleString()} 원`;
            detailAvgWage.textContent = `${Math.round(dailyAvgWage).toLocaleString()} 원`;

            resultBox.classList.add('active');
        });
    }
});