document.addEventListener('DOMContentLoaded', () => {
  fetch('json/apps.json')
    .then(response => response.json())
    .then(apps => {
      const all_grids = document.querySelectorAll('.apps-grid');
      if (!all_grids.length) return;

      all_grids.forEach(grid => grid.innerHTML = '');

      apps.forEach(app => {
        const grid = document.querySelector(`#${app.category} .apps-grid`) || all_grids[0];

        const app_button = document.createElement('a');
        app_button.className = 'app-button';
        app_button.href = '#';
        app_button.innerHTML = `
          <img src="${app.image}" alt="${app.name}">
          <span>${app.name}</span>
        `;

        app_button.addEventListener('click', (e) => {
          e.preventDefault();
          localStorage.setItem('url', app.link);
          window.location.replace('go.html');
        });

        grid.appendChild(app_button);
      });
    })
    .catch(err => console.error('Failed to load apps:', err));
});
