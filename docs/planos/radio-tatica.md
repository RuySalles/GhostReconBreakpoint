# 📻 Plano: Rádio Tática (trilha sonora no site)

> **Status:** planejado, **não implementado**. Aprovado em 12/10/2026 para implementar em momento oportuno.
> Ao implementar, siga as regras do [`AGENTS.md`](../../AGENTS.md) (tema escuro/claro, celular primeiro, sem estilo inline, `npm run validar` com 0 erros).

## 1. Objetivo

Tocar uma trilha sonora tática **em ordem aleatória** enquanto o site está aberto, com **play / pause / stop / próxima faixa / volume**, para quem quiser música enquanto lê o briefing ou deixa o site aberto jogando — e silêncio total para quem não quiser.

## 2. Decisões já tomadas

| Decisão | Escolha |
|---|---|
| Fonte das músicas | **Arquivos próprios no site**, só trilhas **livres de direitos** (sem YouTube, sem GroupTube) |
| Player | Elemento `<audio>` do navegador (HTML5), sem bibliotecas |
| Estado inicial | **Desligada por padrão** (não briga com o GroupTube nem surpreende ninguém) |
| Ordem | Aleatória, sem repetir faixa até tocar todas |
| Listas | **Geral** (site todo) **+ opcional por missão** |
| Clima | Chiado curto de rádio entre faixas, gerado no navegador |
| Briefing Overlord | A rádio **pausa sozinha** quando o áudio do Overlord toca e volta depois |

## 3. Licenças (sem complicação)

O repositório e o site são **públicos**: qualquer arquivo de áudio fica baixável. Por isso só entra música cuja licença permite redistribuir.

