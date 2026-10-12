/* ==========================================================================
   MISSÃO 02 — OPORD-002: COLD ORE — CONTEÚDO DO GHOST LEAD (GM)
   Carregado SÓ pelas páginas do GM (hub-gm.html e dossie-gm.html).
   Cada chave aqui corresponde a um GRB.gm('chave') no missao.js.
   Nada deste arquivo chega ao navegador dos jogadores pelas páginas do Squad.
   ========================================================================== */
(function (GRB) {
    'use strict';

    GRB.registrarGm({
        'hub.tituloPagina': '[OVERLORD] OPORD-002: Cold Ore - Hub do GM',

        'hub.titulo': 'OVERLORD: COLD ORE',

        'hub.de': 'COMANDO CENTRAL (VOCÊ)',

        'hub.para': 'ESQUADRÃO GHOST (CAMPO)',

        'hub.aviso': '&gt;&gt; UPLINK MESTRE ESTABELECIDO...',

        'hub.documentos.dossieGm': { rotulo: '📄 DOSSIÊ GM', href: 'dossie-gm.html', dica: 'Dossiê de Arbitragem (GM)', estilo: 'amber' },

        'hub.script': {
            evento: 'EVENTO AZRAEL (Tensão Térmica):',
            paragrafos: [
                'Ao se aproximarem do Complexo de Processamento (ou se o ritmo da missão estiver muito calmo), acione seu rádio no Discord e anuncie: <em>"Atenção Ghost 1-1, satélites detectaram assinatura de calor e rotas de patrulha Azrael na sua malha. Disciplina de luz e som rigorosa."</em>',
                'Mecanicamente: Você (como GM in-game) pode lançar drones de sincronização no ar ou apenas forçar o esquadrão a rastejar na neve por alguns minutos, criando paranóia.'
            ]
        },

        'hub.objetivos.agua': 'Monitorar se o Squad coleta os dados nos 3 focos de vazamento:',

        'hub.objetivos.sabotagem': 'O esquadrão deve destruir a infraestrutura inimiga em três áreas distintas:',

        'hub.secundarios.drone': 'Para reestabelecer suporte de drones, o esquadrão deve recuperar 4 peças sobressalentes (Bateria, Hélices, Sensores e Carcaça).',

        'hub.secundarios.droneOverlord': 'Diagramas do drone Murmur. <strong class="text-danger">[REGRA DO GM] Montagem exclusiva em Bivaque (Local sugerido: Bivaque Vale Fugitives, entre a Mina Vale Silent e o Complexo de Extrações Químicas).</strong>',

        'hub.secundarios.armamento': 'Monitorar o esquadrão na localização e recuperação do diagrama (blueprint) do fuzil de precisão de última geração na Mina Pico Bald.',

        'hub.gabaritos': [
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
        ],

        'dossie.tituloPagina': 'OPORD-002: Cold Ore - DOSSIÊ OVERLORD (RESTRITO)',

        'dossie.marcaDagua': 'USO RESTRITO GHOST LEAD',

        'dossie.carimbo': 'SOMENTE LEITURA GHOST 1-1 / OVERLORD',

        'dossie.titulo': 'GRB-INTEL-OPORD-002: DOSSIÊ GM',

        'dossie.autorizacao': 'CONTROLE GM ATIVO // APENAS PARA ESQUADRÃO GHOST',

        'dossie.alerta': ['ALERTA DE SEGURANÇA', 'O CONTEÚDO A SEGUIR DITARÁ AS REGRAS DE ARBITRAGEM E COMPLICAÇÕES DA SESSÃO. NÃO COMPARTILHAR COM OS OPERADORES 1-2, 1-3 OU 1-4.'],

        'dossie.secao1.titulo': '1. ANÁLISE DE VIABILIDADE E ARBITRAGEM DO GM',

        'dossie.secao1.drone': '- <strong>Missão Secundária (Drone):</strong> O drone não pode ser utilizado por nenhum método antes da recuperação das 4 peças (Baterias, Sensores, Carcaça, Hélices) e do retorno físico a um Bivaque (Regra Externa do GM).',

        'dossie.secao1.explosivos': '- <strong>Validação de Explosivos (GM):</strong> Não exigir confirmação visual de destruição do objeto ambiental. O C4 deve ser plantado diretamente no alvo e detonado de fato (ex: 5 esteiras = 5 cargas distintas). A PEM deve ser lançada visualmente sobre o painel.',

        'dossie.secao1.agua': '- <strong>Amostras de Água (GM):</strong> O esquadrão deve obrigatoriamente realizar a análise fisicamente lançando uma granada informativa em cada ponto distinto (Reservatório, Lago Alice e Dove Stream).',

        'dossie.secao1.sobrevivencia': '- <strong>Regras de Sobrevivência (GM):</strong> Squad Wipe total encerra a missão, reset total. O GM pode invalidar ações que burlem a proposta tática (exploits).',

        'dossie.objetivo1.painelPem': 'Fritar os circuitos do painel de controle (1x Granada PEM).',

        'dossie.objetivo4.combate': 'Combate aberto aceito após comprometimento dos objetivos.',

        'dossie.complicacoes': {
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
        },

        'dossie.fim': 'FIM DO DOSSIÊ OVERLORD. DESTRUA APÓS A LEITURA.',

        'dossie.carimboFim': 'FIM DE RELATÓRIO DO GM'
    });
})(window.GRB);
