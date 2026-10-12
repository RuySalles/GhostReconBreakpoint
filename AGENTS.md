# 🧠 IA INTELLIGENCE: Diretrizes e Contexto do Projeto (Auroa Map Parsing)

Este arquivo contém as instruções e contextos permanentes para qualquer agente de IA que atuar neste repositório. **LEIA ESTE ARQUIVO SEMPRE QUE INICIAR A CONVERSA.**

> Este arquivo é a **fonte única** de instruções para IAs. `CLAUDE.md` e `GEMINI.md` apenas o importam; coloque neles somente o que for exclusivo daquela ferramenta.

---

## 📌 Visão Geral do Projeto
Este projeto tem como objetivo realizar a engenharia reversa e a varredura (parsing) de dados geográficos extraídos dos arquivos binários de células (`Cell*_DataBlock.data`) do jogo *Ghost Recon Breakpoint*. O resultado final consolidado deve mapear as coordenadas 3D (X, Y, Z), IDs e nomes corretos dos Pontos de Interesse (POIs), vilas, bases e bivouacs no arquipélago de Auroa para alimentar o frontend da Sala de Operações.

---

## 📁 Convenção Padronizada de Pastas
Para manter o repositório organizado e limpo, adotamos a convenção de **letras minúsculas** para pastas de código e saídas geradas, mantendo em maiúsculas apenas as pastas de dados legadas do jogo.

```
E:\Trabalho\GhostReconBreakpoint\
├── data-out/                           <- [NOVO] JSON consolidado gerado pelo parser
│   ├── map_data_raw.json               <- Saída bruta do extrator (entrada do limpador)
│   └── map_data.json                   <- JSON final limpo, consumido por public/js/mapa.js
├── Data/                               <- [LEGADO - IMUTÁVEL / READ-ONLY]
│   ├── Codex/                          <- Contém os CSVs com o Codex oficial do jogo
│   └── Extracted/                      <- Células binárias brutas extraídas das .forge
├── public/                             <- [NOVO] Frontend estático da aplicação
│   ├── assets/                         <- Imagens, ícones e assets de interface
│   ├── campaigns/                      <- Conteúdo narrativo estático e missões (ex: missao-01-growler-silent)
│   │   ├── missoes.js                  <- Lista de missões exibida no hub inicial (index.html)
│   │   ├── shared/                     <- ops.css + ops.js (tema, modais, zoom, áudio) e componentes.js (monta as páginas)
│   │   ├── _modelo/                    <- Modelo copiado por "npm run nova-missao" (não é uma missão publicada)
│   │   └── missao-XX-nome/             <- missao.js = TODO o conteúdo (Squad + GM); os .html são só esqueletos
│   ├── index.html                      <- Ponto de entrada principal
│   └── mapa.html                       <- Aplicação do mapa operacional
├── src/                                <- Código-fonte (backend e scripts)
│   ├── parser/                         <- Lógica de extração de dados
│   │   ├── extract_map_data.js         <- Data/ -> data-out/map_data_raw.json
│   │   └── clean_map_data.js           <- map_data_raw.json -> data-out/map_data.json
│   ├── server/                         <- Servidor local (Node http/https puro, porta 8443)
│   │   └── server.js
│   ├── diagnostics/                    <- Scripts de testes e ferramentas de análise estrutural
│   └── tools/
│       └── nova_missao.js              <- "npm run nova-missao -- 03 \"Nome\"": cria missão a partir do _modelo
├── AGENTS.md                           <- Este arquivo: diretrizes permanentes para todas as IAs
├── CLAUDE.md                           <- Importa AGENTS.md (+ notas exclusivas do Claude)
└── GEMINI.md                           <- Importa AGENTS.md (+ notas exclusivas do Gemini)
```

---

## ⚠️ Regras de Segurança Críticas (Read-Only)
> [!CAUTION]
> As pastas de dados originais do jogo **são estritamente de leitura (read-only)**. Qualquer alteração ou escrita nelas quebrará o pipeline e os dados brutos.
> - **NÃO** altere, crie, renomeie ou delete arquivos em `Data/Extracted/`.
> - **NÃO** altere, crie, renomeie ou delete arquivos em `Data/Codex/`.
> - **NÃO** tente mover ou renomear a pasta `Data/` principal (pois ela armazena gigabytes de arquivos extraídos do jogo e qualquer movimentação será ineficiente e perigosa).

