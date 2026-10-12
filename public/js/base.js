/* ==========================================================================
   BASE — comportamento compartilhado do site (hub inicial e missões)

   Marcações reconhecidas no HTML:
     data-zoom [data-caption="..."]  abre a imagem (href ou valor de data-zoom) em tela cheia
     data-open="idDoDialog"          abre um <dialog> pelo id
     data-close                      fecha o <dialog> onde está
     data-action="print"             imprime a página
   Também monta o botão de tema dentro de .nav-buttons e controla o áudio Overlord.
   ========================================================================== */
(function () {
    'use strict';

    var THEME_KEY = 'grb-theme';
    var root = document.documentElement;

    // ----------------------------------------------------------------------
    // TEMA (escuro / claro)
    // ----------------------------------------------------------------------
    function currentTheme() {
        return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    }

    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);
        try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* modo privado */ }
        var meta = document.querySelector('meta[name="theme-color"]');
        if (meta && window.GRB_CORES_TEMA) meta.setAttribute('content', window.GRB_CORES_TEMA[theme]);
        syncThemeToggles();
    }

    function syncThemeToggles() {
        var light = currentTheme() === 'light';
        document.querySelectorAll('.theme-toggle').forEach(function (btn) {
            btn.setAttribute('aria-pressed', String(light));
            btn.querySelector('.theme-toggle__label').textContent = light ? 'MODO DIURNO' : 'MODO NOTURNO';
            btn.title = light ? 'Mudar para o modo noturno (escuro)' : 'Mudar para o modo diurno (claro)';
        });
    }

    function mountThemeToggle() {
        var bar = document.querySelector('.nav-buttons');
        if (!bar || bar.querySelector('.theme-toggle')) return;
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn--ghost theme-toggle';
        btn.innerHTML = '<span class="theme-toggle__icon" aria-hidden="true"></span><span class="theme-toggle__label"></span>';
        btn.addEventListener('click', function () {
            applyTheme(currentTheme() === 'light' ? 'dark' : 'light');
        });
        bar.appendChild(btn);
        syncThemeToggles();
    }

    // ----------------------------------------------------------------------
    // VISUALIZADOR DE IMAGEM
    // ----------------------------------------------------------------------
    var imageDialog = null;

    function getImageDialog() {
        if (imageDialog) return imageDialog;

        imageDialog = document.createElement('dialog');
        imageDialog.className = 'modal modal--image';
        imageDialog.setAttribute('aria-label', 'Imagem de inteligência ampliada');
        imageDialog.innerHTML =
            '<button type="button" class="btn btn--danger modal__close" aria-label="Fechar imagem">✕ FECHAR</button>' +
            '<img class="modal__img" alt="">' +
            '<p class="modal__error" hidden>[SEM SINAL]<br>Arquivo de inteligência não encontrado no servidor.<br><code></code></p>' +
            '<div class="modal__caption"></div>';
        document.body.appendChild(imageDialog);

        var img = imageDialog.querySelector('.modal__img');
        var error = imageDialog.querySelector('.modal__error');
        img.addEventListener('error', function () {
            if (!img.getAttribute('src')) return;
            img.hidden = true;
            error.hidden = false;
            error.querySelector('code').textContent = img.getAttribute('src').split('/').pop();
        });

        // Qualquer clique fecha o visualizador
        imageDialog.addEventListener('click', function () {
            imageDialog.close();
        });
        imageDialog.addEventListener('close', function () {
            img.removeAttribute('src');
        });

        return imageDialog;
    }

    function openImage(src, caption, alt) {
        var dialog = getImageDialog();
        var img = dialog.querySelector('.modal__img');
        img.hidden = false;
        dialog.querySelector('.modal__error').hidden = true;
        img.alt = alt || caption || '';
        img.src = src;
        dialog.querySelector('.modal__caption').textContent = caption || '';
        dialog.showModal();
        dialog.querySelector('.modal__close').focus();
    }

    function captionFor(trigger) {
        if (trigger.hasAttribute('data-caption')) return trigger.getAttribute('data-caption');
        var figure = trigger.closest('figure');
        var figcaption = figure && figure.querySelector('figcaption');
        return figcaption ? figcaption.textContent.replace(/\s+/g, ' ').trim() : '';
    }

    // ----------------------------------------------------------------------
    // CLIQUES (delegação única)
    // ----------------------------------------------------------------------
    document.addEventListener('click', function (event) {
        var target = event.target;

        var zoom = target.closest('[data-zoom]');
        if (zoom) {
            event.preventDefault();
            var src = zoom.getAttribute('data-zoom') || zoom.getAttribute('href');
            var thumb = zoom.querySelector('img');
            openImage(src, captionFor(zoom), thumb ? thumb.alt : '');
            return;
        }

        var opener = target.closest('[data-open]');
        if (opener) {
            var dialog = document.getElementById(opener.getAttribute('data-open'));
            if (dialog && typeof dialog.showModal === 'function') {
                event.preventDefault();
                dialog.showModal();
            }
            return;
        }

        var closer = target.closest('[data-close]');
        if (closer) {
            var parent = closer.closest('dialog');
            if (parent) parent.close();
            return;
        }

        if (target.closest('[data-action="print"]')) {
            window.print();
            return;
        }

        // Clique no fundo escurecido fecha o diálogo
        if (target.tagName === 'DIALOG' && target !== imageDialog) {
            var r = target.getBoundingClientRect();
            var outside = event.clientX < r.left || event.clientX > r.right ||
                          event.clientY < r.top || event.clientY > r.bottom;
            if (outside) target.close();
        }
    });

    // ----------------------------------------------------------------------
    // ÁUDIO OVERLORD
    // ----------------------------------------------------------------------
    function initComms() {
        var audio = document.getElementById('overlord-transmission');
        var btn = document.getElementById('btn-play-comms');
        var status = document.getElementById('comms-status');
        if (!audio || !btn || !status) return;

        var icon = btn.querySelector('.icon');
        var label = btn.querySelector('.label');

        function setState(state, iconText, labelText, message) {
            icon.textContent = iconText;
            label.textContent = labelText;
            status.textContent = message;
            status.setAttribute('data-state', state);
            btn.classList.toggle('playing', state === 'playing');
        }

        btn.addEventListener('click', function () {
            if (!audio.paused) {
                audio.pause();
                return;
            }
            setState('playing', '⏸', 'PAUSAR TRANSMISSÃO', 'STATUS: DESCRIPTOGRAFANDO E REPRODUZINDO...');
            var playing = audio.play();
            if (playing && typeof playing.catch === 'function') {
                playing.catch(function () {
                    setState('error', '↻', 'TENTAR NOVAMENTE', 'STATUS: FALHA NO UPLINK DE ÁUDIO');
                });
            }
        });

        audio.addEventListener('pause', function () {
            if (!audio.ended && status.getAttribute('data-state') !== 'error') {
                setState('paused', '▶', 'RETOMAR TRANSMISSÃO', 'STATUS: TRANSMISSÃO PAUSADA');
            }
        });

        audio.addEventListener('ended', function () {
            setState('ended', '↺', 'REPETIR TRANSMISSÃO', 'STATUS: TRANSMISSÃO CONCLUÍDA');
        });
    }

    // ----------------------------------------------------------------------
    // INICIALIZAÇÃO
    // ----------------------------------------------------------------------
    function init() {
        mountThemeToggle();
        initComms();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
