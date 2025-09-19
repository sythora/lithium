const form = document.getElementById("form");
const input_field = document.getElementById("input");
const discord_btn = document.getElementById("discord");

document.addEventListener("DOMContentLoaded", () => {
  fetch("../json/motd.json")
    .then(res => res.json())
    .then(rants => {
      if (!Array.isArray(rants) || rants.length === 0) {
        document.getElementById("motd").innerText = "⚠️ No MOTD available.";
        return;
      }

      const random_rant = rants[Math.floor(Math.random() * rants.length)];
      document.getElementById("motd").innerText = random_rant.text;
    })
    .catch(err => {
      console.error("Failed to load MOTD:", err);
      document.getElementById("motd").innerText = "⚠️ Failed to load MOTD.";
    });
});

function open_url(url) {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }
    input_field.value = url;
    form.dispatchEvent(new Event('submit'));
}

async function init_app() {
    try {
        const connection = new BareMux.BareMuxConnection("/baremux/worker.js");
        const wisp_url = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";
        const transport_type = localStorage.getItem("transport") || "epoxy";

        if (await connection.getTransport() !== `/${transport_type}/index.mjs`) {
            await connection.setTransport(`/${transport_type}/index.mjs`, [{ wisp: wisp_url }]);
            console.log(`Using websocket transport. Wisp URL is: ${wisp_url}`);
        }
    } catch (err) {
        console.error("Error setting up BareMux:", err);
    }

    try {
        const scramjet = new ScramjetController({
            prefix: "/scram/service/",
            files: {
                wasm: "/scram/scramjet.wasm.js",
                worker: "/scram/scramjet.worker.js",
                client: "/scram/scramjet.client.js",
                shared: "/scram/scramjet.shared.js",
                sync: "/scram/scramjet.sync.js"
            },
            flags: { syncxhr: true }
        });

        window.sj = scramjet;
        scramjet.init("/sw.js");
    } catch (err) {
        console.error("Error setting up Scramjet & UV:", err);
    }

    if (!localStorage.getItem("proxy")) {
        localStorage.setItem("proxy", "uv");
    }

    try {
        await navigator.serviceWorker.register("/sw.js");
        console.log("Service worker registered successfully.");
    } catch (err) {
        console.error("Service worker registration failed:", err);
    }
}
init_app();

if (form) {
    form.addEventListener("submit", async event => {
        event.preventDefault();

        if (!localStorage.getItem("proxy")) localStorage.setItem("proxy", "uv");

        let url_value = input_field.value.trim();
        if (!is_url(url_value)) {
            const engine = localStorage.getItem("engine") || "google";
            url_value = engine === "google" 
                ? `https://www.google.com/search?q=${url_value}` 
                : `https://duckduckgo.com/?t=h_&q=${url_value}`;
        } else if (!url_value.startsWith("https://") && !url_value.startsWith("http://")) {
            url_value = "https://" + url_value;
        }

        const proxy_type = localStorage.getItem("proxy");
        if (proxy_type === "uv") {
            url_value = __uv$config.prefix + __uv$config.encodeUrl(url_value);
        } else if (proxy_type === "sj") {
            url_value = "/scram/service/" + encodeURIComponent(url_value);
        }

        localStorage.setItem("url", url_value);
        window.location.href = "/go.html";
    });
}

function is_url(val = "") {
    return /^http(s?):\/\//.test(val) || (val.includes(".") && val[0] !== " ");
}

function is_valid_url(url) {
    try { new URL(url); return true; } 
    catch { return false; }
}

function get_search_engine_url() {
    const engine = localStorage.getItem("engine") || "google";
    const engines = {
        "google": "https://www.google.com/search?q=",
        "duckduckgo": "https://duckduckgo.com/?q="
    };
    return engines[engine] || engines.google;
}

function get_proxy_instance() {
    return localStorage.getItem("proxy") === "uv" ? __uv$config : ScramjetController;
}

function encode_url(url, proxy) {
    return proxy === "uv" ? __uv$config.prefix + __uv$config.encodeUrl(url) : ScramjetController.getProxyUrl(url);
}

// App buttons and search
document.addEventListener('DOMContentLoaded', () => {
    const search_form = document.getElementById('searchForm');
    const app_buttons = document.querySelectorAll('.app-button');

    if (search_form) {
        search_form.addEventListener('submit', e => {
            e.preventDefault();
            const search_input = document.getElementById('searchInput');
            if (search_input.value) open_url(search_input.value);
        });
    }

    app_buttons.forEach(button => {
        button.addEventListener('click', () => {
            const app_name = button.getAttribute('data-app');
            if (app_name) open_url(app_name);
        });
    });
});

// Filter apps as you type
document.getElementById('searchApps')?.addEventListener('input', e => {
    const search_term = e.target.value.toLowerCase();
    const apps = document.querySelectorAll('.app-button');

    apps.forEach(app => {
        const text = app.textContent.toLowerCase();
        app.classList.toggle('hidden', !text.includes(search_term));
    });
});
