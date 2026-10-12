/* ==========================================================================
   MISSÃO 02 — OPORD-002: COLD ORE
   Todo o conteúdo da missão. As páginas (hubs e dossiês) são montadas a partir daqui.

   GRB.papel('squad', 'gm')  -> texto diferente para Ghost Squad e Ghost Lead (GM)
   GRB.soGm(...)             -> aparece só nas páginas do GM
   GRB.soSquad(...)          -> aparece só nas páginas do Squad
   ========================================================================== */
(function (GRB) {
    'use strict';

    var papel = GRB.papel;
    var soGm = GRB.soGm;
    var soSquad = GRB.soSquad;

    GRB.registrarMissao({
        imagens: '../../assets/missao-02/',
        audio: '../../assets/missao-02/audio/briefing_cold_ore.mp3',

        // ------------------------------------------------------------------
        // HUB (lore_hub.html = Squad / lore_hub_gm.html = GM)
        // ------------------------------------------------------------------
        hub: {
            tituloPagina: papel('OPORD-002: Cold Ore - Lore & Briefing', '[OVERLORD] OPORD-002: Cold Ore - Hub do GM'),
            titulo: papel('OPERAÇÃO: COLD ORE', 'OVERLORD: COLD ORE'),
            cabecalho: [
                ['DE', papel('CENTRO DE COMANDO TÁTICO (OVERLORD)', 'COMANDO CENTRAL (VOCÊ)')],
                ['PARA', papel('ESQUADRÃO GHOST', 'ESQUADRÃO GHOST (CAMPO)')],
                ['LOCALIZAÇÃO', 'MOUNT HODGSON, AUROA']
            ],
            aviso: papel('&gt;&gt; UPLINK SEGURO ESTABELECIDO...', '&gt;&gt; UPLINK MESTRE ESTABELECIDO...'),

            briefing: [
                'Senhores, a Inteligência confirmou nossos piores temores. O inimigo ativou um complexo logístico focado na extração e transporte de minérios essenciais para a fabricação em massa de drones autônomos. A cadeia logística de "Cold Ore" já está operando a todo vapor em um dos cumes mais hostis de Auroa.',
                'Vocês serão inseridos na face congelada da cordilheira, à sombra de uma gigantesca ponte metálica. O frio cortante será o menor de seus problemas: bloqueios de sinal pesados naquela altitude inutilizaram todo o suporte de drones e mapeamento aéreo da equipe no momento da queda.',
                { galeria: [
                    { img: 'squad_sat_ponte.jpg', larga: true, titulo: 'Ponto de Inserção', legenda: 'Vista aérea da ponte metálica.', alt: 'Vista aérea da ponte metálica',
                      zoom: '[INTEL 001] Ponto de Inserção - A colossal estrutura metálica facilita a travessia, mas a densidade da área causa bloqueio total de sinal.' }
                ] },
                'Se quiserem "olhos no céu" durante a incursão, terão que invadir a zona de testes montanhosa por conta própria e montar um equipamento a partir de componentes sobressalentes deixados nas antigas estações da Skell Tech. A escolha é de vocês: percam tempo recuperando os sensores, ou executem a operação inteira completamente cegos.',
                'Sua missão possui duas frentes críticas. A primeira é investigativa: o processamento pesado e irresponsável da Sentinel causou um vazamento químico severo na região montanhosa. Precisamos que rastreiem esse fluxo de contaminação e coletem dados de toxidade nas principais fontes de água que cruzam as instalações.',
                'A segunda frente é sabotagem pura. O alvo principal são as três instalações que formam a espinha dorsal logística do minério. O material que sai dessas correias está alimentando diretamente a linha de montagem das máquinas que a Sentinel usa para nos caçar. Vocês devem descer a montanha, invadir os complexos, paralisar as esteiras e destruir o maquinário. Cortem a matéria-prima na fonte. Adicionalmente, se encontrarem inteligência militar ou diagramas de armamento com os oficiais locais, recuperem como alvo de oportunidade.'
            ],

            documentos: [
                { configuracoes: true, rotulo: '⚙️ CONFIGURAÇÕES', dica: 'Parâmetros de Imersão e Loadout' },
                { rotulo: '📄 CONFIDENCIAL', href: 'briefing_tatico.html', dica: 'OPORD-002: Execução Tática (Esquadrão)' },
                { rotulo: '📖 INTELIGÊNCIA', href: 'doc_skell_agua.html', dica: 'Relatório Interceptado (Skell Tech)' },
                soGm({ rotulo: '📄 DOSSIÊ GM', href: 'relatorio_gm.html', dica: 'Dossiê de Arbitragem (GM)', estilo: 'amber' })
            ],

            script: soGm({
                evento: 'EVENTO AZRAEL (Tensão Térmica):',
                paragrafos: [
                    'Ao se aproximarem do Complexo de Processamento (ou se o ritmo da missão estiver muito calmo), acione seu rádio no Discord e anuncie: <em>"Atenção Ghost 1-1, satélites detectaram assinatura de calor e rotas de patrulha Azrael na sua malha. Disciplina de luz e som rigorosa."</em>',
                    'Mecanicamente: Você (como GM in-game) pode lançar drones de sincronização no ar ou apenas forçar o esquadrão a rastejar na neve por alguns minutos, criando paranóia.'
                ]
            }),

            objetivos: [
                {
                    titulo: '// OBJETIVOS PRIMÁRIOS',
                    itens: [
                        {
                            titulo: 'AMOSTRAS DE ÁGUA (SKELL TECH):',
                            texto: papel('Coletar dados de toxidade nos 3 focos de vazamento:', 'Monitorar se o Squad coleta os dados nos 3 focos de vazamento:'),
                            sub: [
                                { rotulo: 'Reservatório Principal:', texto: 'Localizado dentro do Complexo de Extrações.', galeria: [
                                    { img: 'squad_water_reservatorio.jpg', larga: true, titulo: 'Amostra 01', legenda: 'Área Industrial (Reservatório)', alt: 'Reservatório principal',
                                      zoom: '[AMOSTRA 01] Reservatório Principal - Instalações da Sentinel apresentam vazamento químico intenso na água.' }
                                ] },
                                { rotulo: 'Lago Alice:', texto: 'Imediatamente a Leste do Complexo de Extrações.', galeria: [
                                    { img: 'squad_water_lago_alice.jpg', larga: true, titulo: 'Amostra 02', legenda: 'Margem do Lago Alice', alt: 'Margem do Lago Alice',
                                      zoom: '[AMOSTRA 02] Lago Alice - Águas congeladas a leste do complexo. Ponto isolado e ermo.' }
                                ] },
                                { rotulo: 'Dove Stream:', texto: 'Imediatamente ao Sul da Mina do Pico Bald.', galeria: [
                                    { img: 'squad_water_dove_stream.jpg', larga: true, titulo: 'Amostra 03', legenda: 'Corredeiras (Dove Stream)', alt: 'Corredeiras do Dove Stream',
                                      zoom: '[AMOSTRA 03] Dove Stream - Riacho de fluxo rápido. Contaminação descendo da Mina Pico Bald.' }
                                ] }
                            ]
                        },
                        {
                            titulo: 'SABOTAGEM LOGÍSTICA (COLD ORE):',
                            texto: papel('Destruir e inutilizar a infraestrutura de extração inimiga em três áreas distintas:', 'O esquadrão deve destruir a infraestrutura inimiga em três áreas distintas:'),
                            sub: [
                                { rotulo: 'Mina Vale Silent:', texto: 'Instalar C4 nas 5 esteiras transportadoras e na antena de comunicação.', galeria: [
                                    { img: 'squad_target_vale_silent.jpg', titulo: 'Topografia', legenda: 'Mina Vale Silent', alt: 'Topografia da Mina Vale Silent',
                                      zoom: '[SABOTAGEM] Mina Vale Silent: Escaneamento via satélite revelando pátios industriais na encosta sul.' },
                                    { img: 'squad_target_vale_silent_antenna.jpg', titulo: 'Alvo Primário', legenda: 'Antena de Transmissão', alt: 'Antena de transmissão',
                                      zoom: '[SABOTAGEM] Antena de Comunicação: Ponto nevrálgico da transmissão logística. Destruição prioritária.' }
                                ] },
                                { rotulo: 'Complexo de Extrações:', texto: 'Destruir os 2 motores primários e interceptar o painel de controle.', galeria: [
                                    { img: 'squad_target_processamento.jpg', titulo: 'Vista Isométrica', legenda: 'Complexo de Extrações', alt: 'Vista isométrica do Complexo de Extrações',
                                      zoom: '[SABOTAGEM] Complexo de Extrações: Arquitetura central abrigando as correias de transporte de minério bruto.' },
                                    { img: 'squad_target_processamento_panel_building.jpg', titulo: 'Anexo de Controle', legenda: 'Edifício Secundário', alt: 'Edifício secundário do painel',
                                      zoom: '[SABOTAGEM] Edifício do Painel: Construção de processamento eletrônico isolada a noroeste.' },
                                    { img: 'squad_target_processamento_panel.jpg', titulo: 'Alvo Primário', legenda: 'Painel Eletrônico Mestre', alt: 'Painel eletrônico mestre',
                                      zoom: '[SABOTAGEM] Painel Mestre: Necessário hackear para desestabilizar as esteiras de transporte.' }
                                ] },
                                { rotulo: 'Mina Pico Bald:', texto: 'Eliminar a infraestrutura destruindo 10 tambores inflamáveis e 2 silos de sílica.', galeria: [
                                    { img: 'squad_target_pico_bald.jpg', larga: true, titulo: 'Topografia', legenda: 'Mina Pico Bald', alt: 'Topografia da Mina Pico Bald',
                                      zoom: '[SABOTAGEM] Mina Pico Bald: Visão panorâmica dos silos de alta periculosidade instalados pela Sentinel.' },
                                    { img: 'squad_target_pico_bald_silos.jpg', titulo: 'Alvo Primário', legenda: 'Silos de Sílica', alt: 'Silos de sílica',
                                      zoom: '[SABOTAGEM] Silos de Sílica: Depósitos maciços de material volátil para processamento industrial.' },
                                    { img: 'squad_target_pico_bald_fuel_drum.jpg', titulo: 'Alvo Primário', legenda: 'Tambores Inflamáveis', alt: 'Tambores inflamáveis',
                                      zoom: '[SABOTAGEM] Tambores de Combustível: Clusters inflamáveis altamente instáveis na base da montanha.' },
                                    { img: 'squad_target_pico_bald_generator.jpg', titulo: 'Alvo Tático', legenda: 'Gerador Motorizado', alt: 'Gerador motorizado',
                                      zoom: '[SABOTAGEM] Gerador Local: Destruir o motor interromperá todo o processamento autônomo da área.' }
                                ] }
                            ]
                        }
                    ]
                },
                {
                    titulo: '// OBJETIVOS SECUNDÁRIOS (OPCIONAIS)',
                    cor: 'amber',
                    itens: [
                        {
                            titulo: 'ESTAÇÃO W041 E LAGO FORTUNE:',
                            texto: papel(
                                'Para reestabelecer suporte de drones, recuperar 4 peças sobressalentes (Bateria, Hélices, Sensores e Carcaça) na região inicial.',
                                'Para reestabelecer suporte de drones, o esquadrão deve recuperar 4 peças sobressalentes (Bateria, Hélices, Sensores e Carcaça).'
                            ),
                            galeria: [
                                { img: 'squad_recon_fortune_lake_batteries.jpg', titulo: 'Peça 01', legenda: 'Baterias do Drone', alt: 'Baterias do drone',
                                  zoom: '[DRONE RECON] Célula de Energia: Baterias militares dispersadas pela queda.' },
                                { img: 'squad_recon_fortune_lake_body_propellers.jpg', titulo: 'Peças 02 e 03', legenda: 'Carcaça e Hélices', alt: 'Carcaça e hélices do drone',
                                  zoom: '[DRONE RECON] Estrutura: Carcaça principal e rotores (hélices) sobreviventes.' },
                                { img: 'squad_recon_fortune_lake_sensors.jpg', titulo: 'Peça 04', legenda: 'Sensores Ópticos', alt: 'Sensores ópticos do drone',
                                  zoom: '[DRONE RECON] Óptica Avançada: Módulo de sensores intacto nas proximidades do Lago Fortune.' }
                            ],
                            sub: [
                                {
                                    rotulo: 'Overlord:',
                                    texto: papel(
                                        'Diagramas do drone Murmur transmitidos. <strong class="text-amber">A calibração exige estabilidade. Satélites apontam um Bivaque seguro entre a Mina Vale Silent e o Complexo de Extrações Químicas.</strong>',
                                        'Diagramas do drone Murmur. <strong class="text-danger">[REGRA DO GM] Montagem exclusiva em Bivaque (Local sugerido: Bivaque Vale Fugitives, entre a Mina Vale Silent e o Complexo de Extrações Químicas).</strong>'
                                    ),
                                    galeria: [
                                        { img: '../../assets/game/murmur/murmur_diagrama_2.jpg', natural: true, titulo: 'Documento Técnico', legenda: 'Diagrama de Montagem', alt: 'Diagrama de montagem do drone Murmur',
                                          zoom: '[INTEL OVERLORD] Diagrama Técnico do Drone Murmur. Instruções de montagem da fiação e calibração óptica.' },
                                        { img: '../../assets/game/murmur/murmur_diagrama_4.jpg', natural: true, titulo: 'Projeção Visual', legenda: 'Drone Montado', alt: 'Drone Murmur montado',
                                          zoom: '[INTEL OVERLORD] Projeção: Drone Murmur totalmente montado, calibrado e operacional para suporte aéreo.' }
                                    ]
                                }
                            ]
                        },
                        {
                            titulo: 'DIAGRAMA DE ARMAMENTO:',
                            texto: papel(
                                'Localizar e recuperar o diagrama (blueprint) de um fuzil de precisão de última geração na Mina Pico Bald para viabilizar sua produção em série no centro de comando.',
                                'Monitorar o esquadrão na localização e recuperação do diagrama (blueprint) do fuzil de precisão de última geração na Mina Pico Bald.'
                            ),
                            galeria: [
                                { img: 'squad_recon_blueprint.jpg', natural: true, centro: true, titulo: 'Material Confidencial', legenda: 'Diagrama de Rifle de Precisão', alt: 'Diagrama do rifle de precisão',
                                  zoom: '[INTEL VAZADA] Diagrama Estrutural: Especificações completas do rifle de precisão, encontrado em posse de oficiais.' }
                            ]
                        }
                    ]
                },
                {
                    titulo: '// PROTOCOLO DE EXTRAÇÃO (EXFIL)',
                    intro: 'A extração só será autorizada após a confirmação da destruição da infraestrutura logística inimiga.',
                    itens: [
                        {
                            titulo: 'PONTO DE ENCONTRO (RV): Bivaque Serrania STAG',
                            galeria: [
                                { img: 'squad_exfil_stag.jpg', larga: true, titulo: 'Ponto de Encontro (RV)', legenda: 'Bivaque Serrania STAG', alt: 'Bivaque Serrania STAG',
                                  zoom: '[EXFILTRAÇÃO] Bivaque Serrania STAG: Local seguro para reagrupamento da equipe após a destruição dos alvos.' }
                            ]
                        }
                    ]
                }
            ],

            // Imagens de gabarito do GM (arquivos ainda não adicionados em assets/missao-02/)
            gabaritos: soGm([
                { img: 'gm_infil_enemies.jpg', titulo: 'PATRULHAS INICIAIS (LAGO)', zoom: 'Gabarito: Inimigos na Infiltração', descricao: 'Mapa marcando patrulhas Murmur iniciais.' },
                { img: 'gm_drone_baterias.jpg', titulo: 'DRONE: BATERIAS', zoom: 'Gabarito: Baterias do Drone', descricao: 'Gabarito exato: Onde estão as Baterias do Drone.' },
                { img: 'gm_drone_sensores.jpg', titulo: 'DRONE: SENSORES', zoom: 'Gabarito: Sensores do Drone', descricao: 'Gabarito exato: Onde estão os Sensores do Drone.' },
                { img: 'gm_drone_carcaca.jpg', titulo: 'DRONE: CARCAÇA', zoom: 'Gabarito: Carcaça do Drone', descricao: 'Gabarito exato: Onde está a Carcaça.' },
                { img: 'gm_drone_helices.jpg', titulo: 'DRONE: HÉLICES', zoom: 'Gabarito: Hélices do Drone', descricao: 'Gabarito exato: Onde estão as Hélices.' },
                { img: 'gm_obj1_c4_targets.jpg', titulo: 'ALVOS C4 (VALE SILENT)', zoom: 'Gabarito: Esteiras e Antena (Vale Silent)', descricao: 'Setas indicando as 5 esteiras e antena para C4.' },
                { img: 'gm_obj1_snipers.jpg', titulo: 'SNIPERS (VALE SILENT)', zoom: 'Gabarito: Ninhos de Sniper (Vale Silent)', descricao: 'Posições de ninhos de franco-atiradores inimigos.' },
                { img: 'gm_obj2_rotas_seguras.jpg', titulo: 'ROTAS SEGURAS (FASE 2)', zoom: 'Gabarito: Rotas de Transição', descricao: 'Rotas mapeadas para o Bivaque Vale Fugitives.' },
                { img: 'gm_obj3_motores.jpg', titulo: 'MOTORES (COMPLEXO)', zoom: 'Gabarito: Motores no Complexo', descricao: 'Localização exata dos 2 motores (Complexo de Extrações).' },
                { img: 'gm_obj3_paineis.jpg', titulo: 'PAINÉIS (COMPLEXO)', zoom: 'Gabarito: Painéis Eletrônicos', descricao: 'Posição do painel no 2º andar do prédio da sucata.' },
                { img: 'gm_obj3_heavy_armor.jpg', titulo: 'TROPAS PESADAS (COMPLEXO)', zoom: 'Gabarito: Inimigos Pesados', descricao: 'Onde os Wolves/Pesados ficam agrupados.' },
                { img: 'gm_agua_reservatorio.jpg', titulo: 'ÁGUA: RESERVATÓRIO', zoom: 'Gabarito: Ponto Granada Reservatório', descricao: 'Marcação de onde a granada informativa deve cair.' },
                { img: 'gm_agua_lago_alice.jpg', titulo: 'ÁGUA: LAGO ALICE', zoom: 'Gabarito: Ponto Granada Lago Alice', descricao: 'Gabarito do ponto de granada no Lago Alice.' },
                { img: 'gm_agua_dove_stream.jpg', titulo: 'ÁGUA: DOVE STREAM', zoom: 'Gabarito: Ponto Granada Dove Stream', descricao: 'Gabarito do ponto de granada no Dove Stream.' },
                { img: 'gm_obj4_tambores.jpg', titulo: 'TAMBORES (PICO BALD)', zoom: 'Gabarito: Tambores Pico Bald', descricao: 'Posição exata dos 10 tambores inflamáveis.' },
                { img: 'gm_obj4_silos.jpg', titulo: 'SILOS (PICO BALD)', zoom: 'Gabarito: Silos Sílica Pico Bald', descricao: 'Onde ficam os 2 Silos de Sílica.' },
                { img: 'gm_obj4_rifle_loot.jpg', titulo: 'LOOT RIFLE VIP', zoom: 'Gabarito: Localização do Rifle VIP', descricao: 'A caixa exata contendo o Rifle de Precisão.' },
                { img: 'gm_azrael_patrols.jpg', titulo: 'ROTAS AZRAEL (SCRIPT)', zoom: 'Gabarito: Zonas de Azrael', descricao: 'Rota provável de passagem de drones Azrael.' },
                { img: 'gm_reinforcements.jpg', titulo: 'SPAWN DE REFORÇOS', zoom: 'Gabarito: Spawns de Reforço Inimigo', descricao: 'Onde helicópteros/carros de reforço vão surgir.' },
                { img: 'gm_exfil_route.jpg', titulo: 'ROTA DE EXFILTRAÇÃO', zoom: 'Gabarito: Melhor Rota de Fuga', descricao: 'Rota mais dramática e cheia de inimigos para fuga.' }
            ])
        },

        // ------------------------------------------------------------------
        // CONFIGURAÇÕES DE IMERSÃO (modal ⚙️ dos hubs)
        // ------------------------------------------------------------------
        configuracoes: [
            { rotulo: 'Interface (HUD) e Teclado', texto: 'Desabilitar atalho de drone e visão térmica. HUD no modo Personalizado/Extremo: Retículo, Energia, Arma e Técnica NUNCA. Marcadores NUNCA.' },
            { rotulo: 'Ponto de Entrada', texto: 'Bivaque Lago Fortune (Fortune Lake) entre 06:00 e 08:00 da manhã.' },
            { rotulo: 'Transporte (Logística)', texto: 'Viagem rápida e Helicópteros PROIBIDOS. Motocicletas conjuradas permitidas nos Bivaques. Carros podem ser roubados se encontrados.' },
            { rotulo: 'Camuflagem Fase 1 (Neve)', aviso: '[!] PROIBIDO OVN', camuflagens: [
                { img: 'all-white.png', nome: 'Branco Sólido', partes: 'Cabeça, Coletes, Mochila' },
                { img: 'kryptek-yeti.png', nome: 'Kryptek Yeti', partes: 'Calças, Torso, Máscara, Armas' },
                { img: 'all-grey.png', nome: 'Cinza Sólido', partes: 'Mãos, Calçados' }
            ] },
            { rotulo: 'Camuflagem Fase 2+ (Urbano)', aviso: '[!] PROIBIDO OVN', camuflagens: [
                { img: 'all-black.png', nome: 'Preto Sólido', partes: 'Coletes, Mãos, Calçados, Armas' },
                { img: 'erdl-urban.png', nome: 'ERDL Urbano', partes: 'Calças, Torso, Mochila' },
                { img: 'all-grey.png', nome: 'Cinza Sólido', partes: 'Máscara' }
            ] },
            { rotulo: 'Regras de Sobrevivência', texto: 'Squad Wipe total encerra a missão. Somente a classe Medic pode reviver aliados abatidos.' }
        ],

        // ------------------------------------------------------------------
        // DOCUMENTOS (dossiês em papel)
        // ------------------------------------------------------------------
        documentos: {

            // briefing_tatico.html (Squad) / relatorio_gm.html (GM)
            tatico: {
                tituloPagina: papel('OPORD-002: Cold Ore - Briefing Tático (Ghost Squad)', 'OPORD-002: Cold Ore - DOSSIÊ OVERLORD (RESTRITO)'),
                marcaDagua: papel('CONFIDENCIAL // USO RESTRITO', 'USO RESTRITO GHOST LEAD'),
                carimbo: papel('ULTRA SECRETO - APENAS GHOST SQUAD', 'SOMENTE LEITURA GHOST 1-1 / OVERLORD'),
                titulo: papel('GRB-INTEL-OPORD-002: COLD ORE', 'GRB-INTEL-OPORD-002: DOSSIÊ GM'),
                cabecalho: [
                    ['OPERAÇÃO', 'COLD ORE (MINÉRIO GELADO)'],
                    ['LOCALIZAÇÃO', 'ARQUIPÉLAGO DE AUROA // MOUNT HODGSON'],
                    ['AUTORIZAÇÃO', papel('APENAS PARA ESQUADRÃO GHOST', 'CONTROLE GM ATIVO // APENAS PARA ESQUADRÃO GHOST')],
                    soGm(['ALERTA DE SEGURANÇA', 'O CONTEÚDO A SEGUIR DITARÁ AS REGRAS DE ARBITRAGEM E COMPLICAÇÕES DA SESSÃO. NÃO COMPARTILHAR COM OS OPERADORES 1-2, 1-3 OU 1-4.'])
                ],
                aviso: soSquad('&gt;&gt; TRANSMISSÃO CRIPTOGRAFADA RECEBIDA...'),
                secoes: [
                    {
                        titulo: papel('1. ANÁLISE DE VIABILIDADE E REGRAS TÁTICAS', '1. ANÁLISE DE VIABILIDADE E ARBITRAGEM DO GM'),
                        blocos: [
                            { linhas: [
                                papel(
                                    '- <strong>Missão Secundária (Drone):</strong> O drone não pode ser utilizado por nenhum método antes da recuperação dos componentes. Só se torna operacional após recuperar Baterias, Sensores, Carcaça e Hélices.',
                                    '- <strong>Missão Secundária (Drone):</strong> O drone não pode ser utilizado por nenhum método antes da recuperação das 4 peças (Baterias, Sensores, Carcaça, Hélices) e do retorno físico a um Bivaque (Regra Externa do GM).'
                                ),
                                papel(
                                    '- <strong>Validação de Explosivos:</strong> C4 deve ser plantado diretamente no alvo e detonado. A PEM deve ser lançada visualmente sobre o painel.',
                                    '- <strong>Validação de Explosivos (GM):</strong> Não exigir confirmação visual de destruição do objeto ambiental. O C4 deve ser plantado diretamente no alvo e detonado de fato (ex: 5 esteiras = 5 cargas distintas). A PEM deve ser lançada visualmente sobre o painel.'
                                ),
                                papel(
                                    '- <strong>Amostras de Água:</strong> O esquadrão deve obrigatoriamente realizar a análise fisicamente lançando uma granada informativa em cada ponto (Reservatório, Lago Alice e Dove Stream).',
                                    '- <strong>Amostras de Água (GM):</strong> O esquadrão deve obrigatoriamente realizar a análise fisicamente lançando uma granada informativa em cada ponto distinto (Reservatório, Lago Alice e Dove Stream).'
                                ),
                                soGm('- <strong>Regras de Sobrevivência (GM):</strong> Squad Wipe total encerra a missão, reset total. O GM pode invalidar ações que burlem a proposta tática (exploits).')
                            ] }
                        ]
                    },
                    {
                        titulo: '2. EXECUÇÃO TÁTICA (PASSO A PASSO)',
                        blocos: [
                            { h3: 'OBJETIVO 1: MINA DO VALE SILENT (Extração)' },
                            'Prioridade em infiltração, reconhecimento e sabotagem.',
                            { lista: [
                                'Explodir 5 esteiras de extração de Bauxita (5x C4).',
                                soGm('Fritar os circuitos do painel de controle (1x Granada PEM).'),
                                'Explodir a antena de comunicações (1x C4 na base da antena).'
                            ] },

                            { h3: 'OBJETIVO 2: TRANSIÇÃO LOGÍSTICA (Bivaque Vale Fugitives)' },
                            'Alcançar o Bivaque a pé ou com veículo orgânico (proibida viagem rápida). Trocar para camuflagem e armas urbanas (Padrão Preto/ERDL).',

                            { h3: 'OBJETIVO 3: COMPLEXO DE EXTRAÇÕES (Processamento)' },
                            'Prioridade em executar objetivos. Alarme escala a resposta (Alerta → Alarme → Reforços).',
                            { lista: [
                                'Explodir os motores no Complexo A (2x C4).',
                                'Fritar os painéis de controle no 2º andar do prédio da sucata (1x Granada PEM).',
                                'Analisar as 3 amostras de água lançando uma granada informativa no Reservatório, uma no Lago Alice e uma na nascente do Riacho da Pomba.'
                            ] },

                            { h3: 'OBJETIVO 4: MINA DO PICO BALD (Armazenamento e Exfiltração)' },
                            papel('Combate aberto aceito.', 'Combate aberto aceito após comprometimento dos objetivos.'),
                            { lista: [
                                'Explodir 10 tambores inflamáveis próximos ao gerador.',
                                'Bombardear 2 Silos de Sílica (Designator de Ataque).',
                                'Extrair o Rifle de Precisão de última geração.'
                            ] },
                            '<strong>PONTO DE EXTRAÇÃO:</strong> Bivaque Serrania STAG (Sul do Pico Bald, subir a nascente do Dove Stream até o pedregulho ao norte das Ruínas Antigas).'
                        ]
                    },
                    {
                        titulo: '3. MISSÃO SECUNDÁRIA: AQUISIÇÃO DE DRONE',
                        blocos: [
                            { linhas: [
                                '1. <strong>Baterias:</strong> Sul do ponto de entrada (Fortune Lake), Área de Patrulha Murmur.',
                                '2. <strong>Sensores:</strong> Sudeste do ponto de entrada, Estação Meteorológica (Mystery Peak).',
                                '3. <strong>Carcaça:</strong> Norte do ponto de entrada, Estação de Drones W041, prédio principal entre duas antenas.',
                                '4. <strong>Hélices:</strong> Estação de Drones W041, prédio secundário próximo ao heliponto.'
                            ] }
                        ]
                    },
                    soGm({
                        titulo: '4. EVENTOS OPCIONAIS / COMPLICAÇÕES DO GM (SEÇÃO 6)',
                        cor: 'perigo',
                        blocos: [
                            { callout: 'Como GM, você deve invocar estas complicações baseadas nos GATILHOS descritos.', perigo: true },
                            { complicacoes: [
                                { nome: 'Interdição de Rota',
                                  gatilho: 'Quando o esquadrão planeja o deslocamento entre objetivos.',
                                  acao: 'Determina que a rota principal ou o vale mais direto está bloqueado por patrulhas pesadas ou obstáculos intransponíveis reais do terreno.',
                                  resposta: 'Reavaliar a topografia no mapa e escolher uma nova rota de marcha a pé.' },
                                { nome: 'Aumento de Presença Inimiga',
                                  gatilho: 'Antes da infiltração em um complexo.',
                                  acao: 'Declara que a guarnição local foi reforçada, utilizando patrulhas adicionais ou drones de reconhecimento que já patrulham o perímetro.',
                                  resposta: 'Adotar uma infiltração ainda mais lenta, priorizar eliminações silenciosas ou desviar de sentinelas.' },
                                { nome: 'Mudança de Prioridade Operacional',
                                  gatilho: 'Durante a execução do Objetivo 2 ou Objetivo 3.',
                                  acao: 'Introduz um objetivo secundário opcional relevante, como recuperar inteligência em um terminal inimigo próximo.',
                                  resposta: 'Decidir se desviam recursos e tempo para arriscar o objetivo secundário.' },
                                { nome: 'Janela Operacional Reduzida',
                                  gatilho: 'Ao iniciar um novo objetivo estratégico.',
                                  acao: 'Estabelece uma pressão narrativa de tempo, declarando que forças de reação rápida inimigas estão se mobilizando na região.',
                                  resposta: 'Executar os alvos com maior agilidade e assertividade.' },
                                { nome: 'Posição Comprometida',
                                  gatilho: 'Após o esquadrão ser descoberto ou gerar suspeita prolongada em um ponto.',
                                  acao: 'Declara que a posição de tiro ou o abrigo atual foi totalmente comprometido pela inteligência inimiga.',
                                  resposta: 'Realizar uma quebra de contato imediata e recuar.' },
                                { nome: 'Recurso Comprometido',
                                  gatilho: 'Na transição entre objetivos ou no reabastecimento de Bivaque.',
                                  acao: 'Impõe uma limitação narrativa sobre o uso de suprimentos, declarando que parte do inventário foi danificada.',
                                  resposta: 'Gerenciar rigorosamente os explosivos restantes.' },
                                { nome: 'Escolha de Rota Tática',
                                  gatilho: 'Ao se aproximar de uma área industrial ou montanhosa.',
                                  acao: 'Apresenta duas alternativas de abordagem visíveis no terreno do jogo (ex: o acesso frontal pavimentado vs a encosta rochosa íngreme).',
                                  resposta: 'Analisar os riscos de exposição e decidir conjuntamente qual caminho seguir.' },
                                { nome: 'Pressão na Extração',
                                  gatilho: 'Após a conclusão dos objetivos principais, durante o deslocamento rumo ao ponto de extração.',
                                  acao: 'Intensifica a presença de patrulhas móveis inimigas ao longo do trajeto final mapeado.',
                                  resposta: 'Avançar com extrema cautela até alcançar a nascente do Riacho da Pomba.' }
                            ] }
                        ]
                    })
                ],
                fim: papel('FIM DA TRANSMISSÃO - BOA CAÇADA, GHOSTS.', 'FIM DO DOSSIÊ OVERLORD. DESTRUA APÓS A LEITURA.'),
                carimboFim: papel('FIM DE RELATÓRIO', 'FIM DE RELATÓRIO DO GM')
            },

            // doc_skell_agua.html — documento interceptado (mesmo para Squad e GM)
            inteligencia: {
                tituloPagina: 'SKELL TECH: Relatório de Impacto Ambiental (Vazamento)',
                estilo: 'skell',
                voltar: { href: 'lore_hub.html', rotulo: 'RETORNAR AO HUB' },
                marcaDagua: 'SKELL TECH R&amp;D // CONFIDENCIAL',
                carimbo: 'SKELL TECH - ASSUNTOS INTERNOS',
                titulo: 'AVALIAÇÃO DE RISCO ECOLÓGICO: PROJETO COLD ORE',
                digitando: false,
                cabecalho: [
                    ['DE', 'DIRETORIA DE SUSTENTABILIDADE E HIDROLOGIA DA SKELL TECH'],
                    ['PARA', 'COMANDO CENTRAL DA SENTINEL CORP.'],
                    ['ASSUNTO', 'CONTAMINAÇÃO DO LENÇOL FREÁTICO NO MOUNT HODGSON']
                ],
                aviso: '&gt;&gt; DOCUMENTO INTERCEPTADO PELA INTELIGÊNCIA GHOST...',
                secoes: [
                    {
                        titulo: '1. RESUMO EXECUTIVO DO PROBLEMA',
                        blocos: [
                            'O recente aumento na extração e processamento de Bauxita nas instalações da Mina do Vale Silent e do Complexo de Extrações gerou um subproduto químico altamente tóxico. Nossa análise hidrológica confirma que os resíduos não estão sendo devidamente contidos nos reservatórios de decantação. O vazamento atingiu níveis críticos.'
                        ]
                    },
                    {
                        titulo: '2. VETORES DE CONTAMINAÇÃO (FOCOS)',
                        blocos: [
                            'O subproduto refinado do minério infiltrou-se no lençol freático local, contaminando as três principais fontes de água que abastecem as comunidades civis das províncias ao sul. As medições mais recentes indicam toxidade letal aguda nos seguintes pontos críticos:',
                            { lista: [
                                '<strong>PONTO ALFA: O Reservatório Principal</strong> (Imediatamente abaixo do Complexo de Extrações).',
                                '<strong>PONTO BRAVO: Lago Alice</strong> (Sistema de escoamento secundário).',
                                '<strong>PONTO CHARLIE: Nascente do Dove Stream</strong> (Canal de distribuição para as áreas baixas).'
                            ] }
                        ]
                    },
                    {
                        titulo: '3. CONSEQUÊNCIAS E DIRETRIZ SENTINEL',
                        blocos: [
                            'O consumo desta água pela população local resultará em falência múltipla de órgãos em 72 horas. O comando da Sentinel emitiu ordens não documentadas para abafar o caso e continuar a produção de blindagens de drones ininterruptamente, ignorando os protocolos da Skell Tech de evacuação e purificação.',
                            '<em>Aviso aos Operadores Ghost: Para que possamos sintetizar um purificador em Erewhon e evitar um massacre civil, precisamos de amostras físicas imediatas. Infiltrem os três focos de contaminação e ativem sensores de análise diretamente na água.</em>'
                        ]
                    }
                ],
                fim: 'DOCUMENTO CORPORATIVO SKELL TECH. A DIVULGAÇÃO DESTE RELATÓRIO RESULTARÁ EM DEMISSÃO POR JUSTA CAUSA E PROCESSO LEGAL.',
                fimPequeno: true
            }
        }
    });
})(window.GRB);
