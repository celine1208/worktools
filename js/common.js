// js/common.js

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    // 1. 모바일 햄버거 메뉴 토글 기능
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // 메뉴 토글 시 아이콘 변경 (☰ ↔ ✕)
            if (navLinks.classList.contains('active')) {
                menuToggle.textContent = '✕';
            } else {
                menuToggle.textContent = '☰';
            }
        });
    }

    // 2. 현재 활성화된 페이지 네비게이션 강조 표시 (active)
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll('.nav-links a');

    links.forEach(link => {
        const href = link.getAttribute('href');
        if (currentPath.includes(href) && href !== 'index.html') {
            link.classList.add('active');
        } else if ((currentPath.endsWith('/') || currentPath.endsWith('index.html')) && href === 'index.html') {
            link.classList.add('active');
        }
    });
});