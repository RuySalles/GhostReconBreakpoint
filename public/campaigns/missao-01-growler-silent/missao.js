/* ==========================================================================
   MISSÃO 01 — OPORD: GROWLER SILENT
   Todo o conteúdo da missão. A página hub.html é montada a partir daqui.
   Missão de página única: sem hub do GM e sem dossiês.
   ========================================================================== */
(function (GRB) {
    'use strict';

    GRB.registrarMissao({
        imagens: 'imagens/',
        estiloGaleria: 'intel-gallery--nvg intel-gallery--natural',

        hub: {
            tituloPagina: '[CLASSIFICADO] OPORD: Growler Silent',
            titulo: 'OPERAÇÃO: GROWLER SILENT',
            imprimir: true,
            acessoGm: false,
            cabecalho: [
                ['DE', 'CENTRO DE COMANDO TÁTICO (OVERLORD)'],
                ['PARA', 'ESQUADRÃO DE ASSALTO (GHOSTS)'],
                ['OPERADORES DESIGNADOS', '<span class="highlight">GHOST ACTUAL "Epyon12"</span> | <span class="highlight">GHOST LEAD "Muguiga"</span>'],
                { aviso: 'CLASSIFICAÇÃO: ULTRA SECRETO / ESTRITAMENTE PESSOAL' },
                ['ASSUNTO', 'ORDEM DE OPERAÇÕES - "OPERAÇÃO GROWLER SILENT"']
            ],

            briefing: [
                { video: 'video/OPORD_Growler_Silent.mp4' },

                { kneeboard: '// CARTAS DE NAVEGAÇÃO E SETORIZAÇÃO (KNEEBOARD)', galeria: [
                    { img: '1_1_Boat_Skell_Tech_location_Map.webp', legenda: 'REF: Carta Náutica Píer Inicial', alt: 'Carta náutica do píer inicial' },
                    { img: '2_1_Drone_Statio_CAR.webp', legenda: 'REF: Setor Intermediário W132', alt: 'Setor intermediário W132' },
                    { img: '0_1_Full_Map_1_Box_Infil.webp', legenda: 'REF: Setor Infiltração (Rio/Omega)', alt: 'Mapa do setor de infiltração' },
                    { img: '0_1_Full_Map_2_Heli.webp', legenda: 'REF: Setor Exfiltração &amp; Wasp Ridge', alt: 'Mapa do setor de exfiltração' }
                ] },

                'Senhores, prestem atenção. A Inteligência confirmou a localização de uma instalação clandestina da Skell Tech operada por forças Rogue. Eles estão manufaturando drones armados sendo usados ativamente contra a população civil de Auroa. Além disso, satélites detectaram um protótipo de helicóptero com capacidades anti-radar no local. Se essa aeronave entrar em operação, perderemos o controle do espaço aéreo no setor.',
                'O objetivo de vocês é paralisar a produção e extrair o protótipo. A margem de erro é zero.',

                { h3: 'Resumo Tático (SITREP)' },
                { tabela: ['Parâmetro', 'Detalhe'], linhas: [
                    ['Ponto de Infiltração', 'Murmur Delta Bivouac'],
                    ['Zona de Risco Extremo', 'The Growler River (Patrulhas aéreas pesadas)'],
                    ['ROE (Engajamento)', 'Furtividade absoluta até o objetivo principal. Letalidade total no complexo.'],
                    { perigo: true, celulas: ['Risco Ambiental', 'Lake Tiberias Bivouac - NOGO ZONE. (Contaminação radioativa letal)'] }
                ] },

                { h3: 'Execução da Missão (Fases)' },

                // FASE 1
                '<strong>FASE 1: INSERÇÃO E LOGÍSTICA</strong><br>' +
                'Vocês iniciarão a operação no <strong>Murmur Delta Bivouac</strong>. Desloquem-se até o píer adjacente e utilizem o transporte aquático para alcançar a foz do <strong>The Growler River</strong>. A topografia do rio impossibilita a navegação prolongada; o desembarque é obrigatório.<br>' +
                'Avancem até a <strong>Drone Station W132</strong>, que os relatórios indicam estar abandonada, e garantam transporte terrestre. Prossigam pelos trilhos novos até a <strong>Skell Technology Location</strong>.<br>' +
                '<em>Nota de Suprimentos:</em> Vocês cairão desarmados de explosivos pesados. Uma equipe de scout infiltrou a área ontem à noite e escondeu uma caixa com cargas de C4 neste local. Recuperem os explosivos. Sem eles, a Fase 3 fracassa.',
                { galeria: [
                    { img: '1_2_Boat_Skell_Tech_location.webp', legenda: 'REF: Píer e Embarcação de Inserção', alt: 'Píer e lancha' },
                    { img: '2_2_Drone_Statio_CAR.webp', legenda: 'REF: Ponto de Apoio W132 / Veículos', alt: 'Drone Station W132' },
                    { img: '4_1_Skell_C4_Box.webp', legenda: 'REF: Entrada / Skell Technology Location', alt: 'Entrada da Skell Tech' },
                    { img: '4_2_Skell_C4_Box.webp', legenda: 'REF: Ponto de Coleta do C4', alt: 'Caixa de C4' }
                ] },

                // FASE 2
                '<strong>FASE 2: O GARGALO (STEALTH)</strong><br>' +
                'Com os explosivos assegurados, o esquadrão se aproximará do <strong>Portão 03</strong>. A partir deste ponto, o protocolo Ghost entra em vigor. O trecho subsequente do rio está sob vigilância constante de patrulhas de helicóptero inimigas. Mantenham-se nas sombras e evitem qualquer engajamento.',
                { galeria: [
                    { img: '6_Área_Entrada_Zona_Perigosa.webp', legenda: 'REF: Canal de Acesso ao Portão 03', alt: 'Canal de entrada' },
                    { img: '7_2_Barco_em_Chamas.webp', legenda: 'REF: Alerta de Patrulha / Setor Quente', alt: 'Barco em chamas no rio' }
                ] },

                // FASE 3
                '<strong>FASE 3: AÇÃO DIRETA</strong><br>' +
                'O alvo principal é a <strong>Assembly Hall Omega 01</strong>.',
                { lista: [
                    'Realizem o <em>breach</em> da estrutura.',
                    'Limpem o salão de todos os hostis.',
                    'Plantem o C4 no gerador de energia e detonem, paralisando a fábrica.'
                ] },
                'Imediatamente após a sabotagem, movam-se para a <strong>Drone Station W161</strong> e eliminem a guarnição de reforços antes que eles possam organizar um contra-ataque na retaguarda de vocês.',
                { galeria: [
                    { img: '8_2_Assembly_Hall_Omega_Local.webp', legenda: 'REF: Fachada Assembly Hall Omega 01', alt: 'Assembly Hall Omega 01' },
                    { img: '9_Caminho_Drone_Station_W161.webp', legenda: 'REF: Progressão Noturna p/ W161', alt: 'Caminho até W161' },
                    { img: '11_Drone_Station_W161_REFORÇOS.webp', legenda: 'REF: Ponto de Contato W161', alt: 'Reforços na W161' }
                ] },

                // FASE 4
                '<strong>FASE 4: AQUISIÇÃO E EXFILTRAÇÃO (VFR)</strong><br>' +
                'Limpa a estação, prossigam a pé rumo ao <strong>Wasp Ridge Bivouac</strong>.<br>' +
                '<span class="warning">Aviso Crítico:</span> O trajeto contorna o <strong>Lake Tiberias Bivouac</strong>. Esta é uma zona de exclusão (NOGO ZONE) intransponível devido a vazamentos radioativos de testes de drones. Mantenham distância. Caso encontrem patrulhas nos trilhos abandonados perto da encosta, engajem apenas se a detecção for iminente.',
                'Ao alcançarem Wasp Ridge, localizem e embarquem no helicóptero protótipo.',
                { galeria: [
                    { img: '12_Exfil_Drone_Station_W161.webp', legenda: 'REF: Rota de Marcha até Wasp Ridge', alt: 'Caminho até Wasp Ridge' },
                    { img: '14_Tilhos_Abandonados.webp', legenda: 'REF: Encosta / Trilhos Abandonados', alt: 'Trilhos abandonados' }
                ] },

                { callout:
                    '<strong>Procedimento de Fuga:</strong> A Inteligência informa que os sistemas de navegação do helicóptero estão inoperantes e o espaço aéreo acima de vocês é uma <em>No Fly Zone</em> monitorada por enxames de drones letais.<br>' +
                    'O piloto tem poucos segundos após a decolagem para baixar a altitude. Vocês deverão realizar a exfiltração contornando a barreira externa em voo estritamente visual (VFR). Utilizem o <strong>Portão 03</strong> iluminado como Ponto de Encontro Visual (Rendezvous) para se reorientarem e sigam o curso do The Growler River pelo ar até avistarem as luzes do <strong>Murmur Delta Bivouac</strong>.'
                },
                { galeria: [
                    { img: '20_Rendevouz_GATE_03.webp', legenda: 'REF: Ponto de Referência Visual (Portão 03)', alt: 'Portão 03 à noite' },
                    { img: '21_Luzes_Murmur_Delta_Bivouac.webp', legenda: 'REF: Sinalizador de Chegada (Murmur Delta)', alt: 'Luzes do Murmur Delta Bivouac' }
                ] },

                'Repassem suas funções, verifiquem os rádios e preparem o equipamento. O tempo e a gravidade estão contra vocês.',
                { p: 'Boa sorte, Ghosts. Dispensados.', classe: 'sign-off typing-effect' }
            ]
        }
    });
})(window.GRB);
