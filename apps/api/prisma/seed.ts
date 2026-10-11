import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Portal Estilo Luxo database (6 categorias + 10 acessórios Unicentro < US$ 45 FOB)...");

  const categoriesData = [
    { slug: "bijuterias", name: "Bijuterias Finas", description: "Peças banhadas a ouro 18k e ródio curadas na Unicentro", sortOrder: 1 },
    { slug: "lencos", name: "Lenços & Echarpes", description: "Seda acetinada e tecidos leves com estamparia exclusiva", sortOrder: 2 },
    { slug: "bolsas", name: "Bolsas & Clutches", description: "Bolsas artesanais, palha trançada e couro vegano estruturado", sortOrder: 3 },
    { slug: "oculos", name: "Óculos de Sol", description: "Armações de acetato italiano com proteção UV400 certificada", sortOrder: 4 },
    { slug: "relogios", name: "Relógios", description: "Design minimalista suíço-inspirado abaixo de US$ 45 FOB", sortOrder: 5 },
    { slug: "cintos", name: "Cintos & Fivelas", description: "Couro legítimo e fivelas esculturais douradas", sortOrder: 6 },
  ];

  const categories: Record<string, string> = {};
  for (const cat of categoriesData) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categories[cat.slug] = record.id;
  }

  const productsData = [
    {
      slug: "brinco-gota-dourado-imperial",
      sku: "UNI-BIJ-001",
      unicentroId: "PY-UNI-9001",
      categorySlug: "bijuterias",
      name: "Brinco Gota Dourado Imperial",
      description: "Brinco escultural em formato gota orgânica com banho de ouro 18k triplo e acabamento espelhado hipoalergênico.",
      material: "Latão nobre banhado a Ouro 18k (3 milésimos)",
      dimensions: "2,8 cm x 1,6 cm",
      weightGrams: 18,
      careInstructions: "Evitar contato direto com perfumes. Guardar no saquinho de veludo Portal.",
      fobPriceUsd: 18.0,
      compareAtBrl: 169.0,
      ncmCode: "71171900",
      isNew: true,
      stockQty: 42,
      imageUrl: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=900&q=85",
    },
    {
      slug: "lenco-seda-riviera-esmeralda",
      sku: "UNI-LEN-002",
      unicentroId: "PY-UNI-9002",
      categorySlug: "lencos",
      name: "Lenço Seda Riviera Esmeralda",
      description: "Lenço carré 70x70cm em twill de seda acetinada com estampa equestre e bordas enroladas à mão.",
      material: "100% Twill de Seda Acetinada",
      dimensions: "70 cm x 70 cm",
      weightGrams: 45,
      careInstructions: "Lavagem a seco ou à mão em água fria com sabão neutro.",
      fobPriceUsd: 22.0,
      compareAtBrl: 198.0,
      ncmCode: "62141000",
      isNew: true,
      stockQty: 19,
      imageUrl: "https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?auto=format&fit=crop&w=900&q=85",
    },
    {
      slug: "bolsa-palha-trancada-encarnacion",
      sku: "UNI-BOL-003",
      unicentroId: "PY-UNI-9003",
      categorySlug: "bolsas",
      name: "Bolsa Palha Trançada Encarnación",
      description: "Bolsa tiracolo estruturada em fibra natural trançada e alça em couro caramelo com fecho magnético dourado.",
      material: "Palha natural selecionada + Couro legítimo",
      dimensions: "24 cm x 17 cm x 9 cm",
      weightGrams: 340,
      careInstructions: "Limpar com pano seco e macio. Manter em local arejado.",
      fobPriceUsd: 42.0,
      compareAtBrl: 389.0,
      ncmCode: "42022220",
      isNew: false,
      stockQty: 3,
      imageUrl: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=85",
    },
    {
      slug: "oculos-acetato-tortoise-milano",
      sku: "UNI-OCU-004",
      unicentroId: "PY-UNI-9004",
      categorySlug: "oculos",
      name: "Óculos Acetato Tortoise Milano",
      description: "Armação retangular retrô em acetato Mazzucchelli tartaruga com lentes degradê âmbar proteção UV400.",
      material: "Acetato Italiano + Lentes Policarbonato UV400",
      dimensions: "14,2 cm frontal · haste 14,5 cm",
      weightGrams: 32,
      careInstructions: "Acompanha estojo rígido e flanela de microfibra.",
      fobPriceUsd: 34.0,
      compareAtBrl: 310.0,
      ncmCode: "90041000",
      isNew: true,
      stockQty: 27,
      imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85",
    },
    {
      slug: "colar-elo-portugues-champagne",
      sku: "UNI-BIJ-005",
      unicentroId: "PY-UNI-9005",
      categorySlug: "bijuterias",
      name: "Colar Elo Português Champagne",
      description: "Choker em elos portugueses diamantados com fecho boia escultural e banho dourado champagne.",
      material: "Liga nobre banhada a Ouro 18k",
      dimensions: "45 cm ajustável",
      weightGrams: 38,
      careInstructions: "Limpar com flanela mágica seca após o uso.",
      fobPriceUsd: 28.0,
      compareAtBrl: 249.0,
      ncmCode: "71171900",
      isNew: false,
      stockQty: 15,
      imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85",
    },
    {
      slug: "relogio-minimal-petite-gold",
      sku: "UNI-REL-006",
      unicentroId: "PY-UNI-9006",
      categorySlug: "relogios",
      name: "Relógio Minimal Petite Gold",
      description: "Caixa octogonal slim de 26mm com mostrador madrepérola e pulseira malha milanesa dourada.",
      material: "Aço Inoxidável 316L + Movimento Quartz Japonês",
      dimensions: "Caixa 26 mm · Espessura 6,5 mm",
      weightGrams: 52,
      careInstructions: "Resistente a respingos (3 ATM).",
      fobPriceUsd: 44.0,
      compareAtBrl: 420.0,
      ncmCode: "91021100",
      isNew: true,
      stockQty: 2,
      imageUrl: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=85",
    },
    {
      slug: "cinto-couro-fivela-escultural",
      sku: "UNI-CIN-007",
      unicentroId: "PY-UNI-9007",
      categorySlug: "cintos",
      name: "Cinto Couro Fivela Escultural",
      description: "Cinto em couro legítimo preto fosco com fivela orgânica banhada a ouro velho.",
      material: "100% Couro Bovino + Fivela Zamac Ouro",
      dimensions: "Largura 2,5 cm · Tam M (95 cm)",
      weightGrams: 110,
      careInstructions: "Hidratar o couro semestralmente.",
      fobPriceUsd: 26.0,
      compareAtBrl: 215.0,
      ncmCode: "42033000",
      isNew: false,
      stockQty: 31,
      imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85",
    },
    {
      slug: "clutch-noite-veludo-obsidian",
      sku: "UNI-BOL-008",
      unicentroId: "PY-UNI-9008",
      categorySlug: "bolsas",
      name: "Clutch Noite Veludo Obsidian",
      description: "Clutch estruturada em veludo preto profundo com alça corrente removível e fecho esférico dourado.",
      material: "Veludo Italiano + Metais Dourados",
      dimensions: "20 cm x 12 cm x 5 cm",
      weightGrams: 260,
      careInstructions: "Escovar suavemente no sentido do pelo.",
      fobPriceUsd: 38.0,
      compareAtBrl: 340.0,
      ncmCode: "42022220",
      isNew: false,
      stockQty: 12,
      imageUrl: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=900&q=85",
    },
  ];

  for (const prod of productsData) {
    const { categorySlug, stockQty, imageUrl, ...fields } = prod;
    const product = await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        ...fields,
        categoryId: categories[categorySlug],
      },
      create: {
        ...fields,
        categoryId: categories[categorySlug],
      },
    });

    await prisma.productImage.upsert({
      where: { id: `img-${prod.sku}` },
      update: { url: imageUrl, altText: prod.name, sortOrder: 0 },
      create: { id: `img-${prod.sku}`, productId: product.id, url: imageUrl, altText: prod.name, sortOrder: 0 },
    });

    await prisma.stock.upsert({
      where: { productId: product.id },
      update: { quantity: stockQty, unicentroRef: prod.unicentroId },
      create: { productId: product.id, quantity: stockQty, reserved: 0, unicentroRef: prod.unicentroId },
    });
  }

  console.log("✅ Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
