function openModal(id) {
    let htmlContent = ""; // Инициализируем переменную заранее

    if (id == 1) {
        htmlContent = `
            <div class='headermodal'><h1>Поддержка</h1></div>
            <div class='mainmodal'>
                <center>
                    <h4>Мы проконсультируем вас по работе приложения, оформлению заказа и любым возникшим вопросам.</h4>
                    <br>
                    <div id='authorization'><p>7772</p></div>
                </center>
            </div>`;
    } else if (id == 2) {
        htmlContent = "";
    } else if (id == 3) {
        htmlContent = `
            <div class='headermodal'><h1>О приложении</h1></div>
            <div class='mainmodal'>
                <center>
                    <div class='headermainmodel'>
                        <img src='img/icongo.png'>
                        <h4>Версия 4.1.7 (100417)<br>@ 2020 - 2021<br> Magnum E-commerce Kazakhstan</h4>
                    </div>
                    <br>
                    <div>
                        <h1>Насколько вам нравится наше приложение?</h1>
                        <div id="rating">
                            <img class="like" data-value="1" src="img/like.png" alt="like">
                            <img class="like" data-value="2" src="img/like.png" alt="like">
                            <img class="like" data-value="3" src="img/like.png" alt="like">
                            <img class="like" data-value="4" src="img/like.png" alt="like">
                            <img class="like" data-value="5" src="img/like.png" alt="like">
                        </div>
                        <div id="review-btn" style="display:none;">
                            <button id="submit-review">Оставить отзыв</button>
                        </div>
                    </div>
                </center>
            </div>`;
    }

    document.getElementById('modal-content').innerHTML = htmlContent; // Устанавливаем HTML-контент модального окна
    document.getElementById('modal').classList.remove('hide');
    document.getElementById('modal').classList.add('show'); // Показываем модальное окно

    if (id == 3) {
        setupRating();
    }
}

function closeModal() {
    document.getElementById('modal').classList.remove('show');
    document.getElementById('modal').classList.add('hide');
}

// Функция для установки функционала оценки
function setupRating() {
    const likes = document.querySelectorAll('.like');
    const reviewBtn = document.getElementById('review-btn');
    
    likes.forEach((like, index) => {
        like.addEventListener('click', () => {
            resetLikes(); // Сброс всех лайков на обычные изображения
            highlightLikes(index + 1); // Подсветка выбранных лайков активными изображениями
            reviewBtn.style.display = 'block'; // Показываем кнопку "оставить отзыв"
        });
    });
}

// Функция для сброса всех лайков на обычные изображения
function resetLikes() {
    const likes = document.querySelectorAll('.like');
    likes.forEach(like => {
        like.src = 'img/like.png'; // Возвращаем обычное изображение
    });
}

// Функция для подсветки выбранных лайков активными изображениями
function highlightLikes(rating) {
    const likes = document.querySelectorAll('.like');
    likes.forEach((like, index) => {
        if (index < rating) {
            like.src = 'img/like_active.png'; // Устанавливаем активное изображение
        }
    });
}