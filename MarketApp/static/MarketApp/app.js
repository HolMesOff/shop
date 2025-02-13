let historyStack = [];

function loadPage(templateName, params = {}) {
    if (!urls[templateName]) {
        if (templateName == undefined){
            return;
        }
        console.error(`Шаблон "${templateName}" не найден в urls`);
        return;
    }

    const pageUrl = urls[templateName]; // Получаем URL из списка Django

    localStorage.setItem('lastPage', templateName);
    localStorage.setItem('lastParams', JSON.stringify(params));

    historyStack.push({
        template: templateName,
        params: params
    });

    fetch(`${pageUrl}?cache=${new Date().getTime()}`, {
        
    })
    .then(response => response.text())
    .then(html => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const newContent = tempDiv.querySelector('#dynamic-content');
        const currentContent = document.querySelector('#dynamic-content');

        currentContent.classList.add('fade');

        setTimeout(() => {
            currentContent.innerHTML = newContent.innerHTML;
            currentContent.classList.remove('fade');
            currentContent.classList.add('fade-in');

            updateEventListeners();
            updateFooterState(templateName);
            setupAddressEvent();

            if (templateName === 'template_index') {
                showLoading('Загрузка категорий...');
                loadCategories();
            } 
            else if (templateName === 'template_subcategories') {
                showLoading('Загрузка подкатегорий...');
                loadSubcategories();
            } 
            else if (templateName === 'template_products') {
                showLoading('Загрузка товаров...');
                loadProducts();
            } 
            else {
                hideLoading();
            }
        }, 500);

    })
    .catch(error => console.error('Ошибка загрузки:', error));
}

function showLoading(message) {
    document.getElementById('loading').innerHTML = message;
    document.getElementById('loading').style.display = 'block';
    document.getElementById('dynamic-content').style.display = 'none';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('dynamic-content').style.display = 'block';
}

// Функция возврата на предыдущую страницу
function goBack() {
    if (historyStack.length > 1) {
        // Удаляем текущую страницу из стека истории
        historyStack.pop();

        // Получаем предыдущую страницу и её параметры
        let previousPage = historyStack[historyStack.length - 1];

        // Загружаем предыдущую страницу с её параметрами
        loadPage(previousPage.page, previousPage.params);
    } else {
        // Если история пуста или мы на начальной странице, возвращаемся на индекс
        loadPage('template_index');
    }
}


function updateEventListeners() {
    document.querySelector('#backcatalog')?.addEventListener('click', () => loadPage('template_index'));

    if (document.querySelector('.promo-container')) {
        initializeSlider();
    } else {
    }
}

function updateFooterState(page) {
    const footerItems = document.querySelectorAll('.footer div');
    footerItems.forEach(item => {
        const img = item.querySelector('img');
        const h2 = item.querySelector('h2');

        // Удаляем класс "active" у всех элементов
        item.classList.remove('active');

        // Меняем изображение и цвет обратно на серый
        img.src = img.src.replace('red', 'grey'); // Меняем на серый
        h2.style.color = '#BDADB2'; // Меняем текст на серый

        // Если это активный элемент, меняем изображение и цвет на красный
        if (item.querySelector('h2').textContent.includes(pageToName(page))) {
            item.classList.add('active');
            img.src = img.src.replace('grey', 'red'); // Меняем на красный
            h2.style.color = '#FE0052'; // Меняем текст на красный
        }
    });
}


document.addEventListener("DOMContentLoaded", function() {
    // Определяем, на какой странице находимся
    const currentPage = window.location.pathname.split("/").pop();

    const savedPage = localStorage.getItem('lastPage') || loadPage('template_index');
    const savedParams = localStorage.getItem('lastParams');
    const params = savedParams ? JSON.parse(savedParams) : {};
    
    if (!(currentPage == savedPage || (currentPage == "" && savedPage == "template_index"))) {
        loadPage(savedPage, params);
    }else{

        if (currentPage === 'template_index' || currentPage === '') {
            loadCategories();
        } else if (currentPage === 'template_subcategories') {
            loadSubcategories();
        } else if (currentPage === 'template_products'){
            loadProducts();
        }
    updateFooterState(savedPage);
}});

