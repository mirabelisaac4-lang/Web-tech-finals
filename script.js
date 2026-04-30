const ACITY_DOMAIN = "@acity.edu.gh";
const ADMIN_EMAIL = "admin@acity.edu.gh";
const ADMIN_PASSWORD = "admin123";

const starterListings = [
    {
        id: "item-laptop",
        title: "Laptop",
        description: "Affordable and reliable for student assignments, research, and coding.",
        category: "Item",
        status: "Available",
        owner: "marvin@acity.edu.gh",
        approved: true,
        image: "images/goran-ivos-wJpl8D38Tq8-unsplash (1).jpg"
    },
    {
        id: "item-textbooks",
        title: "Textbooks",
        description: "Essential course books at a student-friendly price.",
        category: "Item",
        status: "Available",
        owner: "ama@acity.edu.gh",
        approved: true,
        image: "images/bruno-guerrero-jxKakgpKRWE-unsplash.jpg"
    },
    {
        id: "skill-programming",
        title: "Programming Tutor",
        description: "Learn HTML, JavaScript, Java, and web development basics.",
        category: "Skill",
        status: "Available",
        owner: "kojo@acity.edu.gh",
        approved: true,
        image: "images/mohammad-rahmani-8qEB0fTe9Vw-unsplash.jpg"
    },
    {
        id: "skill-design",
        title: "Graphic Design",
        description: "Logos, posters, flyers, and social media graphics.",
        category: "Skill",
        status: "Available",
        owner: "nana@acity.edu.gh",
        approved: true,
        image: "images/mona-miller-JAjD4uokc6k-unsplash.jpg"
    }
];

function getData(key, fallback) {
    return JSON.parse(localStorage.getItem(key)) || fallback;
}

function saveData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
}

function seedData() {
    if (!localStorage.getItem("users")) {
        saveData("users", [
            {
                name: "Admin User",
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD,
                role: "admin",
                phone: "0240000000",
                skillsOffered: "Listing moderation, platform support",
                skillsNeeded: "Campus reports"
            },
            {
                name: "Test Student",
                email: "testuser@acity.edu.gh",
                password: "password123",
                role: "user",
                phone: "0241234567",
                skillsOffered: "Graphic design, tutoring",
                skillsNeeded: "Textbooks, electronics repair"
            }
        ]);
    }

    if (!localStorage.getItem("listings")) {
        saveData("listings", starterListings);
    }

    if (!localStorage.getItem("interactions")) {
        saveData("interactions", []);
    }
}

function updateNavigation() {
    const user = getCurrentUser();
    const userStatus = document.getElementById("userStatus");
    const logoutBtn = document.getElementById("logout");
    const cartCount = document.getElementById("cartCount");

    if (userStatus) {
        userStatus.textContent = user ? `Logged in as: ${user.email} (${user.role})` : "Not logged in";
    }

    if (logoutBtn) {
        logoutBtn.style.display = user ? "inline-block" : "none";
        logoutBtn.addEventListener("click", function (e) {
            e.preventDefault();
            localStorage.removeItem("user");
            alert("Logged out successfully.");
            window.location.href = "login.html";
        });
    }

    if (cartCount) {
        cartCount.textContent = getData("interactions", []).length;
    }
}

function requireLogin() {
    if (!getCurrentUser()) {
        alert("Please login first.");
        window.location.href = "login.html";
        return false;
    }
    return true;
}

function createListingCard(listing, showAdminActions = false) {
    const card = document.createElement("div");
    card.className = "card listing-card";
    card.dataset.category = listing.category;
    card.dataset.status = listing.status;

    card.innerHTML = `
        ${listing.image ? `<img src="${listing.image}" alt="${listing.title}">` : ""}
        <h3>${listing.title}</h3>
        <p>${listing.description}</p>
        <p><strong>Category:</strong> ${listing.category}</p>
        <p><strong>Status:</strong> ${listing.status}</p>
        ${listing.flagged ? "<p><strong>Flagged:</strong> Needs review</p>" : ""}
        <p><strong>Posted by:</strong> ${listing.owner}</p>
        <button class="interest-btn" data-id="${listing.id}">Interested</button>
    `;

    if (showAdminActions) {
        const actions = document.createElement("div");
        actions.className = "admin-actions";
        actions.innerHTML = `
            <button class="approve-btn" data-id="${listing.id}">Approve</button>
            <button class="edit-btn" data-id="${listing.id}">Edit</button>
            <button class="flag-btn" data-id="${listing.id}">Flag</button>
            <button class="sold-btn" data-id="${listing.id}">Mark Sold/Swapped</button>
            <button class="delete-btn danger" data-id="${listing.id}">Delete</button>
        `;
        card.appendChild(actions);
    }

    return card;
}

