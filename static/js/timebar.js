function update_time_bar() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    hours = hours % 12 || 12;
    hours = String(hours).padStart(2, '0');

    const time_bar_element = document.getElementById('timeBar');
    if (time_bar_element) {
        time_bar_element.textContent = `${hours}:${minutes}:${seconds} ${ampm}`;
    }
}

// Update the time bar every second
setInterval(update_time_bar, 1000);
update_time_bar();