function loadCategories() {
    fetch('https://shop-h3k5.onrender.com/api/categories') // Замените на реальный URL
        .then(response => response.json())
        .then(data => {
            const main2 = document.getElementById('main2');
            main2.innerHTML = ''; // Очистка контейнера

            if (Array.isArray(data)) {
                data.forEach(category => {
                    const categoryDiv = document.createElement('div');
                    categoryDiv.classList.add('greywindow');
                    categoryDiv.innerHTML = `
                        <h6>${category.name}</h6>
                        <img src="${category.photo_url}" alt="${category.name}">`
                    ;
                    // При клике сохраняем ID категории и загружаем подкатегории
                    categoryDiv.addEventListener('click', () => {
                        localStorage.setItem('selectedCategoryId', category.id);
                        localStorage.setItem('selectedCategoryName', category.name); // Сохраняем имя категории
                        loadPage('template_subcategories'); // Загружаем подкатегории поверх index
                    });
                    main2.appendChild(categoryDiv);
                });

                // Убираем индикатор загрузки и показываем контент
                document.getElementById('loading').style.display = 'none';
                document.getElementById('dynamic-content').style.display = 'block';
            } else {
                document.getElementById('loading').innerText = 'Категории не найдены';
            }
        })
        .catch(error => {
            console.error('Ошибка загрузки категорий:', error);
            document.getElementById('loading').innerText = 'Ошибка загрузки категорий';
        });
}



function loadSubcategories() {
    const categoryId = localStorage.getItem('selectedCategoryId');
    const categoryName = localStorage.getItem('selectedCategoryName');
    if (!categoryId) {
        console.error('Не выбрана категория');
        return;
    }

    fetch(`https://shop-h3k5.onrender.com/api/subcategories/${categoryId}`)
        .then(response => response.json())
        .then(data => {
            const main2_sub = document.getElementById('main2_sub');
            main2_sub.innerHTML = ''; // Очищаем перед добавлением

            // Создаём элемент subcategory-list динамически
            const subcategoryList = document.createElement('div');
            subcategoryList.id = 'subcategory-list';
            subcategoryList.style.display = 'none'; // Скрыто по умолчанию
            main2_sub.appendChild(subcategoryList);

            data.forEach(subcategory => {
                const subcategoryDiv = document.createElement('div');
                subcategoryDiv.classList.add('whitewindow');
                subcategoryDiv.innerHTML = `
                    <div class="img_cont">
                        <img src="${subcategory.photo_url}" alt="${subcategory.name}">
                    </div>
                    <h6>${subcategory.name}</h6>`
                ;
                subcategoryDiv.onclick = () => toggleSubcategory(subcategoryDiv, subcategory.id, subcategory.name);
                main2_sub.appendChild(subcategoryDiv);
            });

            // Убираем индикатор загрузки и показываем контент
            document.getElementById('loading').style.display = 'none';
            document.getElementById('dynamic-content').style.display = 'block';
        })
        .catch(error => {
            console.error('Ошибка загрузки подкатегорий:', error);
            document.getElementById('loading').innerText = 'Ошибка загрузки подкатегорий';
        });
}


