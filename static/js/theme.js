// Theme presets
const themes = {
    default: { primary: '#00ff00', primary_dark: '#00cc00', accent: '#00ff88' },
    purple: { primary: '#A020F0', primary_dark: '#8A2BE2', accent: '#E066FF' },
    blue: { primary: '#00a8ff', primary_dark: '#0097e6', accent: '#00d2d3' },
    red: { primary: '#ff4757', primary_dark: '#ff6b81', accent: '#ffa502' }
};

// Load saved settings into the page
function load_settings() {
    const proxy_type = localStorage.getItem("proxy") || "uv";
    const transport_type = localStorage.getItem("transport") || "epoxy";
    const search_engine = localStorage.getItem("engine") || "google";
    const cloak_type = localStorage.getItem("cloak") || "none";
    const custom_title = localStorage.getItem("customTitle") || "";
    const custom_favicon = localStorage.getItem("customFavicon") || "";
    const selected_theme = localStorage.getItem("selectedTheme") || "default";

    document.getElementById("proxyType").value = proxy_type;
    document.getElementById("transportType").value = transport_type;
    document.getElementById("searchEngine").value = search_engine;
    document.getElementById("cloakType").value = cloak_type;
    document.getElementById("customTitle").value = custom_title;
    document.getElementById("customFavicon").value = custom_favicon;
    document.getElementById("themeSelect").value = selected_theme;

    update_proxy_status(proxy_type);
    apply_theme(selected_theme);
}

// Update the proxy status display
function update_proxy_status(proxy_type) {
    const status_element = document.getElementById("proxyStatus");
    status_element.textContent = `Current Proxy: ${proxy_type.toUpperCase()}`;
    status_element.className = `proxy-status status-${proxy_type}`;
}

// Save all current settings to localStorage
function save_settings() {
    const proxy_type = document.getElementById("proxyType").value;
    const transport_type = document.getElementById("transportType").value;
    const search_engine = document.getElementById("searchEngine").value;
    const cloak_type = document.getElementById("cloakType").value;
    const custom_title = document.getElementById("customTitle").value;
    const custom_favicon = document.getElementById("customFavicon").value;
    const selected_theme = document.getElementById("themeSelect").value;

    localStorage.setItem("proxy", proxy_type);
    localStorage.setItem("transport", transport_type);
    localStorage.setItem("engine", search_engine);
    localStorage.setItem("cloak", cloak_type);
    localStorage.setItem("customTitle", custom_title);
    localStorage.setItem("customFavicon", custom_favicon);
    localStorage.setItem("selectedTheme", selected_theme);

    update_proxy_status(proxy_type);
    update_cloak_settings(cloak_type);
    apply_theme(selected_theme);

    const save_button = document.querySelector(".save-button");
    save_button.textContent = "✓ Settings Saved!";
    save_button.style.background = "rgba(0, 255, 0, 0.3)";

    setTimeout(() => {
        save_button.innerHTML = '<i class="fas fa-save"></i> Save Settings';
        save_button.style.background = "rgba(0, 255, 0, 0.2)";
    }, 2000);
}

// Update cloak setting in localStorage
function update_cloak_settings(cloak_type) {
    if (cloak_type === "none") {
        localStorage.removeItem("cloak");
        return;
    }

    fetch('./json/cloak.json')
        .then(response => response.json())
        .then(data => {
            if (data[cloak_type]) {
                localStorage.setItem("cloak", cloak_type);
            }
        })
        .catch(err => console.error('Error loading cloak settings:', err));
}

// Apply theme by loading its CSS file
function apply_theme(theme_name) {
    fetch('./json/themes.json')
        .then(response => response.json())
        .then(data => {
            const link_element = document.querySelector("link[rel='stylesheet']");
            if (data[theme_name]) {
                link_element.href = data[theme_name];
            } else {
                link_element.href = data["default"];
            }
        })
        .catch(err => console.error('Error loading themes.json:', err));
}

// Time bar display
function update_time_bar() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    document.getElementById('timeBar').textContent = `${hours.toString().padStart(2,'0')}:${minutes}:${seconds} ${ampm}`;
}

setInterval(update_time_bar, 1000);
update_time_bar();

// Event listeners
document.addEventListener("DOMContentLoaded", load_settings);

document.getElementById("proxyType").addEventListener("change", e => update_proxy_status(e.target.value));
document.getElementById("cloakType").addEventListener("change", e => update_cloak_settings(e.target.value));
document.getElementById("themeSelect").addEventListener("change", e => apply_theme(e.target.value));

// Initialize proxy & search engine options
document.addEventListener('DOMContentLoaded', () => {
    const saved_proxy = localStorage.getItem('proxy') || 'uv';
    const saved_engine = localStorage.getItem('engine') || 'google';

    document.querySelector(`[data-proxy="${saved_proxy}"]`)?.classList.add('selected');
    document.querySelector(`[data-engine="${saved_engine}"]`)?.classList.add('selected');

    document.querySelectorAll('.proxy-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.proxy-option').forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            localStorage.setItem('proxy', option.dataset.proxy);
        });
    });

    document.querySelectorAll('.search-engine-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.search-engine-option').forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            localStorage.setItem('engine', option.dataset.engine);
        });
    });
});
