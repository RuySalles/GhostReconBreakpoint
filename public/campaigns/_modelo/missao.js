/* ==========================================================================
   {{CODIGO}} — {{NOME}}
   Todo o conteúdo da missão fica aqui. As páginas são montadas a partir deste arquivo:
     lore_hub.html        -> Hub do Ghost Squad (jogadores)
     lore_hub_gm.html     -> Hub do Ghost Lead (GM) = tudo do Squad + o que for soGm
     briefing_tatico.html -> Dossiê tático do Squad      (documentos.tatico)
     relatorio_gm.html    -> Dossiê do GM                (documentos.tatico, versão GM)
     doc_intel.html       -> Documento interceptado      (documentos.inteligencia)

   GRB.papel('squad', 'gm')  -> texto diferente para Squad e GM
   GRB.soGm(...)             -> aparece só para o GM (item de lista, linha, seção inteira...)
   GRB.soSquad(...)          -> aparece só para o Squad

   Textos aceitam HTML simples: <strong>, <em>, <br>, <span class="warning">,
   <strong class="text-amber">, <strong class="text-danger">.
   Imagens: só o nome do arquivo (procurado em "imagens"), ou caminho começando com ../
   Guia completo: AGENTS.md -> "Como criar uma missão".
   ========================================================================== */