function toggleSubcategory(element, subcategoryId, subcategoryName) {
    const subcategoryList = document.getElementById('subcategory-list');

    // Если элемент не существует, создаём его
    if (!subcategoryList) {
        console.error('Элемент с id="subcategory-list" не найден');
        return;
    }

    // Проверяем, открыт ли уже этот список
    if (subcategoryList.dataset.openFor === String(subcategoryId)) {
        subcategoryList.style.display = 'none';
        subcategoryList.dataset.openFor = '';
        document.querySelectorAll('.whitewindow').forEach(el => el.classList.remove('hide'));
        return;
    }

    // Скрываем остальные подкатегории
    document.querySelectorAll('.whitewindow').forEach(el => {
        if (el !== element) el.classList.add('hide');
    });

    // Показываем список
    subcategoryList.style.display = 'block';
    subcategoryList.dataset.openFor = subcategoryId;

    const rect = element.getBoundingClientRect();
    subcategoryList.style.top = `${rect.top + window.scrollY}px`;
    subcategoryList.style.left = `${rect.right + 20}px`;

    const content = document.getElementById('subcategory-list');
    content.innerHTML = ''; // Очищаем старые данные
            
    fetch(`https://shop-h3k5.onrender.com/api/subcategories/${subcategoryId}`)
        .then(response => response.json())
        .then(data => {

            if (Array.isArray(data) && data.length > 0) {
                data.forEach(subcategory => {
                    const categoryDiv = document.createElement('div');
                    categoryDiv.innerText = subcategory.name;
                    categoryDiv.onclick = () => {
                        localStorage.setItem('ProductCategoryId', subcategoryId);
                        localStorage.setItem('selectedProductCategoryId', subcategory.id);
                        localStorage.setItem('selectedProductCategoryName', subcategory.name); // Сохраняем имя категории
                        loadPage('template_products'); // Загружаем подкатегории поверх index
                    };
                    content.appendChild(categoryDiv);
                });
            } else {
                content.innerText = 'Категорий нет';
            }
        })
        .catch(error => {
            console.error('Ошибка загрузки категорий подкатегории:', error);
        });
}


function loadProducts() {
    const categorySubcategoryId = localStorage.getItem('ProductCategoryId');
    const subcategoryId = localStorage.getItem('selectedProductCategoryId');
    const subcategoryName = localStorage.getItem('selectedProductCategoryName');
    if (!subcategoryId) {
        console.error('Не выбрана категория');
        return;
    }

    fetch(`https://shop-h3k5.onrender.com/api/products/${subcategoryId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка загрузки данных с сервера');
            }
            return response.json();
        })
        .then(data => {
            const main2_sub = document.getElementById('main2_sub');
            main2_sub.innerHTML = ''; // Очищаем перед добавлением

            // Создаём контейнер для товаров
            const productList = document.createElement('div');
            productList.id = 'product-list';
            main2_sub.appendChild(productList);

            if (Array.isArray(data) && data.length > 0) {
                data.forEach(product => {
                    const productCard = document.createElement('div');
                    productCard.classList.add('product-card');
                    productCard.innerHTML = `
                        <div class="img-cont">
                            <img src="${product.photo_url}" alt="${product.name}">
                        </div>
                        <div class="product-info">
                            <h6>${product.name}</h6>
                            <p class="price">${product.unit === 'kg' ? product.quantity + 'кг/' : product.quantity + 'шт/'}${product.price} ₸</p>
                        </div>
                    `;

                    // Добавляем обработчик клика
                    productCard.onclick = () => {
                        showProductModal(product);
                    };

                    productList.appendChild(productCard);
                });
            } else {
                productList.innerText = 'Товары не найдены';
            }

            // Загружаем подкатегории для текущей категории
            loadSubcategoriesPanel(categorySubcategoryId);

            // Убираем индикатор загрузки и показываем контент
            document.getElementById('loading').style.display = 'none';
            document.getElementById('dynamic-content').style.display = 'block';
        })
        .catch(error => {
            console.error('Ошибка загрузки товаров:', error);
            document.getElementById('loading').innerText = 'Ошибка загрузки товаров';
        });
}

// Функция для отображения модального окна с информацией о товаре
function showProductModal(product) {
    const modal = document.getElementById("product-modal");

    // Устанавливаем данные
    document.getElementById("modal-product-image").src = product.photo_url;
    document.getElementById("modal-product-title").textContent = product.name;
    document.getElementById("modal-product-weight-price").textContent =
        `${product.unit === 'kg' ? product.quantity + ' кг/' : product.quantity + ' шт/'} ${product.price} ₸`;
    document.getElementById("modal-product-description").textContent = product.description;

    // Показываем модальное окно
    modal.style.display = "block";

    // Закрытие окна
    const closeModal = document.querySelector(".close2");
    closeModal.onclick = () => {
        modal.style.display = "none";
    };

    // Закрытие по клику вне окна
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
}



// Функция для загрузки панели с подкатегориями
let Index = 0; // Индекс текущей видимой категории

function loadSubcategoriesPanel(subcategoryId) {
    const subcategoryPanel = document.getElementById('subcategory-panel');
    subcategoryPanel.innerHTML = ''; // Очищаем текущие подкатегории

    fetch(`https://shop-h3k5.onrender.com/api/subcategories/${subcategoryId}`)
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                // Сохраняем все подкатегории
                const categories = data;

                // Отображаем только 3 категории
                displayCategories(categories);

                // Функция для отображения категорий
                function displayCategories(categories) {
                    // Создаём контейнер для категорий
                    subcategoryPanel.innerHTML = ''; // Очищаем перед добавлением

                    // Выбираем 3 категории начиная с текущего индекса
                    const categoriesToShow = categories.slice(Index, Index + 3);

                    categoriesToShow.forEach(subcategory => {
                        const categoryDiv = document.createElement('div');
                        categoryDiv.innerText = subcategory.name;

                        // Проверяем, является ли эта категория выбранной
                        if (subcategory.id == localStorage.getItem('selectedProductCategoryId')) {
                            categoryDiv.classList.add('selected');
                        }

                        categoryDiv.onclick = () => {
                            // Если категория уже выбрана, ничего не делаем
                            if (subcategory.id == localStorage.getItem('selectedProductCategoryId')) {
                                return;
                            }

                            // Снимаем класс 'selected' с предыдущей категории
                            document.querySelectorAll('.subcategory-panel div').forEach(div => div.classList.remove('selected'));

                            // Сохраняем новую выбранную категорию
                            localStorage.setItem('selectedProductCategoryId', subcategory.id);
                            localStorage.setItem('selectedProductCategoryName', subcategory.name);

                            // Добавляем класс 'selected' для новой категории
                            categoryDiv.classList.add('selected');

                            loadProducts(); // Перезагружаем товары для новой подкатегории
                        };

                        subcategoryPanel.appendChild(categoryDiv);
                    });
                }

                // Функция для прокрутки категорий
                window.scrollCategories = function(direction) {
                    if (direction === 'right' && Index < categories.length - 3) {
                        Index++;
                    } else if (direction === 'left' && Index > 0) {
                        Index--;
                    }

                    displayCategories(categories);
                };

            } else {
                subcategoryPanel.innerText = 'Подкатегории не найдены';
            }
        })
        .catch(error => {
            console.error('Ошибка загрузки подкатегорий:', error);
        });
}