---

## 🔬 Especificação Lógica das Células Binárias
Os arquivos `Cell*_DataBlock.data` contêm entidades espaciais gravadas na seguinte estrutura sequencial (Little Endian):
1. **Nome da Entidade (ASCII)**: Uma string com caracteres visíveis (letras, números, sublinhados, ex: `GL001_RespawnPoint_PhotographerHouse`). É precedida por seu comprimento em 1 byte.
2. **ID da Entidade (UInt64)**: Um valor hexadecimal de 8 bytes (ex: `0x0000019b29f0dd88`) localizado imediatamente após a string de nome.
3. **Coordenadas Espaciais X, Y, Z (Float32)**: 3 floats sequenciais localizados dentro de uma janela de busca deslizante de **+10 a +60 bytes** após o fim da string.
   - **Filtro Geográfico Real de Auroa**:
     * `X` (Longitude) deve estar entre `-25000` e `25000`.
     * `Y` (Latitude) deve estar entre `-25000` e `25000`.
     * `Z` (Altitude) deve estar entre `-100` e `3000` (metros).
   - Floats fora desse intervalo devem ser ignorados pelo parser.

---

## 🗃️ Dicionário Dinâmico: Províncias e Locais de Auroa (Data/Codex)
Para garantir uma extração precisa e livre de lixo binário, a extração deve filtrar nomes de entidades com base nas palavras-chave oficiais do jogo extraídas dos arquivos da pasta `Data/Codex/`:

### Principais Províncias de Auroa:
- Cape North
- Channels
- Driftwood Islets
- Egg Island
- Fen Bog
- Good Hope Mountain
- Infinity
- Lake Country
- Liberty
- Mount Hodgson
- New Argyll
- New Stirling
- Restricted Area 01
- Seal Islands
- Silent Mountain
- Sinking Country
- Smuggler Coves
- Whalers Bay
- Wild Coast
- Windy Islands

### Principais Categorias e Termos de POIs do Codex:
- **Pontos de Respawn/Viagem Rápida:** `RespawnPoint`, `Bivouac` (Acampamentos)
- **Instalações Militares/Científicas:** `Camp`, `Outpost`, `Battery`, `Station`, `Center`, `Office`, `Factory`, `Assembly`, `Testing Zone`, `R&D`, `Control`
- **Habitações e Vilas:** `Village`, `Residences`, `Homestead`, `Estate`, `Farm`, `Ruins`, `Fort`, `Harbor`
- **Geografia Natural:** `Cavern`, `Lake`, `Glacier`, `Peak`, `Mountain`, `Island`

---

## 📊 Esquema JSON de Saída (data-out/map_data.json)
O JSON final consolidado deve seguir uma estrutura de array de objetos:
```json
[
  {
    "id": "0x0000019b29f0dd88",
    "name": "GL001_RespawnPoint_PhotographerHouse",
    "x": -8511.9463,
    "y": -5590.4072,
    "z": 195.0164,
    "province": "Cape North",
    "type": "Bivouac"
  }
]
```
Campos esperados:
- `id`: O ID UInt64 de 8 bytes em formato hexadecimal string (ex: `"0x0000019b29f0dd88"`).
- `name`: Nome ASCII limpo da entidade extraída.
- `x`, `y`, `z`: Coordenadas de precisão Float32 formatadas com até 4 casas decimais.
- `province`: Província de Auroa associada (mapeada a partir da lista oficial ou do Codex). Caso não encontrada, classificar como `"Unknown"`.
- `type`: O tipo de ponto (ex: `"Bivouac"`, `"Camp"`, `"Outpost"`, `"Village"`, `"Station"`, `"Other"`), derivado com base nas palavras-chave encontradas.

---

## ⚡ Especificações de Performance e Memória
O parser principal deve ser otimizado para lidar com a varredura massiva de **99.702 arquivos de células**:
- **Processamento Iterativo**: Não carregar múltiplos arquivos inteiros em memória ao mesmo tempo. Use leitura por arquivo único síncrono e limpe as referências de buffers imediatamente.
- **Relatório de Progresso**: Imprimir no console um status de progresso (ex: quantidade de arquivos processados, porcentagem concluída e contagem de POIs válidos extraídos) a cada lote de 5.000 ou 10.000 células analisadas.
- **Tolerância a Erros**: Arquivos binários corrompidos ou com falha de leitura física não devem quebrar o loop global de execução; o erro deve ser logado e o parser deve avançar para o próximo arquivo.

