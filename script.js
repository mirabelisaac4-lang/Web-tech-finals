// ==========================
// LOGIN SYSTEM
// ==========================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        let role = "user";

        // simple admin check
        if (email === "admin@acity.com" && password === "admin123") {
            role = "admin";
        }

        const user = { email, role };

        localStorage.setItem("user", JSON.stringify(user));

        alert("Logged in as " + role);
        window.location.href = "index.html";
    });
}


// ==========================
// DISPLAY LOGGED-IN USER
// ==========================
const userData = JSON.parse(localStorage.getItem("user"));

if (userData) {
    const headerText = document.querySelector("header p");

    if (headerText) {
        headerText.innerHTML += " | Logged in as: " + userData.role;
    }
}


// ==========================
// LOGOUT FUNCTION
// ==========================
const logoutBtn = document.getElementById("logout");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("user");
        alert("Logged out");
        window.location.href = "Login.html";
    });
}


// ==========================
// SEARCH FUNCTION (Marketplace + Skills)
// ==========================
const searchInputs = document.querySelectorAll(".search");

searchInputs.forEach(input => {
    input.addEventListener("keyup", function () {
        const filter = input.value.toLowerCase();
        const cards = document.querySelectorAll(".card");

        cards.forEach(card => {
            const text = card.innerText.toLowerCase();

            if (text.includes(filter)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    });
});


// ==========================
// BUY / HIRE BUTTON FUNCTION
// ==========================
const buttons = document.querySelectorAll(".card button");

buttons.forEach(button => {
    button.addEventListener("click", function () {
        const item = this.parentElement.querySelector("h3").innerText;

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push(item);

        localStorage.setItem("cart", JSON.stringify(cart));

        alert(item + " added successfully!");
    });
});

// =========================
// CART SYSTEM
// =========================

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// update cart UI
function updateCartUI() {
    const cartCount = document.getElementById("cartCount");

    if (cartCount) {
        cartCount.innerText = cart.length;
    }
}

// calculate total
function calculateTotal() {
    return cart.reduce((sum, item) => sum + item.price, 0);
}

// add to cart
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("add-to-cart")) {

        const name = e.target.getAttribute("data-name");
        const price = parseFloat(e.target.getAttribute("data-price"));

        cart.push({ name, price });

        localStorage.setItem("cart", JSON.stringify(cart));

        updateCartUI();

        alert(name + " added to cart!");
    }
});

// initial load
updateCartUI();