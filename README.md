# Ghost Recon Breakpoint — Sala de Operações

Site estático com as missões de MilSim do Ghost Squad no arquipélago de Auroa (*Ghost Recon Breakpoint*), mais um parser que extrai os pontos de interesse do mapa a partir dos arquivos do jogo.

- **Site publicado:** https://ruysalles.github.io/GhostReconBreakpoint/
- **Compêndio Doutrinário (lore e TTPs do esquadrão):** [`public/compendio.html`](public/compendio.html)
- **Diretrizes completas para IAs e para quem desenvolve:** [`AGENTS.md`](AGENTS.md)

## Requisitos

- [Node.js](https://nodejs.org/) 18 ou mais novo (não há dependências para instalar)
- `openssl` (já vem com o Git para Windows), só para o certificado HTTPS local

## Comandos

| Comando | O que faz |
|---|---|
| `npm start` | Servidor local em `https://localhost:8443` (usa HTTP se não houver certificado) |
| `npm run certificado` | Gera o certificado HTTPS local em `src/server/certs/` (não vai para o Git) |
| `npm run nova-missao -- 03 "Nome da Operação"` | Cria uma missão a partir de `public/campaigns/_modelo/` e a cadastra no hub |
| `npm run validar` | Confere todas as missões: spoilers do GM vazando, links, páginas, HTML e mídias |

## Estrutura

```
public/                  Site publicado no GitHub Pages
  index.html             Hub inicial (lista vinda de campaigns/catalogo.js)
  compendio.html         Compêndio Doutrinário
  campaigns/
    catalogo.js          Missões exibidas no hub
    _modelo/             Modelo usado por "npm run nova-missao"
    missao-NN-nome/      Uma pasta por missão:
      missao.js          Conteúdo do Squad (os jogadores baixam este arquivo)
      missao-gm.js       Conteúdo do Ghost Lead/GM (só as páginas do GM carregam)
      hub.html, hub-gm.html, dossie.html, dossie-gm.html, intel-*.html  (esqueletos)
      imagens/ audio/ video/
  css/ js/               Estilo, tema escuro/claro e componentes compartilhados
bastidores/              Fora do site: originais das imagens, roteiros, versões antigas
src/
  tools/                 nova_missao.js, validar_missoes.js
  parser/                Extração do mapa (Data/ -> data-out/)
  server/                Servidor local
Data/                    Arquivos extraídos do jogo (somente leitura)
data-out/                JSON do mapa gerado pelo parser
```

## Criando uma missão

1. `npm run nova-missao -- 03 "Nome da Operação"`
2. Coloque as imagens em `public/campaigns/missao-03-.../imagens/` (WebP ou JPG, até ~1920 px) e guarde os originais em `bastidores/missao-03-.../imagens-originais/`.
3. Preencha `missao.js` (o que o Squad vê) e `missao-gm.js` (spoilers, gabaritos, regras do GM).
4. `npm run validar` e `npm start` para conferir nos dois temas e no celular.
5. Commit e push: o GitHub Actions valida e publica sozinho.

O passo a passo completo, os blocos disponíveis e as regras de Squad x GM estão em [`AGENTS.md`](AGENTS.md#-como-criar-uma-missão).

## Publicação

Todo push no `main` dispara `.github/workflows/deploy.yml`, que:

1. roda `npm run validar` (um **erro** bloqueia a publicação; **avisos** não);
2. copia `data-out/` para o site;
3. grava o carimbo de versão (`BUILD <commit> · <data>`) que aparece no rodapé do hub;
4. publica `public/` no GitHub Pages.

> **Atenção:** o repositório é público. Tudo o que está no Git, inclusive `bastidores/` e o `missao-gm.js` das missões, pode ser lido por qualquer pessoa no GitHub. A separação do conteúdo do GM evita spoilers acidentais para os jogadores no site, mas não é proteção de segurança.
