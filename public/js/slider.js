document.addEventListener('DOMContentLoaded', () => {
    let currentIndex = 0; // 현재 슬라이드 인덱스
    const slideContainer = document.querySelector('.frame-2'); // 슬라이드 컨테이너
    const slides = document.querySelectorAll('.frame-2 .group'); // 슬라이드 항목들
    const rectangles = document.querySelectorAll('.rectangle-18, .rectangle-19, .rectangle-20, .rectangle-21'); // Rectangle들
    const slideWidth = slides[0].offsetWidth; // 슬라이드 하나의 너비
    const totalSlides = slides.length; // 전체 슬라이드 개수

    // Rectangle 간격 설정
    const compactSpacing = 21; // 비활성화된 Rectangle 간의 간격
    const activeWidth = 100; // 활성화된 Rectangle 너비
    const inactiveWidth = 21; // 비활성화된 Rectangle 너비
    const initialLeft = 404; // 첫 번째 Rectangle의 시작 위치

    // 슬라이드 및 Rectangle 업데이트 함수
    function updateSlider() {
        // 슬라이드 이동
        slideContainer.style.transform = `translateX(-${currentIndex * slideWidth}px)`; // 슬라이드 이동

        // Rectangle 위치 및 스타일 업데이트
        let currentLeft = initialLeft; // Rectangle 위치 초기화
        rectangles.forEach((rect, index) => {
            if (index === currentIndex) {
                rect.style.backgroundColor = '#0b0b0b'; // 활성화된 색상
                rect.style.width = `${activeWidth}px`; // 활성화된 너비
                rect.style.left = `${currentLeft}px`; // 활성화된 Rectangle 위치
                currentLeft += activeWidth + compactSpacing; // 활성화된 Rectangle 이후 간격 추가
            } else {
                rect.style.backgroundColor = '#ababab'; // 비활성화된 색상
                rect.style.width = `${inactiveWidth}px`; // 비활성화된 너비
                rect.style.left = `${currentLeft}px`; // 비활성화된 Rectangle 위치
                currentLeft += inactiveWidth + compactSpacing; // 간격 추가
            }
        });
    }

    // 이전 슬라이드로 이동
    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides; // 순환 이동
        updateSlider();
    }

    // 다음 슬라이드로 이동
    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides; // 순환 이동
        updateSlider();
    }

    // 초기 슬라이더 상태 설정
    slideContainer.style.transition = 'transform 0.5s ease-in-out'; // 부드러운 이동 애니메이션
    updateSlider();

    // 버튼 이벤트 연결
    document.querySelector('.polygon-2').addEventListener('click', prevSlide); // 왼쪽 버튼
    document.querySelector('.polygon').addEventListener('click', nextSlide); // 오른쪽 버튼
});
