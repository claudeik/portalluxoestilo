# Portal Estilo Luxo — Loja Mobile v1.0 · Spec Técnico v2.4

E-commerce mobile-first cross-border (**Unicentro Paraguai → Brasil**) com vitrine curada de acessórios até **US$ 45 FOB**, preço final transparente em Reais (**Imposto Federal R$ 0,00 via Remessa Conforme + ICMS estadual calculado por dentro**), pagamento via **Pix Split regulado pelo Banco Parceiro** (Portal 20% · Unicentro · Epyx 5% · Tributos), emissão de **NF-e no Bling ERP**, rastreio integrado **Correios (API SRO-eXML)**, **Assistente de Estilo IA**, **Presente Compartilhado (Split entre amigas)**, **Moda ao Vivo (Live Shopping)** e **Postgres-as-Lake Analytics (ADR-0009)**.

## Estrutura do Monorepo

```
portal-estilo-luxo/
├── apps/
│   ├── web/                  # PWA Mobile-First React 18 + Vite + TypeScript + Tailwind CSS
│   └── api/                  # Backend Node 20 + Fastify + Prisma (31 models) + BullMQ + ML Prophet
├── packages/
│   ├── tokens/               # Design Tokens (@portal/tokens · #0A0908 / #F5EFE6 / #C9A961)
│   ├── types/                # Contratos de tipos compartilhados (@portal/types)
│   └── ui/                   # Primitivas de UI (@portal/ui)
├── docker-compose.yml        # PostgreSQL 16 (pgvector) + Redis 7 + MinIO
├── docker-compose.analytics.yml # Read Replica + Metabase (ADR-0009)
├── turbo.json
└── package.json
```

## Como Rodar

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar a Loja Mobile PWA (funciona 100% interativa no navegador)
npm run dev:web
# → Acesse http://localhost:5173
```

## Jornadas Implementadas

1. **Jornada 1 · Compra Direta (`/`, `/catalogo/:category`, `/produto/:slug`, `/carrinho`, `/cadastro`, `/checkout`, `/conta/pedidos/:id`)**
   - Calculadora transparente FOB USD → PTAX → Remessa Conforme (II R$ 0,00) → ICMS dinâmico por UF.
   - Cadastro simplificado em 3 etapas com KYC no Banco Parceiro + Login Social + Fallback de salvar sacola por 24h.
   - Checkout com QR Code Pix Split regulado, timer de 15 min, simulador de Webhook HMAC, emissão de NF-e Bling e Timeline Correios de 5 etapas com avaliação pós-entrega.
2. **Jornada 2 · Assistente de Estilo IA (`/conta/assistente`)**
   - Upload de foto (ou 3 presets de referência), extração de tags com descarte imediato da foto (LGPD), SLA < 8s, modo Fallback de curadoria manual e 3 combos com destaque `"MELHOR COMBO"`.
3. **Jornada 3 · Presente Compartilhado (`/conta/compartilhar` e `/s/:token`)**
   - Criação de look compartilhável válido por 7 dias e visão pública da amiga convidada (Persona Bia) sem exigir login prévio, com pills `"Eu pago esta peça"`, cadastro de 1 tela e fallback de 7 dias.
4. **Fluxos 7, 10 e Analytics (`/conta/desejos`, `/conta/alertas`, `/live/quinta-luxo`, `/admin/analytics`)**
   - Wishlist com alertas de queda de preço (≥10%) e estoque baixo (≤3 un.).
   - Live Shopping com a curadora Marina Ferraz, produto sincronizado por timestamp, reações e chat.
   - Painel Executivo com os 5 KPIs do Product Brief, 4 Guardrails e Postgres-as-Lake (Prophet, RFM e Anomalias Fiscais NF-e).
