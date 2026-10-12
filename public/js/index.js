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

    // Carimbo de versão: "BUILD a1b2c3d · 12/10/2026 14:32" (ou "BUILD LOCAL" fora do deploy)
    var carimbo = document.getElementById('build-stamp');
    var versao = window.GRB_VERSAO;
    if (carimbo && versao) {
        carimbo.textContent = 'BUILD ' + versao.commit + (versao.data ? ' · ' + versao.data : '');
        if (versao.commit !== 'LOCAL') carimbo.title = 'Versão publicada em ' + versao.data + ' (commit ' + versao.commit + ')';
    }
})();
