document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const dropdownBtn = document.getElementById('dropdownBtn');
    const dropdown = document.querySelector('.dropdown');

    // 1. 모바일 햄버거 메뉴 토글 기능
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // 메뉴 토글 시 아이콘 변경 (☰ ↔ ✕)
            if (navLinks.classList.contains('active')) {
                menuToggle.textContent = '✕';
            } else {
                menuToggle.textContent = '☰';
                // 메인 메뉴 닫힐 때 서브 드롭다운도 같이 닫기
                if (dropdown) dropdown.classList.remove('open');
            }
        });
    }

    // 2. 모바일 전용 드롭다운 토글 클릭 이벤트
    if (dropdownBtn && dropdown) {
        dropdownBtn.addEventListener('click', (e) => {
            // 화면 너비가 모바일(768px 이하)일 때 클릭 이벤트 작동
            if (window.innerWidth <= 768) {
                e.preventDefault(); // 링크 이동 방지
                dropdown.classList.toggle('open');
            }
        });
    }

    // 3. 현재 활성화된 페이지 네비게이션 강조 표시 (active)
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll('.nav-links a');

    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href !== '#' && currentPath.includes(href) && href !== 'index.html') {
            link.classList.add('active');
            // 하위 메뉴가 선택되어 있다면 상위 드롭다운 버튼도 활성화 표시
            const parentDropdown = link.closest('.dropdown');
            if (parentDropdown) {
                const parentToggle = parentDropdown.querySelector('.dropdown-toggle');
                if (parentToggle) parentToggle.classList.add('active');
            }
        } else if ((currentPath.endsWith('/') || currentPath.endsWith('index.html')) && href === 'index.html') {
            link.classList.add('active');
        }
    });
});