function renderListings() {
    const container = document.getElementById("listingFeed");
    if (!container) return;

    const search = document.getElementById("listingSearch")?.value.toLowerCase() || "";
    const category = document.getElementById("categoryFilter")?.value || "All";
    const status = document.getElementById("statusFilter")?.value || "All";
    const pageCategory = container.dataset.category;
    const user = getCurrentUser();

    const listings = getData("listings", []).filter(listing => {
        const matchesPage = !pageCategory || listing.category === pageCategory;
        const matchesSearch = `${listing.title} ${listing.description} ${listing.owner}`.toLowerCase().includes(search);
        const matchesCategory = category === "All" || listing.category === category;
        const matchesStatus = status === "All" || listing.status === status;
        const visible = listing.approved || user?.role === "admin" || listing.owner === user?.email;
        return matchesPage && matchesSearch && matchesCategory && matchesStatus && visible;
    });

    container.innerHTML = "";

    if (listings.length === 0) {
        container.innerHTML = "<p>No listings found.</p>";
        return;
    }

    listings.forEach(listing => {
        container.appendChild(createListingCard(listing, user?.role === "admin"));
    });
}

function renderProfile() {
    const profileForm = document.getElementById("profileForm");
    if (!profileForm || !requireLogin()) return;

    const user = getCurrentUser();
    const users = getData("users", []);
    const profile = users.find(account => account.email === user.email) || user;

    document.getElementById("profileName").value = profile.name || "";
    document.getElementById("profileEmail").value = profile.email || "";
    document.getElementById("profilePhone").value = profile.phone || "";
    document.getElementById("skillsOffered").value = profile.skillsOffered || "";
    document.getElementById("skillsNeeded").value = profile.skillsNeeded || "";

    profileForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const updatedProfile = {
            ...profile,
            name: document.getElementById("profileName").value.trim(),
            phone: document.getElementById("profilePhone").value.trim(),
            skillsOffered: document.getElementById("skillsOffered").value.trim(),
            skillsNeeded: document.getElementById("skillsNeeded").value.trim()
        };

        const updatedUsers = users.map(account => account.email === user.email ? updatedProfile : account);
        saveData("users", updatedUsers);
        saveData("user", { email: updatedProfile.email, role: updatedProfile.role, name: updatedProfile.name });
        alert("Profile updated successfully.");
        updateNavigation();
    });
}

