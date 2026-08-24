// js/px-to-rem.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. 탭 전환 로직
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

    // 2. PX ↔ REM 실시간 변환 로직
    const rootSizeInput = document.getElementById('rootSize');
    const pxInput = document.getElementById('pxInput');
    const remInput = document.getElementById('remInput');

    function convertPxToRem() {
        const rootSize = parseFloat(rootSizeInput.value) || 16;
        const pxVal = parseFloat(pxInput.value);

        if (isNaN(pxVal)) {
            remInput.value = '';
            return;
        }

        const remVal = pxVal / rootSize;
        remInput.value = Number.isInteger(remVal) ? remVal : remVal.toFixed(4);
    }

    function convertRemToPx() {
        const rootSize = parseFloat(rootSizeInput.value) || 16;
        const remVal = parseFloat(remInput.value);

        if (isNaN(remVal)) {
            pxInput.value = '';
            return;
        }

        const pxVal = remVal * rootSize;
        pxInput.value = Number.isInteger(pxVal) ? pxVal : pxVal.toFixed(2);
    }

    if (pxInput && remInput && rootSizeInput) {
        pxInput.addEventListener('input', convertPxToRem);
        remInput.addEventListener('input', convertRemToPx);
        rootSizeInput.addEventListener('input', () => {
            convertPxToRem();
        });
    }

    // 3. WebP 이미지 변환 로직
    const dropZone = document.getElementById('dropZone');
    const imageInput = document.getElementById('imageInput');
    const webpResultBox = document.getElementById('webpResultBox');
    const imagePreview = document.getElementById('imagePreview');
    const fileSizeInfo = document.getElementById('fileSizeInfo');
    const btnDownload = document.getElementById('btnDownload');

    let convertedBlobUrl = null;
    let originalFileName = 'image';

    if (dropZone && imageInput) {
        dropZone.addEventListener('click', () => imageInput.click());

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.style.background = '#e1effe';
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.style.background = '#f0f7ff';
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.style.background = '#f0f7ff';
            if (e.dataTransfer.files.length > 0) {
                processImage(e.dataTransfer.files[0]);
            }
        });

        imageInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                processImage(e.target.files[0]);
            }
        });
    }

    function processImage(file) {
        if (!file.type.startsWith('image/')) {
            alert('이미지 파일만 선택 가능합니다.');
            return;
        }

        originalFileName = file.name.substring(0, file.name.lastIndexOf('.')) || 'converted';
        const originalSize = (file.size / 1024).toFixed(1);

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                // Canvas를 사용해 WebP로 변환
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                canvas.toBlob((blob) => {
                    if (!blob) {
                        alert('WebP 변환 중 오류가 발생했습니다.');
                        return;
                    }

                    if (convertedBlobUrl) {
                        URL.revokeObjectURL(convertedBlobUrl);
                    }

                    convertedBlobUrl = URL.createObjectURL(blob);
                    const newSize = (blob.size / 1024).toFixed(1);

                    imagePreview.src = convertedBlobUrl;
                    fileSizeInfo.innerHTML = `원본 용량: <strong>${originalSize} KB</strong> ➔ WebP 변환 용량: <strong>${newSize} KB</strong>`;
                    webpResultBox.classList.add('active');
                }, 'image/webp', 0.85); // 85% 품질로 압축
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // 파일 다운로드 처리
    if (btnDownload) {
        btnDownload.addEventListener('click', () => {
            if (!convertedBlobUrl) return;

            const a = document.createElement('a');
            a.href = convertedBlobUrl;
            a.download = `${originalFileName}.webp`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    }
});