document.addEventListener("DOMContentLoaded", () => {
    const hiddenElements = document.querySelectorAll(".hidden, .hidden-left, .hidden-right");
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    hiddenElements.forEach(el => observer.observe(el));

    const reviewWrapper = document.querySelector(".swiper-wrapper");
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

        // === ЗАГРУЗКА ОТЗЫВОВ ===
        const reviews = JSON.parse(localStorage.getItem("reviews") || "[]");
        reviews.forEach((review, index) => {
            const slide = document.createElement("div");
            slide.classList.add("swiper-slide");
            slide.innerHTML = `
                <div class="review-card">
                    <q>${review.text}</q>
                    <h4>- ${review.name}</h4>
                    <button class="delete-review" data-index="${index}">✖</button>
                </div>
            `;
            reviewWrapper.appendChild(slide);
        });

        document.addEventListener("click", (e) => {
            if (e.target.classList.contains("delete-review")) {
                const index = parseInt(e.target.dataset.index);
                let reviews = JSON.parse(localStorage.getItem("reviews") || "[]");

                reviews.splice(index, 1);
                localStorage.setItem("reviews", JSON.stringify(reviews));

                const reviewCard = e.target.closest(".swiper-slide");
                reviewCard.style.transition = "opacity 0.4s ease";
                reviewCard.style.opacity = "0";

                setTimeout(() => {
                    reviewCard.remove();
                    swiper.update();
                }, 400);
            }
        });
    }
    const catalogGrid = document.querySelector(".catalog-grid");
    if (catalogGrid) {
        catalogGrid.addEventListener("click", (e) => {
            if (e.target.classList.contains("buy-item")) {
                const index = parseInt(e.target.dataset.index);
                const catalogItems = JSON.parse(localStorage.getItem("catalogItems") || "[]");

                const selectedItem = catalogItems[index];
                if (!selectedItem) return;

                const cart = JSON.parse(localStorage.getItem("cart") || "[]");
                cart.push(selectedItem);
                localStorage.setItem("cart", JSON.stringify(cart));

                alert("Товар додано в кошик!");
            }
        });
    }


    const form = document.getElementById("review-form");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const nameInput = document.getElementById("name");
            const messageInput = document.getElementById("message");

            const name = nameInput.value.trim();
            const text = messageInput.value.trim();

            if (!name || !text) {
                alert("Будь ласка, заповніть всі поля.");
                return;
            }

            const newReview = { name, text };
            const reviews = JSON.parse(localStorage.getItem("reviews") || "[]");

            reviews.push(newReview);
            localStorage.setItem("reviews", JSON.stringify(reviews));

            nameInput.value = "";
            messageInput.value = "";

            alert("Відгук збережено! Перейдіть на головну, щоб побачити.");
        });
    }

    const catalogItems = JSON.parse(localStorage.getItem("catalogItems") || "[]")
    const catalog = document.querySelector(".catalog-grid")
    if(catalog){
        catalogItems.forEach((catalogItem, index) =>{

            const newCatalogItem = document.createElement("div")

            newCatalogItem.classList.add("catalog-item")
            newCatalogItem.innerHTML = `
        <img src="${catalogItem.itemUrl}" alt="item image ${index}">
        <h3>${catalogItem.itemName}</h3>
        <p>Ціна: ${catalogItem.itemPrice} грн</p>
        <button type="submit" class="buy-item" data-index="${index}">Додати в кошик</button>`;

            catalog.appendChild(newCatalogItem)
        })
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const myCart = document.querySelector(".cart-items");
    if (myCart) {
        cart.forEach((cartItem, index) => {
            const newCartItem = document.createElement("li");
            newCartItem.classList.add("cart-item");
            newCartItem.innerHTML = `
            <img src="${cartItem.itemUrl}" width="50" height="50" alt="item image ${index}">
            <span>${cartItem.itemName}</span>
            <span>Ціна: ${cartItem.itemPrice} грн</span>
        `;
            myCart.appendChild(newCartItem);
        });


        const total = cart.reduce((sum, item) => sum + Number(item.itemPrice), 0);
        const totalElement = document.querySelector(".cart-section p strong");
        if (totalElement) {
            totalElement.textContent = `Загальна сума: ${total} грн`;
        }
    }

    const createItemForm = document.getElementById("create-item-form")
    if(createItemForm){
        createItemForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const itemNameInput = document.getElementById("item-name")
            const itemPriceInput = document.getElementById("item-price")
            const itemUrlInput = document.getElementById("item-url")

            const itemName = itemNameInput.value.trim();
            const itemPrice = itemPriceInput.value.trim();
            const itemUrl = itemUrlInput.value.trim();

            if(!itemName || !itemPrice || !itemUrl){
                alert("Поля не повинні бути пустими.")
                return;
            }

            const newIntem = {itemName,itemPrice,itemUrl}
            const catalogItems = JSON.parse(localStorage.getItem("catalogItems") || "[]")

            catalogItems.push(newIntem)
            localStorage.setItem("catalogItems", JSON.stringify(catalogItems))

            itemName.value=""
            itemPrice.value=""
            itemUrl.value=""

            alert("Айтем додано в каталог.")
        });
    }




});
