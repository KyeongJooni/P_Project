document.addEventListener('DOMContentLoaded', function() {
    // URL에 따라 body에 data-page 속성 추가
    const currentPath = window.location.pathname;
    if (currentPath === '/gov' || currentPath === '/search_gov') {
        document.body.setAttribute('data-page', 'gov');
    } else if (currentPath === '/gov_check') {
        document.body.setAttribute('data-page', 'gov_check');
    }
  
    // 카테고리 관련 요소들이 있는 경우에만 실행
    if (document.querySelector('.rectangle-2')) {  // 카테고리 요소 존재 여부 확인
        const categories = [
            {
                rectangle: document.querySelector('.rectangle-2'),
                text: document.querySelector('.text-wrapper')
            },
            {
                rectangle: document.querySelector('.rectangle-3'),
                text: document.querySelector('.text-wrapper-2')
            },
            {
                rectangle: document.querySelector('.rectangle-4'),
                text: document.querySelector('.text-wrapper-3')
            },
            {
                rectangle: document.querySelector('.rectangle-5'),
                text: document.querySelector('.text-wrapper-4')
            },
            {
                rectangle: document.querySelector('.rectangle-6'),
                text: document.querySelector('.text-wrapper-5')
            }
        ];
  
        // 카테고리 비활성화 함수
        function deactivateAll() {
            categories.forEach(category => {
                category.rectangle.classList.remove('active');
                category.text.classList.remove('active');
                category.rectangle.style.backgroundColor = '#fcdf7f';
                category.text.style.color = '#848484';
            });
        }
  
        // 카테고리 클릭 이벤트
        categories.forEach(category => {
            if (category.rectangle && category.text) {  // null 체크 추가
                category.rectangle.addEventListener('click', function() {
                    deactivateAll();
                    category.rectangle.classList.add('active');
                    category.text.classList.add('active');
                    category.rectangle.style.backgroundColor = '#f9c20b';
                    category.text.style.color = '#0d0c0c';
                });
  
                category.text.addEventListener('click', function() {
                    deactivateAll();
                    category.rectangle.classList.add('active');
                    category.text.classList.add('active');
                    category.rectangle.style.backgroundColor = '#f9c20b';
                    category.text.style.color = '#0d0c0c';
                });
            }
        });
    }
  
    // 신용카드/체크카드 탭 관련 코드
    const wrapper6 = document.querySelector('.gov-text-wrapper-6');
    const wrapper62 = document.querySelector('.gov-text-wrapper-6-1');
    const wrapper8 = document.querySelector('.gov-text-wrapper-7');
    const wrapper71 = document.querySelector('.gov-text-wrapper-7-1');
  
    if (wrapper8) {
        wrapper7.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/gov_check';
        });
    }
  
    if (wrapper62) {
        wrapper61.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/gov';
        });
    }
  });