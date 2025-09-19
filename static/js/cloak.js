function update_page_cloak() {
    const selected_cloak = localStorage.getItem("cloak");

    if (!selected_cloak || selected_cloak === "none") {
        document.title = "Lithium";
        set_favicon("./images/logo.png");
        return;
    }

    const custom_title = localStorage.getItem("customTitle");
    const custom_favicon = localStorage.getItem("customFavicon");

    if (custom_title && custom_favicon) {
        document.title = custom_title;
        set_favicon(custom_favicon);
        return;
    }

    fetch('./json/cloak.json')
        .then(response => response.json())
        .then(data => {
            if (data[selected_cloak]) {
                const titles = {
                    "google-docs": "Google Docs",
                    "google-classroom": "Google Classroom",
                    "blackboard": "Blackboard",
                    "moodle": "Moodle",
                    "scholastic": "Scholastic",
                    "khan-academy": "Khan Academy",
                    "quizlet": "Quizlet"
                };

                document.title = titles[selected_cloak] || "Lithium";
                set_favicon(`../logos/${data[selected_cloak]}`);
            }
        })
        .catch(err => {
            console.error('Error loading cloak settings:', err);
            document.title = "Lithium";
            set_favicon("./images/logo.png");
        });
}

function set_favicon(icon_path) {
    let favicon = document.querySelector('link[rel="icon"]');

    if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        document.head.appendChild(favicon);
    }

    favicon.href = icon_path;
}

document.addEventListener('DOMContentLoaded', update_page_cloak);

window.addEventListener('storage', function(e) {
    if (e.key === "cloak" || e.key === "customTitle" || e.key === "customFavicon") {
        update_page_cloak();
    }
});
