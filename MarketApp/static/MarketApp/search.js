
let currentQuery = ''; // Последний запрос
let isRequestInProgress = false; // Флаг, что запрос в процессе

async function searchItems() {
    const searchInput = document.querySelector('.search-input');
    const query = searchInput.value.trim();
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = ''; // Очистить предыдущие результаты

    // Проверяем, если строка поиска пуста, отменяем выполнение
    if (query.length === 0) {
        alert("Строка поиска пуста!");
        return;
    }

    // Если запрос идентичен последнему выполненному, ничего не делаем
    if (query === currentQuery) {
        console.log("Повторный запрос игнорируется:", query);
        return;
    }

    // Если запрос уже выполняется, ничего не делаем
    if (isRequestInProgress) {
        console.log("Предыдущий запрос ещё выполняется:", query);
        return;
    }

    // Сохраняем текущий запрос
    currentQuery = query;

    try {
        isRequestInProgress = true; // Устанавливаем флаг, что запрос начался

        // Выполняем запрос
        const response = await fetch(
            `https://shop-h3k5.onrender.com/api/products/search/?query=${encodeURIComponent(query)}`
        );
        const products = await response.json();

        // Проверяем успешность ответа
        if (response.ok) {
            // Обновляем результаты
            products.forEach((product) => {
                const resultDiv = document.createElement('div');
                resultDiv.classList.add('product-result');

                // Создаем ссылку на товар
                const productLink = document.createElement('a');
                productLink.href = '#';
                productLink.textContent = product.name;

                // Добавляем обработчик на клик
                productLink.onclick = (event) => {
                    event.preventDefault();
                    loadProductDetails(product.id);
                };

                resultDiv.appendChild(productLink);
                resultsContainer.appendChild(resultDiv);
            });
        } else {
            resultsContainer.textContent = 'Товары не найдены.';
        }
    } catch (error) {
        console.error("Ошибка при выполнении запроса:", error);
        resultsContainer.textContent = 'Произошла ошибка при поиске товаров.';
    } finally {
        isRequestInProgress = false; // Сбрасываем флаг после завершения запроса
    }
}