---

## 🎭 DIRETRIZ FUNDAMENTAL — PAPÉIS E HIERARQUIA

Esta regra deve ser considerada permanente e deve ser respeitada em qualquer interpretação, alteração ou criação relacionada à experiência.

### 1. Ghost Squad

O **Ghost Squad** representa os jogadores que estão participando da missão pela imersão.

* Recebe as informações necessárias para participar e tomar decisões dentro da missão.
* Não precisa conhecer a estrutura operacional da missão.
* Não precisa conhecer scripts, spoilers, gatilhos ou instruções internas do GM.
* Deve confiar no Ghost Lead para receber direcionamento quando necessário.

O Ghost Squad representa a perspectiva do jogador dentro da experiência.

### 2. Ghost Lead

O **Ghost Lead** representa o **GM (Game Master)**.

Ele também participa da experiência, porém possui a responsabilidade adicional de conduzir e controlar a missão.

O Ghost Lead:

* conhece a estrutura completa da missão;
* acompanha o progresso e o estado da missão;
* conhece spoilers e informações ocultas;
* possui acesso aos scripts e às diretrizes de condução;
* decide quando determinadas situações devem acontecer;
* executa os gatilhos necessários para fazer a missão avançar;
* direciona o Ghost Squad;
* possui todas as informações disponíveis ao Ghost Squad, além das informações exclusivas necessárias para exercer a função de GM.

Regra de acesso:

**Ghost Lead = tudo que o Ghost Squad pode acessar + informações e ferramentas exclusivas do GM.**

Nunca interpretar Ghost Lead e Ghost Squad como dois grupos com informações equivalentes ou independentes.

### 3. Overlord

**Overlord não é um usuário, perfil ou terceiro participante do sistema.**

Overlord é um **elemento narrativo/diegético** criado para preservar a imersão da experiência.

As ações que, na prática, são executadas pelo Ghost Lead devem ser apresentadas dentro da narrativa como se fossem comandos, ordens ou intervenções provenientes do:

**CENTRO DE COMANDO TÁTICO — OVERLORD**

Isso permite que a experiência mantenha a ilusão de que existe uma autoridade externa acompanhando e coordenando a missão remotamente.

Exemplo conceitual:

Na realidade:
**Ghost Lead ativa um gatilho.**

Na narrativa:
**OVERLORD envia uma ordem para o Ghost Squad.**

### 4. Relação entre os papéis

A relação correta é:

**Ghost Squad** → executa a missão dentro da experiência.

**Ghost Lead** → conduz a missão e executa as ações necessárias como GM.

**Overlord** → é a identidade narrativa utilizada para representar as ações do Ghost Lead dentro da história.

Portanto:

**Ghost Lead ≠ Overlord como entidades independentes.**

**Ghost Lead opera o Overlord.**

O Overlord é, essencialmente, a **máscara narrativa do Ghost Lead**.

### 5. Regra de interpretação

Sempre que houver dúvida sobre conteúdo, acesso, interface, documentos, eventos, scripts ou funcionalidades, aplicar esta hierarquia:

**Ghost Squad = perspectiva do jogador**

**Ghost Lead = perspectiva do GM**

**Overlord = representação narrativa das ações do GM**

Não criar, inferir ou implementar um terceiro perfil de usuário chamado Overlord.

Não tratar Ghost Lead como um simples jogador com uma versão diferente da interface.

Não limitar o Ghost Lead ao conteúdo do Ghost Squad.

O Ghost Lead deve sempre ser considerado capaz de acessar o conteúdo do Ghost Squad e, adicionalmente, todo o conteúdo necessário para conduzir a missão como GM.

---

## 🎯 Como Criar uma Missão

As missões são **orientadas a dados**: todo o conteúdo fica em `public/campaigns/missao-XX-nome/missao.js`, e as páginas `.html` são esqueletos idênticos que o `shared/componentes.js` preenche. Não escreva conteúdo de missão direto em HTML.

