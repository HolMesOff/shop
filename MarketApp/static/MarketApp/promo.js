

let promoContainer = document.querySelector('.promo-container');
let promo = document.getElementById('promo');
let leftButton = document.querySelector('.promo-button.left');
let rightButton = document.querySelector('.promo-button.right');

function createImageElements(sources) {
    return sources.map(src => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Акция';
        img.classList.add('promo-image');
        return img;
    });
}

function createImageElement(source) {
    const img = document.createElement('img');
    img.src = source;
    img.alt = 'Акция';
    img.classList.add('promo-image');
    return img;
}

let currentIndex = 0;
let isTransitioning = false;
let autoSlideInterval;
let isAutoSlideActive = false; // Флаг состояния интервала

function initializeSlider() {
    promo = document.getElementById('promo');
    promoContainer = document.querySelector('.promo-container');

    if (!promo || !promoContainer) {
        return;
    }


    promo.innerHTML = '';

    const images = createImageElements(imageSources);
    const duplicatedImages = createImageElements(imageSources);
    const lastImage = createImageElement(imageSources[imageSources.length - 1]);
    const allImages = [lastImage, ...images, ...duplicatedImages];

    allImages.forEach(img => promo.appendChild(img));

    promo.style.width = `${600 * allImages.length}%`;

    currentIndex = 0;
    clearInterval(autoSlideInterval);
    startAutoSlide(); // Стартуем авто-слайд

    leftButton = document.querySelector('.promo-button.left');
    rightButton = document.querySelector('.promo-button.right');

    if (leftButton && rightButton) {
        leftButton.addEventListener('click', () => {
            clearInterval(autoSlideInterval);
            isAutoSlideActive = false; // Слайд не активен
            previousSlide();
        });

        rightButton.addEventListener('click', () => {
            clearInterval(autoSlideInterval);
            isAutoSlideActive = false; // Слайд не активен
            nextSlide();
        });
    }

    promoContainer.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
        isAutoSlideActive = false; // Останавливаем авто-слайд
    });

    promoContainer.addEventListener('mouseleave', () => {
        startAutoSlide(); // Возобновляем авто-слайд
    });
}

function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 2000);
    isAutoSlideActive = true; // Интервал запущен
}

function updateSlide() {
    const imageWidth = 600 / (imageSources.length * 2);
    promo.style.transform = `translateX(-${currentIndex * imageWidth}%)`;
}

function nextSlide() {
    if (isTransitioning) return;
    isTransitioning = true;

    if (currentIndex >= imageSources.length) {
        setTimeout(() => {
            promo.style.transition = 'none';
            currentIndex = 0;
            updateSlide();
            setTimeout(() => {
                promo.style.transition = 'transform 0.5s ease-in-out';
                currentIndex = 1;
                updateSlide();
                isTransitioning = false;
            }, 50);
        }, 0);
    } else {
        currentIndex++;
        updateSlide();
        setTimeout(() => {
            isTransitioning = false;
        }, 0);
    }
}

function previousSlide() {
    if (isTransitioning) return;
    isTransitioning = true;

    if (currentIndex <= 0) {
        setTimeout(() => {
            promo.style.transition = 'none';
            currentIndex = imageSources.length;
            updateSlide();
            setTimeout(() => {
                promo.style.transition = 'transform 0.5s ease-in-out';
                currentIndex = imageSources.length - 1;
                updateSlide();
                isTransitioning = false;
            }, 50);
        }, 0);
    } else {
        currentIndex--;
        updateSlide();
        setTimeout(() => {
            isTransitioning = false;
        }, 0);
    }
}