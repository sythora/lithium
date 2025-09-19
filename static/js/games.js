document.addEventListener('DOMContentLoaded', () => {
  fetch('json/games.json')
    .then(response => response.json())
    .then(games => {
      const all_grids = document.querySelectorAll('.apps-grid');
      if (!all_grids.length) return;

      all_grids.forEach(grid => grid.innerHTML = '');

      games.forEach(game => {
        const grid = document.querySelector(`#${game.category} .apps-grid`) || all_grids[0];

        const game_button = document.createElement('a');
        game_button.className = 'app-button';
        game_button.href = '#';
        game_button.innerHTML = `
          <img src="${game.image}" alt="${game.name}">
          <span>${game.name}</span>
        `;

        game_button.addEventListener('click', (e) => {
          e.preventDefault();
          localStorage.setItem('url', game.link);
          window.location.replace('go.html');
        });

        grid.appendChild(game_button);
      });
    })
    .catch(err => console.error('Failed to load games:', err));
});