function pageToName(page) {
    switch (page) {
        case 'template_index':
            return 'Каталог';
        case 'template_orders':
            return 'Мои заказы';
        case 'template_favorites':
            return 'Избранное';
        case 'template_profile':
            return 'Профиль';
        case 'template_money':
            return '120т';
        case 'template_subcategories':
            return 'Подкатегории'; 
        case 'template_products':
            return 'Товары';
        case 'template_register':
            return 'Регистрация';
        default:
            return '';
    }
}

function setupAddressEvent() {
    const addressDiv = document.getElementById('address');
    if (addressDiv) {
        addressDiv.addEventListener('click', openPopup);
    }
}

document.addEventListener('DOMContentLoaded', () => {

    
    
    document.querySelectorAll('.footer div').forEach((div) => {
        div.addEventListener('click', (e) => {
            const target = e.currentTarget;
            const targetId = target.querySelector('h2').textContent;

            switch (targetId) {
                case 'Каталог':
                    loadPage('template_index');
                    break;
                case 'Мои заказы':
                    loadPage('template_orders');
                    break;
                case 'Избранное':
                    loadPage('template_favorites');
                    break;
                case 'Профиль':
                    loadPage('template_profile');
                    break;
                case 'Корзина':
                    loadPage('template_money');
                    break;
                default:
                    break;
            }
        });
    });
    setupAddressEvent();
    updateEventListeners();
});
