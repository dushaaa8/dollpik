document.addEventListener("DOMContentLoaded", () => {
    const hiddenElements = document.querySelectorAll(".hidden, .hidden-left, .hidden-right")
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show")
                observer.unobserve(entry.target)
            }
        });
    }, { threshold: 0.2 })
    hiddenElements.forEach(el => observer.observe(el))

    const reviewWrapper = document.querySelector(".swiper-wrapper")
    const form = document.getElementById("review-form")

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault()

            const nameInput = document.getElementById("name")
            const messageInput = document.getElementById("message")

            const name = nameInput.value.trim();
            const text = messageInput.value.trim();

            if (!name || !text) {
                alert("Будь ласка, заповніть всі поля.")
                return;
            }

            try {
                const response = await fetch("/api/review", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ name, text })
                });

                const result = await response.json()

                if (response.ok) {
                    alert("Відгук збережено! Перейдіть на головну, щоб побачити.")
                    nameInput.value = "";
                    messageInput.value = "";
                } else {
                    alert("Помилка: " + result.message)
                }
            } catch (error) {
                console.error("Помилка при відправці відгуку:", error)
                alert("Щось пішло не так. Спробуйте пізніше.")
            }
        });
    }

    const myCart = document.querySelector(".cart-items")

    function parseJwt(token) {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return {};
        }
    }

    async function loadCart() {
        const token = localStorage.getItem("token")
        if (!token || !myCart) return;

        const userId = parseJwt(token).id

        try {
            const response = await fetch(`/api/cart/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const cart = await response.json()

            myCart.innerHTML = ""; // очищаем перед отрисовкой

            let total = 0;

            cart.forEach((cartItem, index) => {
                total += Number(cartItem.price)
                const newCartItem = document.createElement("li")
                newCartItem.classList.add("cart-item")
                newCartItem.innerHTML = `
                    <img src="${cartItem.image_url}" width="50" height="50" alt="item image ${index}">
                    <span>${cartItem.name}</span>
                    <span>Ціна: ${cartItem.price} грн</span>
                `;
                myCart.appendChild(newCartItem);
            });

            const totalElement = document.querySelector(".cart-section p strong")
            if (totalElement) {
                totalElement.textContent = `Загальна сума: ${total} грн`;
            }

        } catch (err) {
            console.error("Помилка при завантаженні кошика:", err)
        }
    }

    loadCart()

    const catalog = document.querySelector(".catalog-grid")

    if (catalog) {
        catalog.addEventListener("click", async (e) => {
            if (e.target.classList.contains("buy-item")) {
                const itemId = e.target.dataset.id;
                const token = localStorage.getItem("token");
                const userId = parseJwt(token).id;

                try {
                    const response = await fetch("/api/cart/add", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({ userId, itemId })
                    });

                    const result = await response.json()
                    if (response.ok) {
                        alert("Товар додано до кошика.")
                    } else {
                        alert("Помилка: " + result.message);
                    }
                } catch (error) {
                    console.error("Помилка при додаванні до кошика:", error)
                }
            }
        })

        fetch("/api/items")
            .then(res => res.json())
            .then(data => {
                data.forEach((catalogItem, index) => {
                    const newCatalogItem = document.createElement("div")
                    newCatalogItem.classList.add("catalog-item")
                    newCatalogItem.innerHTML = `
                        <img src="${catalogItem.image_url}" width="300" height="300" alt="item image ${index}">
                        <h3>${catalogItem.name}</h3>
                        <p>Ціна: ${catalogItem.price} грн</p>
                        <button type="submit" class="buy-item" data-id="${catalogItem.itemid}">Додати в кошик</button>`;
                    catalog.appendChild(newCatalogItem)
                })
            })
            .catch(err => console.error("Помилка при завантаженні каталогу:", err))
    }

    const createItemForm = document.getElementById("create-item-form")

    if (createItemForm) {
        createItemForm.addEventListener("submit", async (e) => {
            e.preventDefault()

            const itemNameInput = document.getElementById("item-name")
            const itemPriceInput = document.getElementById("item-price")
            const itemUrlInput = document.getElementById("item-url")

            const itemName = itemNameInput.value.trim();
            const itemPrice = itemPriceInput.value.trim();
            const itemUrl = itemUrlInput.value.trim();

            if (!itemName || !itemPrice || !itemUrl) {
                alert("Поля не повинні бути пустими.")
                return;
            }

            try {
                const response = await fetch("/api/items", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify({
                        name: itemName,
                        price: itemPrice,
                        image_url: itemUrl
                    })
                });

                const result = await response.json();

                if (response.ok) {
                    alert("Товар успішно додано в базу даних.");
                    itemNameInput.value = "";
                    itemPriceInput.value = "";
                    itemUrlInput.value = "";
                } else {
                    alert("Помилка: " + result.message);
                }
            } catch (error) {
                console.error("Помилка при відправці запиту:", error)
                alert("Не вдалося додати товар. Спробуйте пізніше.")
            }
        });
    }

    if (reviewWrapper) {

        const swiper = new Swiper(".swiper-container", {
            loop: true,
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            slidesPerView: 1,
            centeredSlides: true,
            effect: "slide",
            allowTouchMove: false,
        });

        fetch("/api/review")
            .then(res => res.json())
            .then(reviews => {
                reviews.forEach((review, index) => {
                    const slide = document.createElement("div");
                    slide.classList.add("swiper-slide")
                    slide.innerHTML = `
                <div class="review-card">
                    <q>${review.text}</q>
                    <h4>- ${review.name}</h4>
                    <button class="delete-review admin-only" data-id="${review.commentid}">✖</button>
                </div>
            `;
                    reviewWrapper.appendChild(slide)
                });

                swiper.update()
                applyPermissions()
            })
            .catch(err => console.error("Помилка при завантаженні відгуків:", err))

        document.addEventListener("click", async (e) => {
            if (e.target.classList.contains("delete-review")) {
                const reviewId = e.target.dataset.id

                if (!confirm("Ви впевнені, що хочете видалити цей відгук?")) return;

                try {
                    const response = await fetch(`/api/review/${reviewId}`, {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    });

                    const result = await response.json()

                    if (response.ok) {
                        const reviewCard = e.target.closest(".swiper-slide")
                        reviewCard.style.transition = "opacity 0.4s ease"
                        reviewCard.style.opacity = "0";

                        setTimeout(() => {
                            reviewCard.remove();
                            swiper.update();
                        }, 400);
                    } else {
                        alert("Помилка: " + result.message)
                    }
                } catch (err) {
                    console.error("Помилка при видаленні відгуку:", err)
                    alert("Не вдалося видалити відгук.")
                }
            }
        });

    }
});
