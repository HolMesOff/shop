document.addEventListener("DOMContentLoaded", () => {

    // Проверка почты
    let userEmail = ''; // Глобальная переменная для почты

    // Проверка почты
    window.checkEmail = async function () {
        const headerRegister = document.querySelector(".header_register h2");
        const authForm = document.getElementById("authForm");
        const emailInput = document.getElementById("email");
        const email = emailInput.value.trim();

        if (!email) {
            alert("Введите почту!");
            return;
        }

        try {
            const response = await fetch("https://shop-h3k5.onrender.com/api/check-email/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                const result = await response.json();

                if (result.message === "User exists") {
                    // Сохраняем почту для использования в процессе входа
                    userEmail = email;

                    // Если пользователь существует, показываем форму входа
                    headerRegister.textContent = "Вход";
                    authForm.innerHTML = `
                        <label for="password">Введите пароль:</label>
                        <input type="password" id="password" name="password" required>
                        <button type="button" onclick="login()">Войти</button>
                        <button type="button" onclick="resetToEmail()">Назад</button>
                    `;
                } else {
                    // Если пользователя нет, показываем форму регистрации
                    headerRegister.textContent = "Регистрация";
                    authForm.innerHTML = `
                        <label for="email">Введите почту:</label>
                        <input type="email" id="email" name="email" value="${email}" required>
                        <label for="password">Введите пароль:</label>
                        <input type="password" id="password" name="password" required>
                        <label for="birth_date">Введите дату рождения:</label>
                        <input type="date" id="birth_date" name="birth_date" required>
                        <button type="button" onclick="register()">Зарегистрироваться</button>
                        <button type="button" onclick="resetToEmail()">Назад</button>
                    `;
                }
            } else {
                console.log(response)
                alert("Ошибка при проверке почты!");
            }
        } catch (error) {
            console.error("Ошибка:", error);
            alert("Не удалось подключиться к серверу.");
        }
    };

    // Логика входа
    window.login = async function () {
        const headerRegister = document.querySelector(".header_register h2");
        const authForm = document.getElementById("authForm");
        const password = document.getElementById("password").value.trim();

        // Используем почту из глобальной переменной
        if (!userEmail || !password) {
            alert("Введите все данные!");
            return;
        }

        try {
            const response = await fetch("https://shop-h3k5.onrender.com/api/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: userEmail, password }),
            });

            if (response.ok) {
                loadPage("template_index");
                alert("Вы успешно вошли!");
            } else {
                alert("Неверный логин или пароль.");
            }
        } catch (error) {
            console.error("Ошибка:", error);
            alert("Не удалось подключиться к серверу.");
        }
    };

    // Логика регистрации
    window.register = async function () {
        const headerRegister = document.querySelector(".header_register h2");
        const authForm = document.getElementById("authForm");
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const birthDate = document.getElementById("birth_date").value.trim();

        if (!email || !password || !birthDate) {
            alert("Введите все данные!");
            return;
        }

        try {
            const response = await fetch("https://shop-h3k5.onrender.com/api/register/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password, birth_date: birthDate }),
            });

            if (response.ok) {
                alert("Вы успешно зарегистрировались!");
                resetToEmail();
            } else {
                alert("Ошибка при регистрации.");
            }
        } catch (error) {
            console.error("Ошибка:", error);
            alert("Не удалось подключиться к серверу.");
        }
    };

    // Сброс к вводу почты
    window.resetToEmail = function () {
        const headerRegister = document.querySelector(".header_register h2");
        const authForm = document.getElementById("authForm");
        headerRegister.textContent = "Войти / Зарегистрироваться";
        authForm.innerHTML = `
            <div id="emailField">
                <label for="email">Введите почту:</label>
                <input type="email" id="email" name="email" required>
                <button type="button" id="checkEmailButton" onclick="checkEmail()">Проверить</button>
            </div>
        `;
    };
});