| Fonte | Licença | Usar? | Crédito |
|---|---|---|---|
| [Incompetech](https://incompetech.com/music/royalty-free/) (Kevin MacLeod) | CC BY 4.0 | ✅ Preferida | Obrigatório |
| [OpenGameArt](https://opengameart.org/) | CC0 / CC BY (conferir cada faixa) | ✅ | Se CC BY |
| [Free Music Archive](https://freemusicarchive.org/) | Só faixas CC0 / CC BY | ✅ | Se CC BY |
| [Pixabay Music](https://pixabay.com/music/) | Pixabay Content License | ⚠️ Com cuidado | Não exige |
| Biblioteca de Áudio do YouTube | Termos próprios | ⚠️ Conferir termos antes | Algumas faixas |

- ✅ **Aceitar:** CC0, CC BY (com crédito).
- ⚠️ **Pixabay:** a licença proíbe distribuir o arquivo "isolado"; tocar dentro do site é uso normal, mas o MP3 fica exposto no repositório público. Usar só se faltar opção CC0/CC BY.
- ❌ **Não usar:** música comercial (artistas/gravadoras, trilhas de jogos e filmes), faixas "NC"/"ND" ou "proibido re-upload", nada sem licença clara.
- Toda faixa entra no manifesto com `autor`, `licenca` e `fonte` (link da página original). Sem isso, o validador acusa.

**Busca sugerida:** "military", "tactical", "dark ambient", "tension", "stealth", "cinematic drums", "suspense".

## 4. Arquivos e pastas

```
bastidores/trilha/originais/            Arquivos originais baixados (WAV/MP3 em alta) — fora do site
public/audio/trilha/                    Faixas otimizadas da lista GERAL
public/audio/trilha/trilha.js           Manifesto da lista geral (window.GRB_TRILHA)
public/campaigns/missao-NN-.../audio/trilha/   Faixas exclusivas da missão (opcional)
public/js/radio.js                      Componente Rádio Tática (independente de componentes.js)
public/css/base.css                     Estilos do painel (seção "RÁDIO TÁTICA"), só com tokens
src/tools/converter_trilha.js           Converte originais -> MP3 otimizado (usa ffmpeg)
```

### Manifesto geral (`public/audio/trilha/trilha.js`)
```js
window.GRB_TRILHA = [
    {
        arquivo: 'audio/trilha/infiltracao-noturna.mp3',   // relativo à raiz do site (public/)
        titulo: 'Infiltração Noturna',
        autor: 'Kevin MacLeod',
        licenca: 'CC BY 4.0',
        fonte: 'https://incompetech.com/...'
    }
];
```

### Lista por missão (no `missao.js`)
```js
trilha: {
    modo: 'somar',            // 'somar' = geral + da missão | 'substituir' = só a da missão
    faixas: [
        { arquivo: 'audio/trilha/tensao-ponte.mp3', titulo: '...', autor: '...', licenca: '...', fonte: '...' }
    ]                          // caminho relativo à pasta da missão (igual imagens/áudio hoje)
}
```
- Não é conteúdo do GM: fica no `missao.js` (Squad). Se um dia existir trilha só do GM, usar `GRB.gm('trilha')`.
- `componentes.js` expõe a trilha da missão (ex.: `GRB.trilhaDaMissao()`), já com o caminho resolvido; `radio.js` usa se existir.

### Formato dos arquivos
- **MP3, 96–128 kbps, 44,1 kHz**, volume normalizado (−16 LUFS, para nenhuma faixa estourar).
- Nomes em minúsculas com hífen, sem acento (padrão do projeto).
- Orçamento: **até ~6 MB por faixa** e **~60 MB para a lista geral** (≈ 15–20 faixas).
- `converter_trilha.js`: lê `bastidores/trilha/originais/`, gera em `public/audio/trilha/` com
  `ffmpeg -i entrada -ac 2 -ar 44100 -b:a 112k -af loudnorm=I=-16:TP=-1.5 saida.mp3`.
  Se o ffmpeg não estiver instalado, avisa: `winget install Gyan.FFmpeg`.

## 5. Interface

- **Botão 📻** dentro de `.nav-buttons`, ao lado do botão de tema (inserido por `radio.js`, como o `base.js` faz com o tema). Mostra um indicador discreto quando está tocando.
- **Painel** (não modal, fixo no canto inferior direito; no celular ocupa a largura com margem de 16px):
  - Cabeçalho: `RÁDIO TÁTICA — CANAL SEGURO` + frequência fictícia (ex.: `FREQ 41.250`).
  - Nome da faixa e autor (corta com reticências se for longo).
  - Botões ▶️/⏸️ (um só, alterna), ⏹️, ⏭️ e controle de volume.
  - Barrinhas de "equalizador" animadas quando toca (paradas com `prefers-reduced-motion`).
  - Link "Créditos da trilha".
- Acessibilidade: `aria-label` em todos os botões, `aria-pressed` no play/pause, troca de faixa anunciada em `aria-live="polite"`, `Esc` fecha o painel, foco volta para o 📻. Alvos de toque ≥ 44px.
- Cores só por tokens de `base.css` (testar contraste ≥ 4,5:1 nos dois temas). Escondido na impressão.
- Carrega em: `index.html`, `compendio.html` e todas as páginas de missão (inclusive `_modelo`). **Não** no `mapa.html` (protótipo, não mexer).

## 6. Comportamento

| Ação | Efeito |
|---|---|
| ▶️ Play | Começa/continua; marca a rádio como **ligada** |
| ⏸️ Pause | Pausa no ponto atual; marca como **desligada** |
| ⏹️ Stop | Para, volta a faixa ao início e marca como **desligada** |
| ⏭️ Próxima | Chiado curto + próxima faixa da fila |
| Fim da faixa | Chiado curto + próxima faixa automaticamente |
| Erro ao carregar faixa | Pula para a próxima; se todas falharem, mostra `[SEM SINAL]` |

- **Aleatório:** embaralhamento Fisher–Yates; quando a fila acaba, embaralha de novo evitando que a última faixa seja a primeira da nova fila.
- **Sem autoplay na primeira visita:** os navegadores exigem um clique; e a rádio já nasce desligada.
- **Download sob demanda:** `preload="none"`; nada de música é baixado até apertar play.
- **Volume:** inicia em ~40%; `audio.volume` (no iPhone o volume é o do aparelho — esconder o controle lá).

### Troca de página
Cada página é um documento separado, então o som é cortado ao navegar. Para disfarçar:
- `localStorage['grb-radio']` = `{ ligada, volume }` (preferência da pessoa).
- `sessionStorage['grb-radio-estado']` = `{ fila, indice, tempo }`, salvo a cada ~2 s e no `pagehide`.
- Na nova página, se estava ligada: retoma a mesma faixa no mesmo ponto com fade-in curto. Se o navegador bloquear (`NotAllowedError`), o 📻 pisca discretamente com "toque para retomar".
- Se a lista mudar (ex.: entrou numa missão com `modo: 'substituir'`), descarta o estado e monta nova fila.
- Todo acesso a `localStorage`/`sessionStorage` dentro de `try/catch` (aba anônima pode bloquear).

### Chiado de rádio (sem arquivo)
Web Audio API: ruído branco de ~0,6 s passando por filtro passa-faixa (~1–3 kHz), com envelope rápido e um "clique" de squelch no começo e no fim. Volume proporcional ao da rádio. (`prefers-reduced-motion` não afeta o chiado: é som, não movimento.)

### Briefing do Overlord
- `base.js` passa a disparar `grb:audio-prioritario-inicio` / `grb:audio-prioritario-fim` (play, pause, ended, error do `#overlord-transmission`).
- `radio.js` escuta: se estava tocando, faz fade-out de ~300 ms e pausa; no fim do briefing, retoma com fade-in. Se estava parada, não faz nada.
- Qualquer áudio/vídeo futuro (ex.: vídeo "uplink" da Missão 01) pode disparar os mesmos eventos.

### Celular (Media Session API)
- `navigator.mediaSession.metadata` com título, autor, álbum `RÁDIO TÁTICA — GHOST SQUAD` e capa (precisa de um PNG 512×512 em `public/assets/`; o `favicon.svg` não serve no Android).
- Ações: `play`, `pause`, `stop`, `nexttrack`.
- Resultado: controles na tela de bloqueio/notificação e **música continua com a tela apagada** (Android/Chrome).

## 7. Créditos

- Nova seção **"Créditos da trilha"** no `compendio.html`, gerada a partir do manifesto geral (+ trilhas das missões listadas no catálogo, se viável), no formato:
  `"Título" — Autor (fonte) · Licença: CC BY 4.0`.
- O link "Créditos da trilha" do painel aponta para lá.

## 8. Validador (`src/tools/validar_missoes.js`)

| Situação | Nível |
|---|---|
| Arquivo do manifesto (geral ou da missão) não existe | ERRO |
| Faixa sem `licenca`, `autor` ou `fonte` | ERRO |
| Licença fora da lista aceita (CC0, CC BY x.x, Pixabay) | AVISO |
| Faixa acima de 8 MB / lista geral acima de 80 MB | AVISO |
| Arquivo em `audio/trilha/` que não está em nenhum manifesto | AVISO |
| `trilha.modo` diferente de `somar`/`substituir` | ERRO |

## 9. Fases de implementação

1. **Componente sem músicas:** `radio.js`, estilos, botão 📻, painel, chiado, persistência, integração com Overlord, Media Session. Lista vazia → painel mostra "SEM TRANSMISSÕES NO CANAL".
2. **Lista geral:** escolher e baixar faixas (seção 3), `converter_trilha.js`, manifesto, créditos no Compêndio.
3. **Por missão:** `trilha` no `missao.js`, suporte em `componentes.js`, exemplo comentado no `_modelo`, documentação na tabela de componentes do `AGENTS.md`.
4. **Validador** com as regras da seção 8.

## 10. Checklist de testes

- [ ] Hub inicial, Compêndio, hub Squad, hub GM e dossiês: botão 📻 aparece e funciona.
- [ ] Temas escuro e claro: contraste do painel ≥ 4,5:1.
- [ ] 320 / 375 / 768 / 1024 px e paisagem: sem rolagem lateral, painel cabe na tela, alvos ≥ 44px.
- [ ] Teclado: Tab chega em todos os botões; Esc fecha; foco visível.
- [ ] Rádio desligada por padrão na primeira visita; preferência lembrada.
- [ ] Ordem aleatória sem repetição até esgotar a fila.
- [ ] Troca de página retoma faixa e ponto (ou pede toque).
- [ ] Briefing Overlord (Missão 02) pausa e retoma a rádio.
- [ ] Faixa quebrada é pulada; todas quebradas → `[SEM SINAL]`.
- [ ] Android (S24 Ultra): tela apagada continua tocando; controles na tela de bloqueio.
- [ ] Nada de áudio baixado antes do primeiro play (aba Rede do F12).
- [ ] `npm run validar` com 0 erros.

## 11. Em aberto (decidir na implementação)

- Texto da frequência/canal no cabeçalho do painel.
- Quais faixas entram na lista geral (curadoria com o usuário).
- Se a Missão 01 e a Missão 02 terão listas próprias.
