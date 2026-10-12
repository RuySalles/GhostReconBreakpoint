/* ==========================================================================
   {{CODIGO}} — {{NOME}} — CONTEÚDO DO GHOST LEAD (GM)
   Carregado SÓ pelas páginas do GM (hub-gm.html e dossie-gm.html).
   Cada chave aqui corresponde a um GRB.gm('chave') no missao.js.
   Spoilers, gabaritos, regras de arbitragem, complicações e textos do GM ficam AQUI.
   ========================================================================== */
(function (GRB) {
    'use strict';

    GRB.registrarGm({
        'hub.tituloPagina': '[OVERLORD] {{CODIGO}}: {{NOME_TITULO}} - Hub do GM',

        'hub.titulo': 'OVERLORD: {{NOME}}',

        'hub.de': 'COMANDO CENTRAL (VOCÊ)',

        'hub.para': 'ESQUADRÃO GHOST (CAMPO)',

        'hub.aviso': '&gt;&gt; UPLINK MESTRE ESTABELECIDO...',

        'hub.documentos.dossieGm': { rotulo: '📄 DOSSIÊ GM', href: 'dossie-gm.html', dica: 'Dossiê de Arbitragem (GM)', estilo: 'amber' },

        'hub.script': {
            evento: 'EVENTO X (Descrição):',
            paragrafos: [
                'Quando acionar e o que anunciar no rádio: <em>"Atenção Ghost 1-1, ..."</em>',
                'Mecanicamente: o que o GM faz in-game.'
            ]
        },

        'hub.objetivo1': 'O que o GM deve monitorar.',

        'hub.gabaritos': [
            { img: 'gm_alvo_a.jpg', titulo: 'ALVO A', zoom: 'Gabarito: Alvo A', descricao: 'O que a imagem mostra.' }
        ],

        'dossie.tituloPagina': '{{CODIGO}}: {{NOME_TITULO}} - DOSSIÊ OVERLORD (RESTRITO)',

        'dossie.marcaDagua': 'USO RESTRITO GHOST LEAD',

        'dossie.carimbo': 'SOMENTE LEITURA GHOST 1-1 / OVERLORD',

        'dossie.titulo': 'GRB-INTEL-{{CODIGO}}: DOSSIÊ GM',

        'dossie.autorizacao': 'CONTROLE GM ATIVO',

        'dossie.alerta': ['ALERTA DE SEGURANÇA', 'NÃO COMPARTILHAR COM OS OPERADORES 1-2, 1-3 OU 1-4.'],

        'dossie.regras.arbitragem': '- <strong>Arbitragem (GM):</strong> só o GM vê esta linha.',

        'dossie.objetivo1.acaoExtra': 'Ação extra que só o GM vê.',

        'dossie.complicacoes': {
            titulo: '3. COMPLICAÇÕES DO GM',
            cor: 'perigo',
            blocos: [
                { callout: 'Como GM, invoque estas complicações conforme os GATILHOS.', perigo: true },
                { complicacoes: [
                    { nome: 'Interdição de Rota', gatilho: 'Quando ...', acao: 'O GM declara ...', resposta: 'Os jogadores ...' }
                ] }
            ]
        },

        'dossie.fim': 'FIM DO DOSSIÊ OVERLORD. DESTRUA APÓS A LEITURA.',

        'dossie.carimboFim': 'FIM DE RELATÓRIO DO GM'
    });
})(window.GRB);