function renderInteractions() {
    const container = document.getElementById("interactionList");
    if (!container) return;

    const user = getCurrentUser();
    const interactions = getData("interactions", []);
    const listings = getData("listings", []);
    const visibleInteractions = user?.role === "admin"
        ? interactions
        : interactions.filter(item => item.buyer === user?.email || item.owner === user?.email);

    container.innerHTML = "";

    if (visibleInteractions.length === 0) {
        container.innerHTML = "<p>No trade requests yet.</p>";
        return;
    }

    visibleInteractions.forEach(item => {
        const listing = listings.find(entry => entry.id === item.listingId);
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <h3>${listing?.title || "Listing removed"}</h3>
            <p><strong>Interested student:</strong> ${item.buyer}</p>
            <p><strong>Owner:</strong> ${item.owner}</p>
            <p><strong>Status:</strong> ${item.status}</p>
            <button class="complete-interaction" data-id="${item.id}">Mark Completed</button>
        `;
        container.appendChild(card);
    });
}

function renderAdminDashboard() {
    const dashboard = document.getElementById("adminDashboard");
    if (!dashboard) return;

    const user = getCurrentUser();
    if (user?.role !== "admin") {
        dashboard.innerHTML = "<p>Only admin users can view this page.</p>";
        return;
    }

    const listings = getData("listings", []);
    const interactions = getData("interactions", []);
    document.getElementById("totalListings").textContent = listings.length;
    document.getElementById("pendingListings").textContent = listings.filter(item => !item.approved).length;
    document.getElementById("totalInteractions").textContent = interactions.length;
    renderListings();
}

document.addEventListener("submit", function (e) {
    if (e.target.id === "loginForm") {
        e.preventDefault();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;
        const users = getData("users", []);
        const user = users.find(account => account.email === email && account.password === password);

        if (!user) {
            alert("Invalid email or password.");
            return;
        }

        saveData("user", { email: user.email, role: user.role, name: user.name });
        alert("Logged in as " + user.role);
        window.location.href = "index.html";
    }

    if (e.target.id === "registerForm") {
        e.preventDefault();
        const name = document.getElementById("registerName").value.trim();
        const email = document.getElementById("registerEmail").value.trim().toLowerCase();
        const password = document.getElementById("registerPassword").value;
        const users = getData("users", []);

        if (!email.endsWith(ACITY_DOMAIN)) {
            alert("Registration is restricted to valid ACity emails ending with " + ACITY_DOMAIN);
            return;
        }

        if (users.some(account => account.email === email)) {
            alert("An account with this email already exists.");
            return;
        }

        const newUser = {
            name,
            email,
            password,
            role: "user",
            phone: "",
            skillsOffered: "",
            skillsNeeded: ""
        };

        users.push(newUser);
        saveData("users", users);
        saveData("user", { email: newUser.email, role: newUser.role, name: newUser.name });
        alert("Registration successful.");
        window.location.href = "profile.html";
    }

    if (e.target.id === "listingForm") {
        e.preventDefault();
        if (!requireLogin()) return;

        const user = getCurrentUser();
        const listings = getData("listings", []);
        const category = document.getElementById("listingCategory").value;
        const status = document.getElementById("listingStatus").value;
        const newListing = {
            id: "listing-" + Date.now(),
            title: document.getElementById("listingTitle").value.trim(),
            description: document.getElementById("listingDescription").value.trim(),
            category,
            status,
            owner: user.email,
            approved: user.role === "admin",
            image: category === "Skill" ? "images/mona-miller-JAjD4uokc6k-unsplash.jpg" : "images/bruno-guerrero-jxKakgpKRWE-unsplash.jpg"
        };

        listings.unshift(newListing);
        saveData("listings", listings);
        e.target.reset();
        alert(user.role === "admin" ? "Listing posted." : "Listing submitted for admin approval.");
        renderListings();
        renderAdminDashboard();
    }
});

document.addEventListener("click", function (e) {
    if (e.target.classList.contains("interest-btn")) {
        if (!requireLogin()) return;

        const user = getCurrentUser();
        const listings = getData("listings", []);
        const listing = listings.find(item => item.id === e.target.dataset.id);

        if (!listing) return;
        if (listing.owner === user.email) {
            alert("You cannot express interest in your own listing.");
            return;
        }

        const interactions = getData("interactions", []);
        interactions.unshift({
            id: "interaction-" + Date.now(),
            listingId: listing.id,
            buyer: user.email,
            owner: listing.owner,
            status: "Pending"
        });
        saveData("interactions", interactions);
        alert("Interest sent to " + listing.owner);
        updateNavigation();
        renderInteractions();
    }

    if (e.target.classList.contains("approve-btn")) {
        const listings = getData("listings", []).map(item => item.id === e.target.dataset.id ? { ...item, approved: true } : item);
        saveData("listings", listings);
        alert("Listing approved.");
        renderListings();
        renderAdminDashboard();
    }

    if (e.target.classList.contains("sold-btn")) {
        const listings = getData("listings", []).map(item => {
            if (item.id !== e.target.dataset.id) return item;
            return { ...item, status: item.category === "Skill" ? "Swapped" : "Sold" };
        });
        saveData("listings", listings);
        renderListings();
        renderAdminDashboard();
    }

    if (e.target.classList.contains("edit-btn")) {
        const listings = getData("listings", []);
        const listing = listings.find(item => item.id === e.target.dataset.id);
        if (!listing) return;

        const title = prompt("Edit listing title:", listing.title);
        if (title === null) return;
        const description = prompt("Edit listing description:", listing.description);
        if (description === null) return;
        const status = prompt("Edit status: Available, Swapped, or Sold", listing.status);
        if (status === null) return;

        const updatedListings = listings.map(item => {
            if (item.id !== listing.id) return item;
            return {
                ...item,
                title: title.trim() || item.title,
                description: description.trim() || item.description,
                status: ["Available", "Swapped", "Sold"].includes(status.trim()) ? status.trim() : item.status
            };
        });

        saveData("listings", updatedListings);
        alert("Listing edited.");
        renderListings();
        renderAdminDashboard();
    }

    if (e.target.classList.contains("flag-btn")) {
        const listings = getData("listings", []).map(item => item.id === e.target.dataset.id ? { ...item, flagged: true } : item);
        saveData("listings", listings);
        alert("Listing flagged for inappropriate content review.");
        renderListings();
        renderAdminDashboard();
    }

    if (e.target.classList.contains("delete-btn")) {
        const listings = getData("listings", []).filter(item => item.id !== e.target.dataset.id);
        saveData("listings", listings);
        alert("Listing removed.");
        renderListings();
        renderAdminDashboard();
    }

    if (e.target.classList.contains("complete-interaction")) {
        const interactions = getData("interactions", []).map(item => item.id === e.target.dataset.id ? { ...item, status: "Completed" } : item);
        saveData("interactions", interactions);
        renderInteractions();
    }
});

document.addEventListener("input", function (e) {
    if (e.target.matches("#listingSearch, #categoryFilter, #statusFilter")) {
        renderListings();
    }
});

seedData();
updateNavigation();
renderListings();
renderProfile();
renderInteractions();
renderAdminDashboard();