(function (GRB) {
    'use strict';

    var papel = GRB.papel;
    var soGm = GRB.soGm;
    var soSquad = GRB.soSquad;

    GRB.registrarMissao({
        imagens: '{{IMAGENS}}',                         // pasta das imagens desta missão
        audio: '{{IMAGENS}}audio/briefing.mp3',         // áudio do Overlord (apague a linha se não houver)
        // estiloGaleria: 'intel-gallery--nvg',         // filtro de visão noturna em todas as galerias

        // ------------------------------------------------------------------
        // HUB
        // ------------------------------------------------------------------
        hub: {
            tituloPagina: papel('{{CODIGO}}: {{NOME_TITULO}} - Lore & Briefing', '[OVERLORD] {{CODIGO}}: {{NOME_TITULO}} - Hub do GM'),
            titulo: papel('OPERAÇÃO: {{NOME}}', 'OVERLORD: {{NOME}}'),
            cabecalho: [
                ['DE', papel('CENTRO DE COMANDO TÁTICO (OVERLORD)', 'COMANDO CENTRAL (VOCÊ)')],
                ['PARA', papel('ESQUADRÃO GHOST', 'ESQUADRÃO GHOST (CAMPO)')],
                ['LOCALIZAÇÃO', 'PROVÍNCIA, AUROA']
                // { aviso: 'TEXTO PISCANDO' }   <- alerta piscando no meio do cabeçalho
            ],
            aviso: papel('&gt;&gt; UPLINK SEGURO ESTABELECIDO...', '&gt;&gt; UPLINK MESTRE ESTABELECIDO...'),
            // imprimir: true,      // botão "IMPRIMIR DOSSIÊ" na barra do topo
            // acessoGm: false,     // missão sem área do GM (some o 👁️ do canto)

            // Briefing: lista de blocos, na ordem em que aparecem
            briefing: [
                // { video: 'video.mp4' },
                // { kneeboard: '// CARTAS DE NAVEGAÇÃO (KNEEBOARD)', galeria: [ ... ] },
                'Senhores, ... (parágrafo de abertura do Overlord).',
                { galeria: [
                    { img: 'insercao.jpg', larga: true, titulo: 'Ponto de Inserção', legenda: 'Descrição curta.',
                      zoom: '[INTEL 001] Legenda longa que aparece ao ampliar a imagem.' }
                ] },
                'Segundo parágrafo do briefing.'
                // { h3: 'Resumo Tático (SITREP)' },
                // { tabela: ['Parâmetro', 'Detalhe'], linhas: [
                //     ['Ponto de Infiltração', 'Bivaque X'],
                //     { perigo: true, celulas: ['Risco Ambiental', 'Zona NOGO'] }
                // ] },
                // { lista: ['Item 1', 'Item 2'] },
                // { callout: '<strong>Procedimento:</strong> texto em destaque.' },
                // { p: 'Boa sorte, Ghosts. Dispensados.', classe: 'sign-off typing-effect' }
            ],

            // Botões de documentos abaixo do briefing
            documentos: [
                { configuracoes: true, rotulo: '⚙️ CONFIGURAÇÕES', dica: 'Parâmetros de Imersão e Loadout' },
                { rotulo: '📄 CONFIDENCIAL', href: 'briefing_tatico.html', dica: '{{CODIGO}}: Execução Tática (Esquadrão)' },
                { rotulo: '📖 INTELIGÊNCIA', href: 'doc_intel.html', dica: 'Documento Interceptado' },
                soGm({ rotulo: '📄 DOSSIÊ GM', href: 'relatorio_gm.html', dica: 'Dossiê de Arbitragem (GM)', estilo: 'amber' })
            ],

            // Script do mestre (só GM)
            script: soGm({
                evento: 'EVENTO X (Descrição):',
                paragrafos: [
                    'Quando acionar e o que anunciar no rádio: <em>"Atenção Ghost 1-1, ..."</em>',
                    'Mecanicamente: o que o GM faz in-game.'
                ]
            }),

            // Objetivos: cada seção vira um título + lista
            objetivos: [
                {
                    titulo: '// OBJETIVOS PRIMÁRIOS',
                    itens: [
                        {
                            titulo: 'OBJETIVO PRINCIPAL:',
                            texto: papel('O que o esquadrão deve fazer.', 'O que o GM deve monitorar.'),
                            sub: [
                                { rotulo: 'Local A:', texto: 'Detalhe do local.', galeria: [
                                    { img: 'alvo_a.jpg', titulo: 'Alvo Primário', legenda: 'Local A', zoom: '[SABOTAGEM] Descrição ampliada.' }
                                ] }
                            ]
                        }
                    ]
                },
                {
                    titulo: '// OBJETIVOS SECUNDÁRIOS (OPCIONAIS)',
                    cor: 'amber',
                    itens: [
                        { titulo: 'OBJETIVO OPCIONAL:', texto: 'Descrição.' }
                    ]
                },
                {
                    titulo: '// PROTOCOLO DE EXTRAÇÃO (EXFIL)',
                    intro: 'A extração só será autorizada após ...',
                    itens: [
                        { titulo: 'PONTO DE ENCONTRO (RV): Bivaque X', galeria: [
                            { img: 'exfil.jpg', larga: true, titulo: 'Ponto de Encontro (RV)', legenda: 'Bivaque X' }
                        ] }
                    ]
                }
            ],

            // Gabaritos do GM (botões que abrem a imagem em tela cheia)
            gabaritos: soGm([
                { img: 'gm_alvo_a.jpg', titulo: 'ALVO A', zoom: 'Gabarito: Alvo A', descricao: 'O que a imagem mostra.' }
            ])
        },

        // ------------------------------------------------------------------
        // CONFIGURAÇÕES DE IMERSÃO (modal ⚙️) — camuflagens ficam em assets/paint/
        // ------------------------------------------------------------------
        configuracoes: [
            { rotulo: 'Interface (HUD) e Teclado', texto: 'Regras de HUD.' },
            { rotulo: 'Ponto de Entrada', texto: 'Bivaque X entre 06:00 e 08:00.' },
            { rotulo: 'Transporte (Logística)', texto: 'Viagem rápida PROIBIDA.' },
            { rotulo: 'Camuflagem', aviso: '[!] PROIBIDO OVN', camuflagens: [
                { img: 'all-black.png', nome: 'Preto Sólido', partes: 'Coletes, Mãos' }
            ] },
            { rotulo: 'Regras de Sobrevivência', texto: 'Squad Wipe total encerra a missão.' }
        ],

        // ------------------------------------------------------------------
        // DOCUMENTOS (dossiês em papel)
        // ------------------------------------------------------------------
        documentos: {
            tatico: {
                tituloPagina: papel('{{CODIGO}}: {{NOME_TITULO}} - Briefing Tático (Ghost Squad)', '{{CODIGO}}: {{NOME_TITULO}} - DOSSIÊ OVERLORD (RESTRITO)'),
                marcaDagua: papel('CONFIDENCIAL // USO RESTRITO', 'USO RESTRITO GHOST LEAD'),
                carimbo: papel('ULTRA SECRETO - APENAS GHOST SQUAD', 'SOMENTE LEITURA GHOST 1-1 / OVERLORD'),
                titulo: papel('GRB-INTEL-{{CODIGO}}: {{NOME}}', 'GRB-INTEL-{{CODIGO}}: DOSSIÊ GM'),
                cabecalho: [
                    ['OPERAÇÃO', '{{NOME}}'],
                    ['LOCALIZAÇÃO', 'ARQUIPÉLAGO DE AUROA // PROVÍNCIA'],
                    ['AUTORIZAÇÃO', papel('APENAS PARA ESQUADRÃO GHOST', 'CONTROLE GM ATIVO')],
                    soGm(['ALERTA DE SEGURANÇA', 'NÃO COMPARTILHAR COM OS OPERADORES 1-2, 1-3 OU 1-4.'])
                ],
                aviso: soSquad('&gt;&gt; TRANSMISSÃO CRIPTOGRAFADA RECEBIDA...'),
                secoes: [
                    {
                        titulo: '1. REGRAS TÁTICAS',
                        blocos: [
                            { linhas: [
                                '- <strong>Regra 1:</strong> descrição.',
                                soGm('- <strong>Arbitragem (GM):</strong> só o GM vê esta linha.')
                            ] }
                        ]
                    },
                    {
                        titulo: '2. EXECUÇÃO TÁTICA (PASSO A PASSO)',
                        blocos: [
                            { h3: 'OBJETIVO 1: LOCAL' },
                            'Prioridade em infiltração.',
                            { lista: ['Ação 1.', soGm('Ação extra que só o GM vê.')] }
                        ]
                    },
                    soGm({
                        titulo: '3. COMPLICAÇÕES DO GM',
                        cor: 'perigo',
                        blocos: [
                            { callout: 'Como GM, invoque estas complicações conforme os GATILHOS.', perigo: true },
                            { complicacoes: [
                                { nome: 'Interdição de Rota', gatilho: 'Quando ...', acao: 'O GM declara ...', resposta: 'Os jogadores ...' }
                            ] }
                        ]
                    })
                ],
                fim: papel('FIM DA TRANSMISSÃO - BOA CAÇADA, GHOSTS.', 'FIM DO DOSSIÊ OVERLORD. DESTRUA APÓS A LEITURA.'),
                carimboFim: papel('FIM DE RELATÓRIO', 'FIM DE RELATÓRIO DO GM')
            },

            inteligencia: {
                tituloPagina: 'Documento Interceptado',
                // estilo: 'skell',     // visual corporativo azul da Skell Tech
                voltar: { href: 'lore_hub.html', rotulo: 'RETORNAR AO HUB' },
                marcaDagua: 'CONFIDENCIAL',
                carimbo: 'ASSUNTOS INTERNOS',
                titulo: 'TÍTULO DO DOCUMENTO',
                digitando: false,
                cabecalho: [
                    ['DE', 'REMETENTE'],
                    ['PARA', 'DESTINATÁRIO'],
                    ['ASSUNTO', 'ASSUNTO']
                ],
                aviso: '&gt;&gt; DOCUMENTO INTERCEPTADO PELA INTELIGÊNCIA GHOST...',
                secoes: [
                    { titulo: '1. RESUMO', blocos: ['Texto do documento.'] }
                ],
                fim: 'Rodapé do documento.',
                fimPequeno: true
            }
        }
    });
})(window.GRB);
