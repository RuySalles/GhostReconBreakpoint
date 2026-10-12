/* ==========================================================================
   MISSÃO 02 — OPORD-002: COLD ORE
   Todo o conteúdo da missão. As páginas (hubs e dossiês) são montadas a partir daqui.

   O conteúdo do Ghost Lead (GM) fica em missao-gm.js — os jogadores baixam ESTE arquivo.
   GRB.gm('chave')                       -> lugar de um conteúdo do GM (valor no missao-gm.js)
   GRB.papel('texto Squad', GRB.gm('chave')) -> versão diferente para Squad e GM
   GRB.soSquad(...)                       -> aparece só nas páginas do Squad
   ========================================================================== */
(function (GRB) {
    'use strict';

    var papel = GRB.papel;
    var gm = GRB.gm;
    var soSquad = GRB.soSquad;

    GRB.registrarMissao({
        imagens: 'imagens/',
        audio: 'audio/briefing_cold_ore.mp3',

        // ------------------------------------------------------------------
        // HUB (hub.html = Squad / hub-gm.html = GM)
        // ------------------------------------------------------------------
        hub: {
            tituloPagina: papel('OPORD-002: Cold Ore - Lore & Briefing', gm('hub.tituloPagina')),
            titulo: papel('OPERAÇÃO: COLD ORE', gm('hub.titulo')),
            cabecalho: [
                ['DE', papel('CENTRO DE COMANDO TÁTICO (OVERLORD)', gm('hub.de'))],
                ['PARA', papel('ESQUADRÃO GHOST', gm('hub.para'))],
                ['LOCALIZAÇÃO', 'MOUNT HODGSON, AUROA']
            ],
            aviso: papel('&gt;&gt; UPLINK SEGURO ESTABELECIDO...', gm('hub.aviso')),

            briefing: [
                'Senhores, a Inteligência confirmou nossos piores temores. O inimigo ativou um complexo logístico focado na extração e transporte de minérios essenciais para a fabricação em massa de drones autônomos. A cadeia logística de "Cold Ore" já está operando a todo vapor em um dos cumes mais hostis de Auroa.',
                'Vocês serão inseridos na face congelada da cordilheira, à sombra de uma gigantesca ponte metálica. O frio cortante será o menor de seus problemas: bloqueios de sinal pesados naquela altitude inutilizaram todo o suporte de drones e mapeamento aéreo da equipe no momento da queda.',
                { galeria: [
                    { img: 'squad_sat_ponte.webp', larga: true, titulo: 'Ponto de Inserção', legenda: 'Vista aérea da ponte metálica.', alt: 'Vista aérea da ponte metálica',
                      zoom: '[INTEL 001] Ponto de Inserção - A colossal estrutura metálica facilita a travessia, mas a densidade da área causa bloqueio total de sinal.' }
                ] },
                'Se quiserem "olhos no céu" durante a incursão, terão que invadir a zona de testes montanhosa por conta própria e montar um equipamento a partir de componentes sobressalentes deixados nas antigas estações da Skell Tech. A escolha é de vocês: percam tempo recuperando os sensores, ou executem a operação inteira completamente cegos.',
                'Sua missão possui duas frentes críticas. A primeira é investigativa: o processamento pesado e irresponsável da Sentinel causou um vazamento químico severo na região montanhosa. Precisamos que rastreiem esse fluxo de contaminação e coletem dados de toxidade nas principais fontes de água que cruzam as instalações.',
                'A segunda frente é sabotagem pura. O alvo principal são as três instalações que formam a espinha dorsal logística do minério. O material que sai dessas correias está alimentando diretamente a linha de montagem das máquinas que a Sentinel usa para nos caçar. Vocês devem descer a montanha, invadir os complexos, paralisar as esteiras e destruir o maquinário. Cortem a matéria-prima na fonte. Adicionalmente, se encontrarem inteligência militar ou diagramas de armamento com os oficiais locais, recuperem como alvo de oportunidade.'
            ],

            documentos: [
                { configuracoes: true, rotulo: '⚙️ CONFIGURAÇÕES', dica: 'Parâmetros de Imersão e Loadout' },
                { rotulo: '📄 CONFIDENCIAL', href: 'dossie.html', dica: 'OPORD-002: Execução Tática (Esquadrão)' },
                { rotulo: '📖 INTELIGÊNCIA', href: 'intel-skell-agua.html', dica: 'Relatório Interceptado (Skell Tech)' },
                gm('hub.documentos.dossieGm')
            ],

            script: gm('hub.script'),

            objetivos: [
                {
                    titulo: '// OBJETIVOS PRIMÁRIOS',
                    itens: [
                        {
                            titulo: 'AMOSTRAS DE ÁGUA (SKELL TECH):',
                            texto: papel('Coletar dados de toxidade nos 3 focos de vazamento:', gm('hub.objetivos.agua')),
                            sub: [
                                { rotulo: 'Reservatório Principal:', texto: 'Localizado dentro do Complexo de Extrações.', galeria: [
                                    { img: 'squad_water_reservatorio.webp', larga: true, titulo: 'Amostra 01', legenda: 'Área Industrial (Reservatório)', alt: 'Reservatório principal',
                                      zoom: '[AMOSTRA 01] Reservatório Principal - Instalações da Sentinel apresentam vazamento químico intenso na água.' }
                                ] },
                                { rotulo: 'Lago Alice:', texto: 'Imediatamente a Leste do Complexo de Extrações.', galeria: [
                                    { img: 'squad_water_lago_alice.webp', larga: true, titulo: 'Amostra 02', legenda: 'Margem do Lago Alice', alt: 'Margem do Lago Alice',
                                      zoom: '[AMOSTRA 02] Lago Alice - Águas congeladas a leste do complexo. Ponto isolado e ermo.' }
                                ] },
                                { rotulo: 'Dove Stream:', texto: 'Imediatamente ao Sul da Mina do Pico Bald.', galeria: [
                                    { img: 'squad_water_dove_stream.webp', larga: true, titulo: 'Amostra 03', legenda: 'Corredeiras (Dove Stream)', alt: 'Corredeiras do Dove Stream',
                                      zoom: '[AMOSTRA 03] Dove Stream - Riacho de fluxo rápido. Contaminação descendo da Mina Pico Bald.' }
                                ] }
                            ]
                        },
                        {
                            titulo: 'SABOTAGEM LOGÍSTICA (COLD ORE):',
                            texto: papel('Destruir e inutilizar a infraestrutura de extração inimiga em três áreas distintas:', gm('hub.objetivos.sabotagem')),
                            sub: [
                                { rotulo: 'Mina Vale Silent:', texto: 'Instalar C4 nas 5 esteiras transportadoras e na antena de comunicação.', galeria: [
                                    { img: 'squad_target_vale_silent.webp', titulo: 'Topografia', legenda: 'Mina Vale Silent', alt: 'Topografia da Mina Vale Silent',
                                      zoom: '[SABOTAGEM] Mina Vale Silent: Escaneamento via satélite revelando pátios industriais na encosta sul.' },
                                    { img: 'squad_target_vale_silent_antenna.webp', titulo: 'Alvo Primário', legenda: 'Antena de Transmissão', alt: 'Antena de transmissão',
                                      zoom: '[SABOTAGEM] Antena de Comunicação: Ponto nevrálgico da transmissão logística. Destruição prioritária.' }
                                ] },
                                { rotulo: 'Complexo de Extrações:', texto: 'Destruir os 2 motores primários e interceptar o painel de controle.', galeria: [
                                    { img: 'squad_target_processamento.webp', titulo: 'Vista Isométrica', legenda: 'Complexo de Extrações', alt: 'Vista isométrica do Complexo de Extrações',
                                      zoom: '[SABOTAGEM] Complexo de Extrações: Arquitetura central abrigando as correias de transporte de minério bruto.' },
                                    { img: 'squad_target_processamento_panel_building.webp', titulo: 'Anexo de Controle', legenda: 'Edifício Secundário', alt: 'Edifício secundário do painel',
                                      zoom: '[SABOTAGEM] Edifício do Painel: Construção de processamento eletrônico isolada a noroeste.' },
                                    { img: 'squad_target_processamento_panel.webp', titulo: 'Alvo Primário', legenda: 'Painel Eletrônico Mestre', alt: 'Painel eletrônico mestre',
                                      zoom: '[SABOTAGEM] Painel Mestre: Necessário hackear para desestabilizar as esteiras de transporte.' }
                                ] },
                                { rotulo: 'Mina Pico Bald:', texto: 'Eliminar a infraestrutura destruindo 10 tambores inflamáveis e 2 silos de sílica.', galeria: [
                                    { img: 'squad_target_pico_bald.webp', larga: true, titulo: 'Topografia', legenda: 'Mina Pico Bald', alt: 'Topografia da Mina Pico Bald',
                                      zoom: '[SABOTAGEM] Mina Pico Bald: Visão panorâmica dos silos de alta periculosidade instalados pela Sentinel.' },
                                    { img: 'squad_target_pico_bald_silos.webp', titulo: 'Alvo Primário', legenda: 'Silos de Sílica', alt: 'Silos de sílica',
                                      zoom: '[SABOTAGEM] Silos de Sílica: Depósitos maciços de material volátil para processamento industrial.' },
                                    { img: 'squad_target_pico_bald_fuel_drum.webp', titulo: 'Alvo Primário', legenda: 'Tambores Inflamáveis', alt: 'Tambores inflamáveis',
                                      zoom: '[SABOTAGEM] Tambores de Combustível: Clusters inflamáveis altamente instáveis na base da montanha.' },
                                    { img: 'squad_target_pico_bald_generator.webp', titulo: 'Alvo Tático', legenda: 'Gerador Motorizado', alt: 'Gerador motorizado',
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
                            texto: papel('Para reestabelecer suporte de drones, recuperar 4 peças sobressalentes (Bateria, Hélices, Sensores e Carcaça) na região inicial.', gm('hub.secundarios.drone')),
                            galeria: [
                                { img: 'squad_recon_fortune_lake_batteries.webp', titulo: 'Peça 01', legenda: 'Baterias do Drone', alt: 'Baterias do drone',
                                  zoom: '[DRONE RECON] Célula de Energia: Baterias militares dispersadas pela queda.' },
                                { img: 'squad_recon_fortune_lake_body_propellers.webp', titulo: 'Peças 02 e 03', legenda: 'Carcaça e Hélices', alt: 'Carcaça e hélices do drone',
                                  zoom: '[DRONE RECON] Estrutura: Carcaça principal e rotores (hélices) sobreviventes.' },
                                { img: 'squad_recon_fortune_lake_sensors.webp', titulo: 'Peça 04', legenda: 'Sensores Ópticos', alt: 'Sensores ópticos do drone',
                                  zoom: '[DRONE RECON] Óptica Avançada: Módulo de sensores intacto nas proximidades do Lago Fortune.' }
                            ],
                            sub: [
                                {
                                    rotulo: 'Overlord:',
                                    texto: papel('Diagramas do drone Murmur transmitidos. <strong class="text-amber">A calibração exige estabilidade. Satélites apontam um Bivaque seguro entre a Mina Vale Silent e o Complexo de Extrações Químicas.</strong>', gm('hub.secundarios.droneOverlord')),
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
                            texto: papel('Localizar e recuperar o diagrama (blueprint) de um fuzil de precisão de última geração na Mina Pico Bald para viabilizar sua produção em série no centro de comando.', gm('hub.secundarios.armamento')),
                            galeria: [
                                { img: 'squad_recon_blueprint.webp', natural: true, centro: true, titulo: 'Material Confidencial', legenda: 'Diagrama de Rifle de Precisão', alt: 'Diagrama do rifle de precisão',
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
                                { img: 'squad_exfil_stag.webp', larga: true, titulo: 'Ponto de Encontro (RV)', legenda: 'Bivaque Serrania STAG', alt: 'Bivaque Serrania STAG',
                                  zoom: '[EXFILTRAÇÃO] Bivaque Serrania STAG: Local seguro para reagrupamento da equipe após a destruição dos alvos.' }
                            ]
                        }
                    ]
                }
            ],

            // Gabaritos do GM (imagens esperadas em imagens/gm_*.jpg — ainda não adicionadas)
            gabaritos: gm('hub.gabaritos')
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

            // dossie.html (Squad) / dossie-gm.html (GM)
            dossie: {
                tituloPagina: papel('OPORD-002: Cold Ore - Briefing Tático (Ghost Squad)', gm('dossie.tituloPagina')),
                marcaDagua: papel('CONFIDENCIAL // USO RESTRITO', gm('dossie.marcaDagua')),
                carimbo: papel('ULTRA SECRETO - APENAS GHOST SQUAD', gm('dossie.carimbo')),
                titulo: papel('GRB-INTEL-OPORD-002: COLD ORE', gm('dossie.titulo')),
                cabecalho: [
                    ['OPERAÇÃO', 'COLD ORE (MINÉRIO GELADO)'],
                    ['LOCALIZAÇÃO', 'ARQUIPÉLAGO DE AUROA // MOUNT HODGSON'],
                    ['AUTORIZAÇÃO', papel('APENAS PARA ESQUADRÃO GHOST', gm('dossie.autorizacao'))],
                    gm('dossie.alerta')
                ],
                aviso: soSquad('&gt;&gt; TRANSMISSÃO CRIPTOGRAFADA RECEBIDA...'),
                secoes: [
                    {
                        titulo: papel('1. ANÁLISE DE VIABILIDADE E REGRAS TÁTICAS', gm('dossie.secao1.titulo')),
                        blocos: [
                            { linhas: [
                                papel('- <strong>Missão Secundária (Drone):</strong> O drone não pode ser utilizado por nenhum método antes da recuperação dos componentes. Só se torna operacional após recuperar Baterias, Sensores, Carcaça e Hélices.', gm('dossie.secao1.drone')),
                                papel('- <strong>Validação de Explosivos:</strong> C4 deve ser plantado diretamente no alvo e detonado. A PEM deve ser lançada visualmente sobre o painel.', gm('dossie.secao1.explosivos')),
                                papel('- <strong>Amostras de Água:</strong> O esquadrão deve obrigatoriamente realizar a análise fisicamente lançando uma granada informativa em cada ponto (Reservatório, Lago Alice e Dove Stream).', gm('dossie.secao1.agua')),
                                gm('dossie.secao1.sobrevivencia')
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
                                gm('dossie.objetivo1.painelPem'),
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
                            papel('Combate aberto aceito.', gm('dossie.objetivo4.combate')),
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
                    gm('dossie.complicacoes')
                ],
                fim: papel('FIM DA TRANSMISSÃO - BOA CAÇADA, GHOSTS.', gm('dossie.fim')),
                carimboFim: papel('FIM DE RELATÓRIO', gm('dossie.carimboFim'))
            },

            // intel-skell-agua.html — documento interceptado (mesmo para Squad e GM)
            inteligencia: {
                tituloPagina: 'SKELL TECH: Relatório de Impacto Ambiental (Vazamento)',
                estilo: 'skell',
                voltar: { href: 'hub.html', rotulo: 'RETORNAR AO HUB' },
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
