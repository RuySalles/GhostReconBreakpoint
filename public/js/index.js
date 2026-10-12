/* ==========================================================================
   HUB INICIAL — monta a lista de missões a partir de campaigns/catalogo.js
   ========================================================================== */
(function () {
    'use strict';

    var lista = document.getElementById('mission-list');
    if (!lista) return;

    (window.GRB_MISSOES || []).forEach(function (m) {
        var item = document.createElement('article');
        item.className = 'mission-item';
        item.innerHTML =
            '<div class="mission-info"><h2></h2><p></p></div>' +
            '<a class="btn">ACESSAR OPORD</a>';
        item.querySelector('h2').textContent = m.titulo;
        item.querySelector('p').textContent = m.resumo;

        var link = item.querySelector('a');
        link.href = m.pagina;
        link.setAttribute('aria-label', 'Acessar ' + m.titulo);

        lista.appendChild(item);
    });
})();
