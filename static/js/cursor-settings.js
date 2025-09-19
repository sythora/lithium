document.addEventListener('DOMContentLoaded', () => {
    const cursor_section = document.querySelector('.settings-section h2 i.fas.fa-mouse-pointer')?.closest('.settings-section');
    if (cursor_section) cursor_section.style.display = '';

    const preview_box = document.querySelector('.cursor-preview');
    const cursor_choice = document.getElementById('cursorStyle');

    const preview_cursor = document.createElement('div');
    preview_cursor.className = 'cursor preview-cursor';
    preview_cursor.style.display = 'none';
    preview_box.appendChild(preview_cursor);

    let main_cursor = document.querySelector('.cursor:not(.preview-cursor)');
    let main_cursor_dot = document.querySelector('.cursor-dot:not(.preview-cursor-dot)');

    function update_cursor_style(style_id) {
        const style_number = style_id.split('-')[1];
        const new_style_class = `cursor-style-${style_number}`;

        if (main_cursor) {
            main_cursor.classList.forEach(name => {
                if (name.startsWith('cursor-style-')) main_cursor.classList.remove(name);
            });
            main_cursor.classList.add(new_style_class);
        }

        preview_cursor.classList.forEach(name => {
            if (name.startsWith('cursor-style-')) preview_cursor.classList.remove(name);
        });
        preview_cursor.classList.add(new_style_class);
    }

    const saved_style = localStorage.getItem('cursorStyle') || 'style-1';
    if (cursor_choice) cursor_choice.value = saved_style;
    update_cursor_style(saved_style);

    if (cursor_choice) {
        cursor_choice.addEventListener('change', (e) => {
            const style_id = e.target.value;
            update_cursor_style(style_id);
            localStorage.setItem('cursorStyle', style_id);
        });
    }

    preview_box.addEventListener('mousemove', (e) => {
        const rect = preview_box.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cursor_size = preview_cursor.offsetWidth;
        preview_cursor.style.left = (x - cursor_size / 2) + 'px';
        preview_cursor.style.top = (y - cursor_size / 2) + 'px';
    });

    preview_box.addEventListener('mouseenter', () => {
        if (main_cursor) main_cursor.style.display = 'none';
        if (main_cursor_dot) main_cursor_dot.style.display = 'none';
        preview_cursor.style.display = 'block';
        preview_cursor.classList.add('hover');
        if (cursor_choice) update_cursor_style(cursor_choice.value);
    });

    preview_box.addEventListener('mouseleave', () => {
        if (main_cursor) main_cursor.style.display = '';
        if (main_cursor_dot) main_cursor_dot.style.display = '';
        preview_cursor.style.display = 'none';
        preview_cursor.classList.remove('hover');
    });

    preview_box.addEventListener('mousedown', () => {
        preview_cursor.classList.add('click');
    });

    preview_box.addEventListener('mouseup', () => {
        preview_cursor.classList.remove('click');
    });
});
