# 🧠 IA INTELLIGENCE: Diretrizes e Contexto do Projeto (Auroa Map Parsing)

Este arquivo contém as instruções e contextos permanentes para qualquer agente de IA que atuar neste repositório. **LEIA ESTE ARQUIVO SEMPRE QUE INICIAR A CONVERSA.**

---

## 📌 Visão Geral do Projeto
Este projeto tem como objetivo realizar a engenharia reversa e a varredura (parsing) de dados geográficos extraídos dos arquivos binários de células (`Cell*_DataBlock.data`) do jogo *Ghost Recon Breakpoint*. O resultado final consolidado deve mapear as coordenadas 3D (X, Y, Z), IDs e nomes corretos dos Pontos de Interesse (POIs), vilas, bases e bivouacs no arquipélago de Auroa para alimentar o frontend da Sala de Operações.

---

## 📁 Convenção Padronizada de Pastas
Para manter o repositório organizado e limpo, adotamos a convenção de **letras minúsculas** para pastas de código e saídas geradas, mantendo em maiúsculas apenas as pastas de dados legadas do jogo.

```
E:\Trabalho\GhostReconBreakpoint\GhostReconBreakpoint\
├── data-out/                           <- [NOVO] JSON consolidado gerado pelo parser
│   └── map_data.json                   <- JSON final extraído com todas as coordenadas limpas
├── Data/                               <- [LEGADO - IMUTÁVEL / READ-ONLY]
│   ├── Codex/                          <- Contém os CSVs com o Codex oficial do jogo
│   └── Extracted/                      <- Células binárias brutas extraídas das .forge
├── public/                             <- [NOVO] Frontend estático da aplicação
│   ├── assets/                         <- Imagens, ícones e assets de interface
│   ├── campaigns/                      <- Conteúdo narrativo estático e missões (ex: missao-01-growler-silent)
│   ├── index.html                      <- Ponto de entrada principal
│   └── mapa.html                       <- Aplicação do mapa operacional
├── src/                                <- Código-fonte (backend e scripts)
│   ├── parser/                         <- Lógica de extração de dados
│   │   ├── extract_map_data.js
│   │   └── clean_map_data.js
│   ├── server/                         <- Servidor local (Express/HTTP)
│   │   └── server.js
│   └── diagnostics/                    <- Scripts de testes e ferramentas de análise estrutural
└── GEMINI.md                           <- Este arquivo de diretrizes permanentes
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

## 🚀 Como Iniciar Tarefas
Sempre que uma nova tarefa for solicitada:
1. Re-leia este arquivo `GEMINI.md` para garantir conformidade.
2. Carregue o dicionário de províncias e locais para a memória.
3. Certifique-se de que novos scripts sejam criados sob a pasta `src/`.
4. Garanta que a saída de dados consolidados ocorra estritamente em `data-out/map_data.json`.

