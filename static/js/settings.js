        // Theme settings
        const themes = {
            default: {
                primary: '#00ff00',
                primaryDark: '#00cc00',
                accent: '#00ff88'
            },
            purple: {
                primary: '#A020F0',
                primaryDark: '#8A2BE2',
                accent: '#E066FF'
            },
            blue: {
                primary: '#00a8ff',
                primaryDark: '#0097e6',
                accent: '#00d2d3'
            },
            red: {
                primary: '#ff4757',
                primaryDark: '#ff6b81',
                accent: '#ffa502'
            }
        };

        function loadSettings() {
            const proxyType = localStorage.getItem("proxy") || "uv";
            const transportType = localStorage.getItem("transport") || "epoxy";
            const searchEngine = localStorage.getItem("engine") || "google";
            const cloakType = localStorage.getItem("cloak") || "none";
            const customTitle = localStorage.getItem("customTitle") || "";
            const customFavicon = localStorage.getItem("customFavicon") || "";
            const themeName = localStorage.getItem("selectedTheme") || "default";

            document.getElementById("proxyType").value = proxyType;
            document.getElementById("transportType").value = transportType;
            document.getElementById("searchEngine").value = searchEngine;
            document.getElementById("cloakType").value = cloakType;
            document.getElementById("customTitle").value = customTitle;
            document.getElementById("customFavicon").value = customFavicon;
            document.getElementById("themeSelect").value = themeName;

            updateProxyStatus(proxyType);
            applyTheme(themeName);
        }

        function updateProxyStatus(proxyType) {
            const statusElement = document.getElementById("proxyStatus");
            statusElement.textContent = `Current Proxy: ${proxyType.toUpperCase()}`;
            statusElement.className = `proxy-status status-${proxyType}`;
        }

        function saveSettings() {
            const proxyType = document.getElementById("proxyType").value;
            const transportType = document.getElementById("transportType").value;
            const searchEngine = document.getElementById("searchEngine").value;
            const cloakType = document.getElementById("cloakType").value;
            const customTitle = document.getElementById("customTitle").value;
            const customFavicon = document.getElementById("customFavicon").value;
            const themeName = document.getElementById("themeSelect").value;

            localStorage.setItem("proxy", proxyType);
            localStorage.setItem("transport", transportType);
            localStorage.setItem("engine", searchEngine);
            localStorage.setItem("cloak", cloakType);
            localStorage.setItem("customTitle", customTitle);
            localStorage.setItem("customFavicon", customFavicon);
            localStorage.setItem("selectedTheme", themeName);

            updateProxyStatus(proxyType);
            updateCloakSettings(cloakType);
            applyTheme(themeName);
            
            const saveButton = document.querySelector(".save-button");
            const originalText = saveButton.textContent;
            saveButton.textContent = "✓ Settings Saved!";
            saveButton.style.background = "rgba(0, 255, 0, 0.3)";
            
            setTimeout(() => {
                saveButton.innerHTML = '<i class="fas fa-save"></i> Save Settings';
                saveButton.style.background = "rgba(0, 255, 0, 0.2)";
            }, 2000);
        }

        function updateCloakSettings(cloakType) {
            if (cloakType === "none") {
                localStorage.removeItem("cloak");
                return;
            }
            fetch('./json/cloak.json')
                .then(response => response.json())
                .then(data => {
                    if (data[cloakType]) {
                        localStorage.setItem("cloak", cloakType);
                    }
                })
                .catch(error => console.error('Error loading cloak settings:', error));
        }

        document.addEventListener("DOMContentLoaded", loadSettings);

        document.getElementById("proxyType").addEventListener("change", function(e) {
            updateProxyStatus(e.target.value);
        });

        document.getElementById("cloakType").addEventListener("change", function(e) {
            updateCloakSettings(e.target.value);
        });

        document.getElementById("themeSelect").addEventListener("change", function(e) {
            applyTheme(e.target.value);
        });

        // Time Bar
        function updateTimeBar() {
            const now = new Date();
            let hours = now.getHours();
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12;
            hours = hours.toString().padStart(2, '0');
            document.getElementById('timeBar').textContent = `${hours}:${minutes}:${seconds} ${ampm}`;
        }

        setInterval(updateTimeBar, 1000);
        updateTimeBar();

        // Apply settings and theme on load
        window.onload = function() {
            console.log('🚀 Initializing theme system in settings...');
            const savedTheme = localStorage.getItem("selectedTheme");
            console.log('💾 Retrieved saved theme from localStorage:', savedTheme);
            if (savedTheme) {
                applyTheme(savedTheme);
                // Update the theme selector to show current theme
                document.getElementById('themeSelect').value = savedTheme;
            }
        };

        function applyTheme(theme) {
            console.log('🎨 Attempting to load theme:', theme);
            fetch('./json/themes.json')
                .then(response => response.json())
                .then(data => {
                    var linkElement = document.querySelector("link[rel='stylesheet']");
                    if (data[theme]) {
                        console.log('✅ Found theme in themes.json:', theme);
                        console.log('📁 Loading CSS file:', data[theme]);
                        linkElement.href = data[theme];
                        console.log('✨ Theme applied successfully');
                    } else {
                        console.warn('⚠️ Theme not found:', theme);
                        console.log('🔄 Falling back to default theme');
                        linkElement.href = data["default"];
                    }
                })
                .catch(error => {
                    console.error('❌ Error loading themes.json:', error);
                });
        }

        // Update theme when selection changes
        document.getElementById('themeSelect').addEventListener('change', function() {
            const selectedTheme = this.value;
            localStorage.setItem("selectedTheme", selectedTheme);
            applyTheme(selectedTheme);
        });

        document.addEventListener('DOMContentLoaded', () => {
            // Load saved settings
            const savedProxy = localStorage.getItem('proxy') || 'uv';
            const savedEngine = localStorage.getItem('engine') || 'google';

            // Set initial selections
            document.querySelector(`[data-proxy="${savedProxy}"]`).classList.add('selected');
            document.querySelector(`[data-engine="${savedEngine}"]`).classList.add('selected');

            // Proxy selection
            document.querySelectorAll('.proxy-option').forEach(option => {
                option.addEventListener('click', () => {
                    document.querySelectorAll('.proxy-option').forEach(opt => opt.classList.remove('selected'));
                    option.classList.add('selected');
                    localStorage.setItem('proxy', option.dataset.proxy);
                });
            });

            // Search engine selection
            document.querySelectorAll('.search-engine-option').forEach(option => {
                option.addEventListener('click', () => {
                    document.querySelectorAll('.search-engine-option').forEach(opt => opt.classList.remove('selected'));
                    option.classList.add('selected');
                    localStorage.setItem('engine', option.dataset.engine);
                });
            });
        });