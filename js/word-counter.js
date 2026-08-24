// js/word-counter.js

document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('textInput');
    const charWithSpace = document.getElementById('charWithSpace');
    const charNoSpace = document.getElementById('charNoSpace');
    const byteCount = document.getElementById('byteCount');
    const wordCount = document.getElementById('wordCount');
    const manuscriptCount = document.getElementById('manuscriptCount');

    const btnCopy = document.getElementById('btnCopy');
    const btnClear = document.getElementById('btnClear');

    // 1. 실시간 글자수 / Byte / 단어 수 계산 함수
    function updateCounts() {
        const text = textInput.value;

        // 공백 포함 글자수
        const withSpaceLength = text.length;

        // 공백 제외 글자수 (공백, 탭, 줄바꿈 제거)
        const noSpaceLength = text.replace(/\s/g, '').length;

        // Byte 계산 (한글/전각문자 2Byte, 영문/숫자/공백 1Byte 기준)
        let totalBytes = 0;
        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i);
            // 한글, 한자 및 기타 다국어 범위 체크
            if (charCode > 127) {
                totalBytes += 2;
            } else {
                totalBytes += 1;
            }
        }

        // 단어 수 계산 (공백 기반 분할)
        const trimmedText = text.trim();
        const words = trimmedText ? trimmedText.split(/\s+/).length : 0;

        // 200자 원고지 매수 (올림 처리)
        const manuscripts = Math.ceil(withSpaceLength / 200);

        // UI 업데이트
        charWithSpace.textContent = `${withSpaceLength.toLocaleString()} 자`;
        charNoSpace.textContent = `${noSpaceLength.toLocaleString()} 자`;
        byteCount.textContent = `${totalBytes.toLocaleString()} Byte`;
        wordCount.textContent = `${words.toLocaleString()} 개`;
        manuscriptCount.textContent = `${manuscripts.toLocaleString()} 장`;
    }

    // 2. 입력 이벤트 연결 (실시간 반영)
    if (textInput) {
        textInput.addEventListener('input', updateCounts);
    }

    // 3. 전체 복사 버튼 기능
    if (btnCopy) {
        btnCopy.addEventListener('click', () => {
            if (!textInput.value) {
                alert('복사할 텍스트가 없습니다.');
                return;
            }
            navigator.clipboard.writeText(textInput.value).then(() => {
                alert('텍스트가 클립보드에 복사되었습니다.');
            }).catch(() => {
                // 대체 구형 방식
                textInput.select();
                document.execCommand('copy');
                alert('텍스트가 복사되었습니다.');
            });
        });
    }

    // 4. 초기화 버튼 기능
    if (btnClear) {
        btnClear.addEventListener('click', () => {
            if (textInput.value && confirm('입력한 내용을 모두 지우시겠습니까?')) {
                textInput.value = '';
                updateCounts();
            }
        });
    }
});