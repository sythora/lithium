// js/custom-theme.js

const custom_theme_vars = [
    { css: '--bg-gradient', input: 'custom-bg-gradient' },
    { css: '--text-color', input: 'custom-text-color' },
    { css: '--accent-color', input: 'custom-accent-color' },
    { css: '--input-bg', input: 'custom-input-bg' },
    { css: '--input-border', input: 'custom-input-border' },
    { css: '--input-hover-bg', input: 'custom-input-hover-bg' },
    { css: '--glow-color', input: 'custom-glow-color' },
    { css: '--category-title-gradient', input: 'custom-category-title-gradient' },
    { css: '--category-bg', input: 'custom-category-bg' },
    { css: '--app-bg', input: 'custom-app-bg' },
    { css: '--app-border', input: 'custom-app-border' },
    { css: '--app-hover-bg', input: 'custom-app-hover-bg' },
    { css: '--app-hover-border', input: 'custom-app-hover-border' },
    { css: '--app-shadow', input: 'custom-app-shadow' },
    { css: '--app-hover-shadow', input: 'custom-app-hover-shadow' }
];

function save_custom_theme() {
    const theme = {};
    custom_theme_vars.forEach(({ css, input }) => {
        const val = document.getElementById(input)?.value;
        if (val !== undefined) theme[input] = val;
    });
    localStorage.setItem('customTheme', JSON.stringify(theme));
    console.log('Theme saved:', theme);
}

function load_custom_theme() {
    const stored = localStorage.getItem('customTheme');
    if (!stored) return;
    const theme = JSON.parse(stored);
    Object.entries(theme).forEach(([input, val]) => {
        const el = document.getElementById(input);
        if (el) {
            el.value = val;
            if (!input.includes('gradient') && !input.includes('shadow')) {
                document.documentElement.style.setProperty(`--${input.replace('custom-', '')}`, val);
            }
        }
    });

    document.getElementById('custom-bg-gradient').dispatchEvent(new Event('input'));
    document.getElementById('custom-app-shadow').dispatchEvent(new Event('input'));
    document.getElementById('custom-app-hover-shadow').dispatchEvent(new Event('input'));
}

function update_gradient_input() {
    const start = document.getElementById('gradient-start').value;
    const end = document.getElementById('gradient-end').value;
    const gradient = `linear-gradient(135deg, ${start} 0%, ${end} 100%)`;
    document.getElementById('custom-bg-gradient').value = gradient;
    document.getElementById('gradient-preview').style.background = gradient;
    document.documentElement.style.setProperty('--bg-gradient', gradient);
}

function sync_gradient_pickers() {
    const gradient = document.getElementById('custom-bg-gradient').value;
    const match = gradient.match(/linear-gradient\(135deg, (#[0-9a-fA-F]+) 0%, (#[0-9a-fA-F]+) 100%\)/);
    if (match) {
        document.getElementById('gradient-start').value = match[1];
        document.getElementById('gradient-end').value = match[2];
        document.getElementById('gradient-preview').style.background = gradient;
    }
}

function update_shadow_input() {
    const blur = document.getElementById('app-shadow-blur').value;
    const color = document.getElementById('app-shadow-color').value;
    const shadow = `0 0 ${blur}px ${hex_to_rgba(color, 0.2)}`;
    document.getElementById('custom-app-shadow').value = shadow;
    document.getElementById('app-shadow-preview').style.boxShadow = shadow;
    document.documentElement.style.setProperty('--app-shadow', shadow);
}

function update_hover_shadow_input() {
    const blur = document.getElementById('app-hover-shadow-blur').value;
    const color = document.getElementById('app-hover-shadow-color').value;
    const shadow = `0 0 ${blur}px ${hex_to_rgba(color, 0.3)}`;
    document.getElementById('custom-app-hover-shadow').value = shadow;
    document.getElementById('app-hover-shadow-preview').style.boxShadow = shadow;
    document.documentElement.style.setProperty('--app-hover-shadow', shadow);
}

function sync_shadow_pickers() {
    const shadow_val = document.getElementById('custom-app-shadow').value;
    const match = shadow_val.match(/0 0 (\d+)px rgba?\((\d+), ?(\d+), ?(\d+), ?([\d.]+)\)/);
    if (match) {
        document.getElementById('app-shadow-blur').value = match[1];
        document.getElementById('app-shadow-color').value = rgb_to_hex(match[2], match[3], match[4]);
        document.getElementById('app-shadow-preview').style.boxShadow = shadow_val;
    }

    const hover_val = document.getElementById('custom-app-hover-shadow').value;
    const match2 = hover_val.match(/0 0 (\d+)px rgba?\((\d+), ?(\d+), ?(\d+), ?([\d.]+)\)/);
    if (match2) {
        document.getElementById('app-hover-shadow-blur').value = match2[1];
        document.getElementById('app-hover-shadow-color').value = rgb_to_hex(match2[2], match2[3], match2[4]);
        document.getElementById('app-hover-shadow-preview').style.boxShadow = hover_val;
    }
}

function hex_to_rgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
}

function rgb_to_hex(r, g, b) {
    return (
        '#' +
        Number(r).toString(16).padStart(2, '0') +
        Number(g).toString(16).padStart(2, '0') +
        Number(b).toString(16).padStart(2, '0')
    );
}

document.addEventListener('DOMContentLoaded', () => {
    custom_theme_vars.forEach(({ css, input }) => {
        const el = document.getElementById(input);
        if (el) {
            el.addEventListener('input', () => {
                if (!input.includes('gradient') && !input.includes('shadow')) {
                    document.documentElement.style.setProperty(css, el.value);
                }
            });
        }
    });

    document.getElementById('gradient-start').addEventListener('input', update_gradient_input);
    document.getElementById('gradient-end').addEventListener('input', update_gradient_input);
    document.getElementById('custom-bg-gradient').addEventListener('input', sync_gradient_pickers);

    document.getElementById('app-shadow-blur').addEventListener('input', update_shadow_input);
    document.getElementById('app-shadow-color').addEventListener('input', update_shadow_input);
    document.getElementById('app-hover-shadow-blur').addEventListener('input', update_hover_shadow_input);
    document.getElementById('app-hover-shadow-color').addEventListener('input', update_hover_shadow_input);
    document.getElementById('custom-app-shadow').addEventListener('input', sync_shadow_pickers);
    document.getElementById('custom-app-hover-shadow').addEventListener('input', sync_shadow_pickers);

    if (localStorage.getItem('customTheme')) {
        load_custom_theme();
        sync_shadow_pickers();
        sync_gradient_pickers();
    } else {
        update_gradient_input();
        update_shadow_input();
        update_hover_shadow_input();
    }
});