### Passo a passo
1. `npm run nova-missao -- 03 "Nome da Operação"` → cria `campaigns/missao-03-nome-da-operacao/`, a pasta `assets/missao-03/` (com `audio/`) e cadastra a missão em `campaigns/missoes.js`.
2. Coloque as imagens em `public/assets/missao-03/` e o áudio em `public/assets/missao-03/audio/briefing.mp3`.
3. Preencha o `missao.js` da missão. O arquivo do `_modelo` já traz um exemplo comentado de cada bloco.
4. Ajuste o `resumo` da missão em `campaigns/missoes.js` (texto mostrado no hub inicial).
5. Teste localmente com `npm start` e confira hub do Squad, hub do GM e dossiês nos dois temas e no celular.

### Páginas geradas
| Arquivo | `<body>` | Conteúdo (`missao.js`) |
|---|---|---|
| `lore_hub.html` | `data-pagina="hub" data-papel="squad"` | `hub` |
| `lore_hub_gm.html` | `data-pagina="hub" data-papel="gm"` | `hub` (versão GM) |
| `briefing_tatico.html` | `data-pagina="documento" data-papel="squad" data-doc="tatico"` | `documentos.tatico` |
| `relatorio_gm.html` | `data-pagina="documento" data-papel="gm" data-doc="tatico"` | `documentos.tatico` (versão GM) |
| `doc_intel.html` | `data-pagina="documento" data-papel="squad" data-doc="inteligencia"` | `documentos.inteligencia` |

Para outro documento, crie um novo esqueleto com outro `data-doc` e a chave correspondente em `documentos`.

### Squad x GM no mesmo arquivo (regra de papéis)
- `GRB.papel('texto Squad', 'texto GM')` → versão diferente por papel.
- `GRB.soGm(valor)` / `GRB.soSquad(valor)` → item de lista, linha de cabeçalho, botão, seção inteira etc. que só aparece para aquele papel.
- O GM sempre vê tudo do Squad + o que for `soGm`. **Nunca** crie conteúdo de GM em arquivo separado do Squad.

### Blocos disponíveis (em `briefing`, `secoes[].blocos` e `callout`)
| Bloco | Uso |
|---|---|
| `'texto'` | Parágrafo (aceita `<strong>`, `<em>`, `<br>`) |
| `{ p, classe }` | Parágrafo com classe (ex.: `'sign-off typing-effect'`) |
| `{ linhas: [...] }` | Parágrafo com uma linha por item |
| `{ h3 }` | Subtítulo |
| `{ lista: [...] }` | Lista com marcadores |
| `{ galeria: [{ img, titulo, legenda, zoom, alt, larga, natural, centro }] }` | Fotos clicáveis (`zoom` = legenda ampliada) |
| `{ kneeboard, galeria }` | Cartas de navegação |
| `{ video }` | Vídeo "uplink" |
| `{ tabela: [col1, col2], linhas: [[rótulo, valor], { perigo, celulas }] }` | Tabela SITREP |
| `{ callout, titulo, perigo }` | Bloco de destaque (texto ou lista de blocos) |
| `{ complicacoes: [{ nome, gatilho, acao, resposta }] }` | Complicações do GM |

Componentes próprios do hub: `cabecalho` (aceita `{ aviso }` no meio), `audio`, `documentos` (barra de botões), `script` (script do mestre), `objetivos` (seções com `itens` e `sub`), `gabaritos` (grade do GM), `configuracoes` (modal ⚙️, com `camuflagens` de `assets/paint/`), `imprimir`, `acessoGm: false`, `estiloGaleria`.

Componente novo? Adicione em `shared/componentes.js` (e o estilo em `shared/ops.css`) para que todas as missões possam usar.

---

## 🚀 Como Iniciar Tarefas
Sempre que uma nova tarefa for solicitada:
1. Re-leia este arquivo `AGENTS.md` para garantir conformidade.
2. Carregue o dicionário de províncias e locais para a memória.
3. Certifique-se de que novos scripts sejam criados sob a pasta `src/`.
4. Garanta que a saída de dados consolidados ocorra estritamente em `data-out/map_data.json` (pipeline: `node src/parser/extract_map_data.js` e depois `node src/parser/clean_map_data.js`).

