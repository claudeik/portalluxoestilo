// apps/web/src/routes/PitchEditorialPage.tsx
// Apresentação Executiva Interativa · Portal Estilo Luxo (Volume I · Pitch Editorial Outubro 2026)
// Estudo de Mercado · Personas · Jornada · Brand Book · Fluxo Pix Split · Roadmap

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Users,
  Compass,
  FileText,
  Clock,
  Layers,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Truck,
  Heart,
  Palette,
} from "lucide-react";
import { PERSONAS, PersonaProfile } from "../data/catalog.data";
import { usePortalStore } from "../stores/app.store";
import { formatBrl } from "../lib/format";

export function PitchEditorialPage() {
  const { switchPersona, currentPersona } = usePortalStore();
  const [activeTab, setActiveTab] = useState<
    "manifesto" | "mercado" | "personas" | "competicao" | "benchmarks" | "jornada" | "brandbook" | "split" | "conta" | "roadmap" | "glossario"
  >("manifesto");

  const [simFobUsd, setSimFobUsd] = useState<number>(30);
  const [includeFederalTax, setIncludeFederalTax] = useState<boolean>(false);

  // Cálculo da simulação do capítulo 18
  const ptax = 5.0;
  const mercadoriaBrl = simFobUsd * ptax;
  const freteBrl = 25.0;
  const baseComFrete = mercadoriaBrl + freteBrl;
  const icmsRate = 0.17;
  const icmsBrl = Number((baseComFrete / (1 - icmsRate) - baseComFrete).toFixed(2));
  const iiRate = includeFederalTax ? 0.2 : 0.0;
  const iiBrl = Number((mercadoriaBrl * iiRate).toFixed(2));
  const totalBrl = Number((baseComFrete + icmsBrl + iiBrl).toFixed(2));

  const comissaoPortal = Number((mercadoriaBrl * 0.2).toFixed(2));
  const epyxPlataforma = Number((totalBrl * 0.05).toFixed(2));
  const repasseUnicentro = Number(Math.max(0, totalBrl - comissaoPortal - epyxPlataforma - icmsBrl - iiBrl).toFixed(2));

  return (
    <div className="max-w-5xl mx-auto px-4 pt-6 pb-28 space-y-12">
      {/* Capa Editorial */}
      <section className="relative rounded-3xl overflow-hidden bg-[#0A0A0A] text-[#FAF7F2] p-8 sm:p-12 border border-[#B8924A]/40 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#B8924A]/25 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 space-y-6 max-w-3xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#B8924A]/30 pb-4">
            <span className="font-serif text-xs uppercase tracking-[0.35em] text-[#D9BE85]">
              Portal · Estilo · Luxo
            </span>
            <span className="italic-serif text-sm text-[#D9BE85]">
              Volume I · Outubro 2026 · Pitch Editorial
            </span>
          </div>

          <div className="space-y-3">
            <span className="italic-serif text-lg text-[#B8924A] block">
              — Estudo Estratégico & Tese de Posicionamento —
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl font-normal leading-[1.05] tracking-tight">
              Curadoria <br />
              <em className="italic text-[#D9BE85]">do Paraguai</em> <br />
              para o Brasil
            </h1>
          </div>

          <div className="w-20 h-[1px] bg-[#B8924A]" />

          <p className="italic-serif text-xl sm:text-2xl font-light text-[#FAF7F2]/90 leading-relaxed max-w-2xl">
            Acessórios até US$ 50, com a Portal Estilo Luxo como canal curador da Unicentro, sem reter o dinheiro de ninguém.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4 text-xs">
            <Link
              to="/"
              className="btn-gold"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Ver Vitrine em Ação</span>
            </Link>
            <a
              href="#sumario"
              className="btn-outline border-[#D9BE85] text-[#D9BE85] hover:bg-[#D9BE85]/10"
            >
              <span>Explorar Estudo Completo</span>
            </a>
          </div>
        </div>
      </section>

      {/* Navegação por Capítulos do Estudo */}
      <nav id="sumario" className="sticky top-20 z-40 bg-[#FAF7F2]/95 backdrop-blur-md py-2.5 border-y border-[#C9BFA8]">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {[
            { id: "manifesto", label: "Manifesto & Tese" },
            { id: "mercado", label: "TAM/SAM & Tendências" },
            { id: "personas", label: "Personas (3)" },
            { id: "competicao", label: "Análise Competitiva" },
            { id: "benchmarks", label: "Benchmarks & Casas" },
            { id: "jornada", label: "Storyboard da Jornada" },
            { id: "brandbook", label: "Brand Book" },
            { id: "split", label: "Fluxo Pix Split" },
            { id: "conta", label: "Simulador da Conta" },
            { id: "roadmap", label: "Roadmap 12 Meses" },
            { id: "glossario", label: "Glossário Regulatório" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                activeTab === tab.id
                  ? "bg-[#0A0A0A] text-[#FAF7F2] font-semibold"
                  : "bg-[#F0EBE0] text-[#2C2C2C] hover:bg-[#C9BFA8]/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Conteúdo Dinâmico por Aba */}

      {/* 1. MANIFESTO & TESE */}
      {activeTab === "manifesto" && (
        <section className="space-y-8 animate-fade-in">
          <div className="border-l-2 border-[#B8924A] pl-4 space-y-1">
            <span className="eyebrow">Carta do Editor</span>
            <h2 className="font-serif text-3xl font-normal text-[#0A0A0A]">
              Curadoria é o novo luxo <em className="italic text-[#8B6B30]">acessível</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[#2C2C2C] text-sm leading-relaxed">
            <div className="space-y-4">
              <p>
                Há uma década, o luxo se media pelo preço e pela exclusividade geográfica — quem chegava a Paris ou a Nova York voltava com uma bolsa, um lenço, uma história. Hoje, o luxo se mede pela <strong>curadoria</strong>: a capacidade de escolher bem, apresentar com elegância e entregar com previsibilidade. O preço virou consequência, não causa.
              </p>
              <p>
                A Portal Estilo Luxo nasce dessa leitura. Não somos uma loja de luxo barato nem uma vitrine de produtos genéricos com aparência de luxo. Somos uma <em>curadora</em>: escolhemos acessórios que resistem ao tempo, fotografamos como revista, precificamos com transparência e entregamos pelos Correios — sem que a cliente precise entender de câmbio, de Remessa Conforme ou de ICMS por dentro.
              </p>
            </div>
            <div className="space-y-4">
              <p>
                Este documento apresenta a tese, o mercado, a cliente, a vitrine digital e o modelo de negócio. Mostra também o que aprendemos com Chanel, Dior, Hermès, Net-a-Porter e Dover Street Market. Não para imitá-los, mas para herdar o que neles é perene: o respeito por quem compra.
              </p>
              <div className="p-4 bg-[#F0EBE0] rounded-2xl border-l-4 border-[#B8924A] space-y-1">
                <span className="eyebrow text-[#8B6B30]">Tese Central</span>
                <p className="italic-serif text-base text-[#0A0A0A]">
                  "A cliente brasileira já compra do exterior. Falta uma curadoria com cara de revista e preço final na tela. Esse é o lugar da Portal."
                </p>
              </div>
            </div>
          </div>

          {/* O Papel da Portal (O que faz vs Não faz) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
            <div className="p-6 rounded-2xl bg-white border border-[#C9BFA8] space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-[#8B6B30] font-semibold text-xs tracking-wider uppercase">
                <CheckCircle2 className="w-4 h-4 text-[#5B8254]" />
                <span>O que a Portal Faz</span>
              </div>
              <ul className="space-y-3 text-xs text-[#2C2C2C]">
                <li>• <strong>Curadoria:</strong> Escolhe 8-12 itens por safra e assina o cartão numerado de cada peça.</li>
                <li>• <strong>Marca & Editorial:</strong> Fotografias de estúdio, e-mail revista e narrativa da safra.</li>
                <li>• <strong>Atendimento Humanizado:</strong> Suporte por WhatsApp em até 24h para dúvidas e rastreio.</li>
                <li>• <strong>Representação Comercial:</strong> Atua como canal da Unicentro no Brasil sem estocar.</li>
                <li>• <strong>Comissão de 20%:</strong> Recebe comissão limpa em reais no instante do Pix.</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-[#F0EBE0] border border-[#C9BFA8] space-y-4">
              <div className="flex items-center gap-2 text-[#4A4A4A] font-semibold text-xs tracking-wider uppercase">
                <ShieldCheck className="w-4 h-4 text-[#8B6B30]" />
                <span>O que a Portal NÃO Faz</span>
              </div>
              <ul className="space-y-3 text-xs text-[#4A4A4A]">
                <li>• <strong>Não compra nem revende:</strong> A cliente importa da Unicentro; a Portal é canal curador.</li>
                <li>• <strong>Não retém dinheiro da venda:</strong> O banco parceiro executa o split regulado na hora.</li>
                <li>• <strong>Não carrega estoque:</strong> Estoque fica na Unicentro em Ciudad del Este (PY).</li>
                <li>• <strong>Não opera câmbio direto:</strong> Operação regulada feita pela instituição autorizada Bacen.</li>
                <li>• <strong>Não vende eletrônicos nem réplicas:</strong> Foco exclusivo em acessórios femininos até US$ 50.</li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* 2. MERCADO & TENDÊNCIAS */}
      {activeTab === "mercado" && (
        <section className="space-y-8 animate-fade-in">
          <div className="border-l-2 border-[#B8924A] pl-4 space-y-1">
            <span className="eyebrow">Capítulo 1 · Mercado Endereçável</span>
            <h2 className="font-serif text-3xl font-normal text-[#0A0A0A]">
              O cross-border virou <em className="italic text-[#8B6B30]">rotina</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border-t-4 border-[#0A0A0A] shadow-sm">
              <span className="eyebrow text-[#0A0A0A]">TAM · Mercado Total</span>
              <div className="font-serif text-4xl sm:text-5xl text-[#0A0A0A] mt-2">
                R$ 87<span className="text-xl">bi</span>
              </div>
              <p className="text-xs text-[#4A4A4A] mt-3 leading-relaxed">
                E-commerce de moda e acessórios no Brasil em 2026 (Webshoppers). Crescimento projetado de 14% a.a.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border-t-4 border-[#8B6B30] shadow-sm">
              <span className="eyebrow text-[#8B6B30]">SAM · Endereçável</span>
              <div className="font-serif text-4xl sm:text-5xl text-[#8B6B30] mt-2">
                R$ 12<span className="text-xl">bi</span>
              </div>
              <p className="text-xs text-[#4A4A4A] mt-3 leading-relaxed">
                Fatia feminina cross-border até US$ 50 sob Remessa Conforme (26% de adesão cross-border × 53% feminino).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border-t-4 border-[#B8924A] shadow-sm">
              <span className="eyebrow text-[#B8924A]">SOM · Piloto 12m</span>
              <div className="font-serif text-4xl sm:text-5xl text-[#B8924A] mt-2">
                R$ 4,8<span className="text-xl">mi</span>
              </div>
              <p className="text-xs text-[#4A4A4A] mt-3 leading-relaxed">
                GMV alvo no cenário base. 38 mil pedidos no ano, ticket médio R$ 126. Comissão Portal = R$ 960 mil.
              </p>
            </div>
          </div>

          {/* 6 Forças de 2026 */}
          <div className="space-y-4 pt-4">
            <h3 className="font-serif text-2xl text-[#0A0A0A]">Seis forças que moldam o consumo em 2026</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  num: "1",
                  title: "Curadoria contra algoritmo",
                  desc: "61% das compradoras relatam fadiga por recomendações genéricas em marketplaces. Preferem safra selecionada.",
                },
                {
                  num: "2",
                  title: "Confiança Remessa Conforme",
                  desc: "Imposto de importação federal zerado até US$ 50. Elimina a dor de bitributação ou retenção aduaneira.",
                },
                {
                  num: "3",
                  title: "Mobile-first absoluto (71%)",
                  desc: "71% dos pedidos de moda feminina saem de smartphones. A tela mobile é o ponto de venda principal.",
                },
                {
                  num: "4",
                  title: "Pix instantâneo como padrão",
                  desc: "Pix responde por 73% das compras online abaixo de R$ 200. Checkout em 3 segundos.",
                },
                {
                  num: "5",
                  title: "Personalização editorial",
                  desc: "A cliente não quer rolagem infinita. Quer a seleção da estação com 8 a 12 itens autênticos.",
                },
                {
                  num: "6",
                  title: "Sustentabilidade percebida",
                  desc: "Menos mas melhor: metal banhado a ouro 18k que dura anos supera bijuterias descartáveis.",
                },
              ].map((f) => (
                <div key={f.num} className="p-5 bg-white border border-[#C9BFA8] rounded-xl space-y-2">
                  <span className="italic-serif text-2xl text-[#B8924A] font-bold">{f.num} ·</span>
                  <h4 className="font-semibold text-xs text-[#0A0A0A]">{f.title}</h4>
                  <p className="text-[11px] text-[#4A4A4A] leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. PERSONAS */}
      {activeTab === "personas" && (
        <section className="space-y-8 animate-fade-in">
          <div className="border-l-2 border-[#B8924A] pl-4 space-y-1">
            <span className="eyebrow">Capítulo 2 · Personas de Design</span>
            <h2 className="font-serif text-3xl font-normal text-[#0A0A0A]">
              Três mulheres, uma <em className="italic text-[#8B6B30]">mesma</em> Portal
            </h2>
            <p className="text-xs text-[#4A4A4A]">
              As três personas cobrem 78% da demanda do piloto. Clique em "Experimentar Loja" para alternar para a visão da persona.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.values(PERSONAS).map((p) => {
              const isActive = currentPersona === p.id;
              return (
                <div
                  key={p.id}
                  className={`p-6 rounded-2xl border transition space-y-4 flex flex-col justify-between ${
                    isActive
                      ? "bg-white border-[#B8924A] shadow-xl ring-2 ring-[#B8924A]/30"
                      : "bg-[#F0EBE0] border-[#C9BFA8]"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.avatar}
                        alt={p.name}
                        className="w-14 h-14 rounded-full object-cover border border-[#B8924A]"
                      />
                      <div>
                        <h3 className="font-serif text-lg text-[#0A0A0A] font-medium leading-tight">
                          {p.name} · {p.age} anos
                        </h3>
                        <span className="text-[10px] text-[#8B6B30] italic-serif font-semibold">
                          {p.tagline}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-[#2C2C2C] border-t border-[#C9BFA8]/60 pt-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#8C8275] block">Perfil</span>
                        <span>{p.profession} · Renda {p.income}</span>
                        <div className="text-[11px] text-[#8C8275]">{p.location}</div>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#8C8275] block">Comportamento</span>
                        <p className="text-[11px] leading-relaxed">{p.behavior}</p>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#8C8275] block">Gatilho de Compra</span>
                        <p className="text-[11px] leading-relaxed text-[#8B6B30]">{p.trigger}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#C9BFA8]/60 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[10px] uppercase text-[#8C8275]">Item Hero:</span>
                      <span className="font-medium text-[#0A0A0A]">{p.heroProductName}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[10px] uppercase text-[#8C8275]">Preço:</span>
                      <span className="italic-serif text-base font-bold text-[#8B6B30]">
                        {formatBrl(p.heroPriceBrl)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => switchPersona(p.id)}
                      className={`w-full py-2 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
                        isActive
                          ? "bg-[#B8924A] text-[#0A0A0A]"
                          : "bg-[#0A0A0A] text-[#FAF7F2] hover:bg-[#2C2C2C]"
                      }`}
                    >
                      {isActive ? "Persona Ativa ✓" : `Assumir ${p.name.split(" ")[0]}`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. ANÁLISE COMPETITIVA */}
      {activeTab === "competicao" && (
        <section className="space-y-8 animate-fade-in">
          <div className="border-l-2 border-[#B8924A] pl-4 space-y-1">
            <span className="eyebrow">Capítulo 3 · Competição</span>
            <h2 className="font-serif text-3xl font-normal text-[#0A0A0A]">
              O <em className="italic text-[#8B6B30]">gap</em> que ninguém ocupou
            </h2>
          </div>

          <p className="text-xs text-[#2C2C2C] max-w-2xl leading-relaxed">
            Existe um espaço vago entre o preço baixo sem curadoria (Shein, Shopee, AliExpress) e a curadoria de luxo inacessível (Net-a-Porter, Farfetch com ticket de R$ 2.500). A Portal ocupa o quadrante exclusivo: <strong>Curadoria editorial + Ticket até R$ 250</strong>.
          </p>

          <div className="overflow-x-auto rounded-2xl border border-[#C9BFA8] bg-white shadow-sm">
            <table className="editorial">
              <thead>
                <tr>
                  <th>Plataforma</th>
                  <th>Preço</th>
                  <th>Curadoria</th>
                  <th>Confiança</th>
                  <th>Frete BR</th>
                  <th>Mobile UX</th>
                  <th>Posicionamento</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Shein</strong></td>
                  <td className="num">Muito baixo</td>
                  <td>Baixa (algoritmo)</td>
                  <td>Média</td>
                  <td className="num">15-30d</td>
                  <td>Boa</td>
                  <td>Volume sem identidade</td>
                </tr>
                <tr>
                  <td><strong>Shopee</strong></td>
                  <td className="num">Muito baixo</td>
                  <td>Baixa (marketplace)</td>
                  <td>Média</td>
                  <td className="num">10-25d</td>
                  <td>Razoável</td>
                  <td>Tudo para todos</td>
                </tr>
                <tr>
                  <td><strong>AliExpress</strong></td>
                  <td className="num">Baixo</td>
                  <td>Baixa</td>
                  <td>Baixa</td>
                  <td className="num">25-45d</td>
                  <td>Razoável</td>
                  <td>Custo acima de tudo</td>
                </tr>
                <tr>
                  <td><strong>Mercado Livre</strong></td>
                  <td className="num">Médio</td>
                  <td>Baixa</td>
                  <td>Alta</td>
                  <td className="num">5-10d</td>
                  <td>Muito boa</td>
                  <td>Conveniência nacional</td>
                </tr>
                <tr>
                  <td><strong>Net-a-Porter</strong></td>
                  <td className="num">Muito alto</td>
                  <td>Muito alta (editorial)</td>
                  <td>Muito alta</td>
                  <td className="num">15-25d</td>
                  <td>Excelente</td>
                  <td>Luxo internacional</td>
                </tr>
                <tr>
                  <td><strong>Farfetch</strong></td>
                  <td className="num">Alto</td>
                  <td>Alta</td>
                  <td>Muito alta</td>
                  <td className="num">10-20d</td>
                  <td>Excelente</td>
                  <td>Boutiques globais</td>
                </tr>
                <tr className="bg-[#B8924A]/10 font-medium">
                  <td><strong className="text-[#8B6B30]">Portal Estilo Luxo</strong></td>
                  <td className="num text-[#8B6B30]">Baixo (até R$ 250)</td>
                  <td><strong className="text-[#0A0A0A]">Alta (Editorial de Revista)</strong></td>
                  <td>Alta (Unicentro Certificada)</td>
                  <td className="num">10-15d</td>
                  <td>Excelente</td>
                  <td><strong className="text-[#8B6B30]">Curadoria editorial de acessórios</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 5. BENCHMARKS & CASAS */}
      {activeTab === "benchmarks" && (
        <section className="space-y-8 animate-fade-in">
          <div className="border-l-2 border-[#B8924A] pl-4 space-y-1">
            <span className="eyebrow">Capítulo 4 & 5 · Benchmarks & Referências</span>
            <h2 className="font-serif text-3xl font-normal text-[#0A0A0A]">
              O vocabulário das <em className="italic text-[#8B6B30]">casas de luxo</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-[#C9BFA8] space-y-3">
              <span className="eyebrow text-[#0A0A0A]">Chanel · Paris 1910</span>
              <h3 className="font-serif text-xl text-[#0A0A0A]">Restrição cromática como luxo</h3>
              <p className="text-xs text-[#4A4A4A] leading-relaxed">
                Preto, off-white e acentos dourados. A Portal herda a disciplina: duas cores dominantes mais dourado, sem ruídos visuais.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#C9BFA8] space-y-3">
              <span className="eyebrow text-[#8B6B30]">Dior · Paris 1946</span>
              <h3 className="font-serif text-xl text-[#0A0A0A]">Embalagem como ritual</h3>
              <p className="text-xs text-[#4A4A4A] leading-relaxed">
                Caixa, papel seda cream e cartão assinado. Ticket acessível não impede ritual de unboxing memorável.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#C9BFA8] space-y-3">
              <span className="eyebrow text-[#B8924A]">Hermès · Paris 1837</span>
              <h3 className="font-serif text-xl text-[#0A0A0A]">O produto é o herói</h3>
              <p className="text-xs text-[#4A4A4A] leading-relaxed">
                Fotografia em estúdio neutro, iluminação lateral e zero distrações. O acessório brilha por seus atributos e matérias-primas.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#C9BFA8] space-y-3">
              <span className="eyebrow text-[#0A0A0A]">Net-a-Porter · Londres 2000</span>
              <h3 className="font-serif text-xl text-[#0A0A0A]">Safra como edição de revista</h3>
              <p className="text-xs text-[#4A4A4A] leading-relaxed">
                Edições quinzenais com narrativa de estilo (80-120 palavras sobre styling) e confirmação ativa em cada etapa da entrega.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 6. JORNADA STORYBOARD */}
      {activeTab === "jornada" && (
        <section className="space-y-8 animate-fade-in">
          <div className="border-l-2 border-[#B8924A] pl-4 space-y-1">
            <span className="eyebrow">Capítulo 6 · Storyboard Visual da Cliente</span>
            <h2 className="font-serif text-3xl font-normal text-[#0A0A0A]">
              O dia em que <em className="italic text-[#8B6B30]">Maria Helena</em> encontrou a Portal
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                step: "1",
                time: "Terça · 09h41 · Entre reuniões",
                title: "Descoberta no Instagram",
                desc: "Post patrocinado com foto editorial do lenço. Toca e cai na home sem pop-ups agressivos. Vê a curadoria em 12s.",
                emotion: "Curiosidade leve: 'isso é diferente'",
              },
              {
                step: "2",
                time: "Terça · 13h20 · Almoço",
                title: "Pesquisa e Comparação",
                desc: "Lê a descrição editorial de 90 palavras sobre composição de viscose e corante natural. Sente que alguém escolheu por ela.",
                emotion: "Respeito: 'alguém fez a curadoria'",
              },
              {
                step: "3",
                time: "Terça · 22h15 · No sofá",
                title: "Resumo Transparente & Cadastro 90s",
                desc: "Adiciona ao carrinho. Mercadoria R$ 110, Frete R$ 25, ICMS R$ 27,65. Total R$ 162,65 sem letras miúdas. Cadastro KYC ágil no banco parceiro.",
                emotion: "Confiança: 'ambiente seguro de banco'",
              },
              {
                step: "4",
                time: "Terça · 22h17 · Pagamento",
                title: "Pix Split Automático em 3s",
                desc: "Paga no app do seu banco. A tela aprova em 3 segundos. O Pix se divide em Portal (20%), Unicentro PY, Epyx e impostos.",
                emotion: "Alívio: 'rápido e sem surpresas'",
              },
              {
                step: "5",
                time: "12 dias depois · 11h08 · Em casa",
                title: "Recebimento pelos Correios (Sem Silêncio)",
                desc: "Recebe o pacote dos Correios, já desembaraçado pela Receita Federal. Dentro: lenço em papel seda com cartão assinado da editora.",
                emotion: "Encantamento: 'superou a expectativa'",
              },
              {
                step: "6",
                time: "+3 dias · 19h30 · Jantar com amigas",
                title: "Indicação Orgânica & CAC Zero",
                desc: "Usa o lenço no jantar. Duas amigas perguntam onde comprou. Ela indica a Portal e ganha R$ 15 de crédito.",
                emotion: "Orgulho: 'eu descobri primeiro'",
              },
            ].map((scene) => (
              <div
                key={scene.step}
                className="grid grid-cols-1 sm:grid-cols-[60px_1fr] gap-4 p-5 rounded-2xl bg-white border border-[#C9BFA8] shadow-sm items-start"
              >
                <div className="italic-serif text-4xl text-[#B8924A] font-bold leading-none">
                  {scene.step}
                </div>
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-serif text-lg text-[#0A0A0A] font-medium">{scene.title}</h3>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#8C8275]">{scene.time}</span>
                  </div>
                  <p className="text-xs text-[#4A4A4A] leading-relaxed">{scene.desc}</p>
                  <span className="inline-block text-[11px] italic-serif text-[#8B6B30] bg-[#F0EBE0] px-2.5 py-1 rounded-md mt-2">
                    {scene.emotion}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. BRAND BOOK */}
      {activeTab === "brandbook" && (
        <section className="space-y-8 animate-fade-in">
          <div className="border-l-2 border-[#B8924A] pl-4 space-y-1">
            <span className="eyebrow">Capítulo 8 · Brand Book Resumido</span>
            <h2 className="font-serif text-3xl font-normal text-[#0A0A0A]">
              A identidade visual <em className="italic text-[#8B6B30]">editorial</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-serif text-xl text-[#0A0A0A]">Paleta Cromática (5 Cores)</h3>
              <div className="space-y-2.5">
                {[
                  { name: "Creme Editorial", hex: "#FAF7F2", pct: "65% da área", use: "Fundo principal e respiração" },
                  { name: "Creme Profundo", hex: "#F0EBE0", pct: "Fundos de apoio", use: "Cards, modais e resumos" },
                  { name: "Preto Profundo", hex: "#0A0A0A", pct: "20% da área", use: "Tipografia primária e botões pretos" },
                  { name: "Dourado Champagne", hex: "#B8924A", pct: "8% da área", use: "Acentos nobres e botões hero" },
                  { name: "Grafite", hex: "#2C2C2C", pct: "5% da área", use: "Tipografia secundária de leitura" },
                  { name: "Linha Pedra", hex: "#C9BFA8", pct: "2% da área", use: "Divisores sutis e bordas refinadas" },
                ].map((c) => (
                  <div key={c.hex} className="flex items-center gap-3 p-3 bg-white border border-[#C9BFA8] rounded-xl">
                    <div
                      className="w-10 h-10 rounded-lg border border-[#C9BFA8] shrink-0"
                      style={{ backgroundColor: c.hex }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#0A0A0A]">{c.name}</span>
                        <span className="font-mono text-[#8B6B30]">{c.hex}</span>
                      </div>
                      <span className="text-[10px] text-[#8C8275]">{c.pct} · {c.use}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-serif text-xl text-[#0A0A0A]">Tipografia de Revista</h3>
              <div className="space-y-4">
                <div className="p-4 bg-white border border-[#C9BFA8] rounded-xl space-y-1">
                  <div className="font-serif text-2xl text-[#0A0A0A]">Playfair Display</div>
                  <div className="text-[10px] uppercase font-mono text-[#8C8275]">Serif · Pesos 400 / 700 / 900</div>
                  <p className="text-xs text-[#4A4A4A]">Títulos editoriais, nomes de coleção e cabeçalhos de alta costura.</p>
                </div>

                <div className="p-4 bg-white border border-[#C9BFA8] rounded-xl space-y-1">
                  <div className="italic-serif text-2xl text-[#8B6B30]">Cormorant Garamond</div>
                  <div className="text-[10px] uppercase font-mono text-[#8C8275]">Serif Italic · Pesos 300 / 500</div>
                  <p className="text-xs text-[#4A4A4A]">Números hero, epígrafes, legendas poéticas e preços destacados.</p>
                </div>

                <div className="p-4 bg-white border border-[#C9BFA8] rounded-xl space-y-1">
                  <div className="font-sans text-xl font-medium text-[#0A0A0A]">Inter</div>
                  <div className="text-[10px] uppercase font-mono text-[#8C8275]">Sans-serif · Pesos 400 / 500 / 700</div>
                  <p className="text-xs text-[#4A4A4A]">Corpo de texto, tabelas, formulários, botões e interfaces móveis.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 8. FLUXO PIX SPLIT */}
      {activeTab === "split" && (
        <section className="space-y-8 animate-fade-in">
          <div className="border-l-2 border-[#B8924A] pl-4 space-y-1">
            <span className="eyebrow">Capítulo 14 · Fluxo do Dinheiro</span>
            <h2 className="font-serif text-3xl font-normal text-[#0A0A0A]">
              Como o <em className="italic text-[#8B6B30]">dinheiro</em> circula
            </h2>
          </div>

          <p className="text-xs text-[#2C2C2C] max-w-2xl leading-relaxed">
            Um único Pix pago pela cliente é dividido automaticamente em quatro destinos pelo Banco Parceiro regulado pelo Bacen. A Portal Estilo Luxo nunca retém o dinheiro da venda — recebe apenas seus 20% de comissão limpa na hora.
          </p>

          <div className="p-6 bg-white border border-[#C9BFA8] rounded-2xl shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#0A0A0A] text-[#FAF7F2] rounded-xl">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#D9BE85] block">Origem Única</span>
                <span className="font-serif text-xl">Pix da Cliente Brasileira</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#C9BFA8]">Valor final na tela</span>
                <span className="italic-serif text-2xl font-bold text-[#B8924A] block">100% no Checkout</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#F0EBE0] border border-[#B8924A] space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#8B6B30]">1. Portal Estilo Luxo</span>
                <div className="italic-serif text-3xl font-bold text-[#8B6B30]">20%</div>
                <p className="text-[11px] text-[#4A4A4A]">
                  Comissão de curadoria em reais, direto na conta da Portal, instantâneo e sem risco cambial.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F0EBE0] border border-[#C9BFA8] space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#0A0A0A]">2. Unicentro (PY)</span>
                <div className="italic-serif text-3xl font-bold text-[#0A0A0A]">~71%</div>
                <p className="text-[11px] text-[#4A4A4A]">
                  Valor FOB da mercadoria + frete e margem, transferido via câmbio regulado Bacen.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F0EBE0] border border-[#C9BFA8] space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#0A0A0A]">3. Plataforma Epyx</span>
                <div className="italic-serif text-3xl font-bold text-[#0A0A0A]">~5%</div>
                <p className="text-[11px] text-[#4A4A4A]">
                  Remuneração de infraestrutura e-commerce, liquidada em conta internacional.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F0EBE0] border border-[#C9BFA8] space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#0A0A0A]">4. Tributos</span>
                <div className="italic-serif text-3xl font-bold text-[#0A0A0A]">~4%</div>
                <p className="text-[11px] text-[#4A4A4A]">
                  ICMS estadual do estado de destino da cliente, recolhido na fonte.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 9. SIMULADOR DA CONTA */}
      {activeTab === "conta" && (
        <section className="space-y-8 animate-fade-in">
          <div className="border-l-2 border-[#B8924A] pl-4 space-y-1">
            <span className="eyebrow">Capítulo 18 · Exemplos Práticos</span>
            <h2 className="font-serif text-3xl font-normal text-[#0A0A0A]">
              Simulador da <em className="italic text-[#8B6B30]">Conta</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="p-6 bg-white border border-[#C9BFA8] rounded-2xl shadow-sm space-y-6">
              <h3 className="font-serif text-xl text-[#0A0A0A]">Parâmetros de Simulação</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#4A4A4A]">Valor da Mercadoria (FOB):</span>
                  <span className="font-bold text-[#0A0A0A]">US$ {simFobUsd}.00 (R$ {mercadoriaBrl.toFixed(2)})</span>
                </div>
                <div className="flex gap-2">
                  {[20, 30, 45].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setSimFobUsd(val)}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${
                        simFobUsd === val
                          ? "bg-[#B8924A] text-[#0A0A0A]"
                          : "bg-[#F0EBE0] text-[#2C2C2C] hover:bg-[#C9BFA8]/40"
                      }`}
                    >
                      US$ {val} {val === 20 ? "(Lenço)" : val === 30 ? "(Brinco/Cinto)" : "(Bolsa)"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-[#F0EBE0] rounded-xl space-y-3 border border-[#C9BFA8]">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#0A0A0A]">Simular Risco Tributário:</span>
                  <span className="text-[10px] uppercase font-mono text-[#8B6B30]">
                    {includeFederalTax ? "Com II 20%" : "Remessa Conforme Atual (II 0%)"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIncludeFederalTax(!includeFederalTax)}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
                    includeFederalTax
                      ? "bg-[#A84E4E] text-[#FAF7F2]"
                      : "bg-[#0A0A0A] text-[#FAF7F2] hover:bg-[#2C2C2C]"
                  }`}
                >
                  {includeFederalTax ? "Desativar II 20% (Voltar para Isenção)" : "Testar Cenário com Imposto de Importação 20%"}
                </button>
              </div>
            </div>

            <div className="p-6 bg-[#0A0A0A] text-[#FAF7F2] rounded-2xl shadow-xl space-y-4">
              <span className="eyebrow text-[#D9BE85]">Resultado na Tela da Cliente</span>
              
              <div className="space-y-2 border-b border-[#C9BFA8]/30 pb-4 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#C9BFA8]">Mercadoria FOB (câmbio R$ 5,00):</span>
                  <span>R$ {mercadoriaBrl.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#C9BFA8]">Frete Correios Internacional:</span>
                  <span>R$ {freteBrl.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#C9BFA8]">Imposto Federal Remessa Conforme:</span>
                  <span className={includeFederalTax ? "text-[#D9BE85] font-bold" : "text-[#5B8254]"}>
                    {includeFederalTax ? `R$ ${iiBrl.toFixed(2)} (20%)` : "R$ 0,00 (Isento)"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#C9BFA8]">ICMS Estadual (17% por dentro):</span>
                  <span>R$ {icmsBrl.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <span className="font-serif text-lg text-[#FAF7F2]">Total Pago no Pix:</span>
                <span className="italic-serif text-3xl font-bold text-[#B8924A]">
                  R$ {totalBrl.toFixed(2)}
                </span>
              </div>

              <div className="pt-3 border-t border-[#C9BFA8]/30 space-y-2 text-xs">
                <div className="flex justify-between text-[#D9BE85] font-semibold">
                  <span>Comissão Líquida da Portal (20%):</span>
                  <span>R$ {comissaoPortal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#C9BFA8]">
                  <span>Repasse Unicentro PY:</span>
                  <span>R$ {repasseUnicentro.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#C9BFA8]">
                  <span>Taxa Epyx (5%):</span>
                  <span>R$ {epyxPlataforma.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 10. ROADMAP */}
      {activeTab === "roadmap" && (
        <section className="space-y-8 animate-fade-in">
          <div className="border-l-2 border-[#B8924A] pl-4 space-y-1">
            <span className="eyebrow">Capítulo 19 & 21 · Execução & Roadmap</span>
            <h2 className="font-serif text-3xl font-normal text-[#0A0A0A]">
              Quatro trimestres, do <em className="italic text-[#8B6B30]">piloto</em> à escala
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                q: "Q1",
                period: "Nov 26 · Jan 27",
                theme: "Piloto Black Friday",
                items: [
                  "Contrato de representação Portal × Unicentro",
                  "Parecer jurídico do split Pix Bacen",
                  "Banco parceiro homologado",
                  "Curadoria: 8-12 itens iniciais",
                  "Black Friday: 800 pedidos",
                  "Natal: 1.200 pedidos",
                ],
                meta: "2.000 pedidos · GMV R$ 240 mil",
              },
              {
                q: "Q2",
                period: "Fev · Abr 27",
                theme: "Expansão de Catálogo",
                items: [
                  "Curadoria: 25-30 itens",
                  "Novas categorias: cintos e saídas de praia",
                  "E-mail editorial quinzenal",
                  "Programa de indicação ativo",
                  "Dia das Mães: 3.500 pedidos",
                  "NPS inicial ≥ 70",
                ],
                meta: "6.500 pedidos · GMV R$ 820 mil",
              },
              {
                q: "Q3",
                period: "Mai · Jul 27",
                theme: "Otimização Mobile",
                items: [
                  "App mobile nativo PWA com push",
                  "Personalização editorial por persona",
                  "Tracking Correios em tempo real",
                  "Programa de fidelidade 'Safra'",
                  "Dia dos Namorados: 4.200 pedidos",
                  "CAC abaixo de R$ 25",
                ],
                meta: "11.000 pedidos · GMV R$ 1,5 mi",
              },
              {
                q: "Q4",
                period: "Ago · Out 27",
                theme: "Escala Nacional",
                items: [
                  "Curadoria: 50-60 itens",
                  "Operação em 5 estados-chave",
                  "Parceria com loja conceito física",
                  "Black Friday 2027: 18.000 pedidos",
                  "Preparar rodada de Série A",
                ],
                meta: "18.500 pedidos · GMV R$ 2,7 mi",
              },
            ].map((col) => (
              <div key={col.q} className="p-5 bg-white border-t-4 border-[#B8924A] rounded-2xl border border-[#C9BFA8] space-y-3 shadow-sm flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="italic-serif text-3xl font-bold text-[#8B6B30]">{col.q}</span>
                    <span className="text-[10px] uppercase font-mono text-[#8C8275]">{col.period}</span>
                  </div>
                  <h3 className="font-serif text-base text-[#0A0A0A] font-medium">{col.theme}</h3>
                  <ul className="space-y-1.5 text-[11px] text-[#4A4A4A] pt-2">
                    {col.items.map((it, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-[#B8924A] font-bold">·</span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-3 border-t border-[#C9BFA8]/60 text-[11px] italic-serif text-[#8B6B30] font-semibold">
                  {col.meta}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 11. GLOSSÁRIO */}
      {activeTab === "glossario" && (
        <section className="space-y-8 animate-fade-in">
          <div className="border-l-2 border-[#B8924A] pl-4 space-y-1">
            <span className="eyebrow">Anexo B · Glossário Regulatório</span>
            <h2 className="font-serif text-3xl font-normal text-[#0A0A0A]">
              Termos que <em className="italic text-[#8B6B30]">importam</em> para a Portal
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                term: "Remessa Conforme",
                desc: "Programa da Receita Federal (IN RFB 1.173/2023) com imposto de importação federal zerado até US$ 50 para pessoa física via empresas certificadas como a Unicentro.",
              },
              {
                term: "ICMS por Dentro",
                desc: "Imposto estadual calculado sobre a soma de mercadoria e frete, variando de 17% a 20.5% conforme a UF. Embutido no preço final no resumo antes do pagamento.",
              },
              {
                term: "FOB (Free On Board)",
                desc: "Preço da mercadoria na origem (Paraguai) sem frete nem tributos. Todos os itens da Portal custam até US$ 45 FOB para garantir conformidade com o teto de US$ 50.",
              },
              {
                term: "Split de Pagamento Pix",
                desc: "Mecanismo bancário que divide automaticamente o Pix em 4 partes no mesmo instante: Portal 20%, Unicentro PY ~71%, Epyx ~5%, Tributos estaduais ~4%.",
              },
              {
                term: "Contrato de Representação",
                desc: "Regulado pela Lei 4.886/1965. A Portal atua como representante comercial da Unicentro no Brasil sem assumir a propriedade das mercadorias nem risco cambial.",
              },
              {
                term: "CAC e LTV",
                desc: "Custo de Aquisição de Cliente estimado em R$ 28 no cenário base, com LTV projetado de R$ 245 em 12 meses — relação saudável de 8,7x.",
              },
            ].map((g) => (
              <div key={g.term} className="p-4 bg-white border border-[#C9BFA8] rounded-xl space-y-1">
                <span className="font-serif text-base text-[#0A0A0A] font-semibold block">{g.term}</span>
                <p className="text-xs text-[#4A4A4A] leading-relaxed">{g.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Rodapé do Pitch */}
      <footer className="pt-8 border-t border-[#C9BFA8] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8C8275]">
        <div className="flex items-center gap-2">
          <span className="font-serif text-sm text-[#0A0A0A]">Portal Estilo Luxo</span>
          <span>· Pitch Editorial Volume I · Outubro 2026</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/" className="text-[#8B6B30] hover:underline font-medium">
            Ir para a Loja Mobile →
          </Link>
        </div>
      </footer>
    </div>
  );
}
