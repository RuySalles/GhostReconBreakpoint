/* ==========================================================================
   TEMA INICIAL — aplica o tema salvo (ou o do sistema) ANTES da página aparecer,
   para não "piscar" o tema errado. Carregar no <head>, SEM defer, depois da
   <meta name="theme-color">. A troca de tema pelo botão fica em base.js.
   ========================================================================== */
(function () {
    'use strict';

    // Cor da barra do navegador no celular, por tema (= --bg de base.css)
    var CORES = { dark: '#060906', light: '#e7e2d0' };
    var tema;

    try { tema = localStorage.getItem('grb-theme'); } catch (e) { /* modo privado */ }
    if (tema !== 'light' && tema !== 'dark') {
        tema = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    document.documentElement.setAttribute('data-theme', tema);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', CORES[tema]);

    window.GRB_CORES_TEMA = CORES;
})();
