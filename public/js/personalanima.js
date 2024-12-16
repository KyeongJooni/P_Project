document.addEventListener('DOMContentLoaded', function() {
    // URL에 따라 body에 data-page 속성 추가
    const currentPath = window.location.pathname;
    // personal로 시작하는 모든 경로에 대해 'personal' data-page 속성 설정
    if (currentPath.startsWith('/personal')) {
        document.body.setAttribute('data-page', 'personal');
    }
    if (document.querySelector('.rectangle-2')) {
        const categories = [
            {
                rectangle: document.querySelector('.rectangle-2'),
                text: document.querySelector('.text-wrapper'),
                keyword: '교통'
            },
            {
                rectangle: document.querySelector('.rectangle-3'),
                text: document.querySelector('.text-wrapper-2'),
                keyword: '주유'
            },
            {
                rectangle: document.querySelector('.rectangle-4'),
                text: document.querySelector('.text-wrapper-3'),
                keyword: '쇼핑'
            },
            {
                rectangle: document.querySelector('.rectangle-5'),
                text: document.querySelector('.text-wrapper-4'),
                keyword: '커피'
            },
            {
                rectangle: document.querySelector('.rectangle-6'),
                text: document.querySelector('.text-wrapper-5'),
                keyword: '통신'
            }
        ];

        // URL에서 현재 선택된 카테고리 확인
        const urlParams = new URLSearchParams(window.location.search);
        const currentKeyword = urlParams.get('keyword');

        function deactivateAll() {
            categories.forEach(category => {
                category.rectangle.classList.remove('active');
                category.text.classList.remove('active');
                category.rectangle.style.backgroundColor = '#fcdf7f';
                category.text.style.color = '#848484';
            });
        }

        function activateCategory(category) {
            deactivateAll();
            category.rectangle.classList.add('active');
            category.text.classList.add('active');
            category.rectangle.style.backgroundColor = '#f9c20b';
            category.text.style.color = '#0d0c0c';
        }

        // 페이지 로드 시 현재 선택된 카테고리 활성화
        if (currentKeyword) {
            const activeCategory = categories.find(cat => cat.keyword === currentKeyword);
            if (activeCategory) {
                activateCategory(activeCategory);
            }
        } else {
            // 기본값으로 교통 활성화
            activateCategory(categories[0]);
        }

        categories.forEach(category => {
            if (category.rectangle && category.text) {
                category.rectangle.addEventListener('click', function() {
                    activateCategory(category);
                    filterCards(category.keyword);
                });

                category.text.addEventListener('click', function() {
                    activateCategory(category);
                    filterCards(category.keyword);
                });
            }
        });
    }
});

function filterCards(keyword) {
    if (keyword) {
        window.location.href = `/personal/filter?keyword=${encodeURIComponent(keyword)}`;
    }
}