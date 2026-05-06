const pptxgen = require("pptxgenjs");
const path = require("path");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title = "AgroXitique - Mini Finckathon 2025";

// Color palette
const C = {
    darkGreen: "1B4332",
    midGreen: "2D6A4F",
    leafGreen: "52B788",
    lightGreen: "D8F3DC",
    gold: "F4A261",
    darkGold: "C77622",
    white: "FFFFFF",
    offWhite: "F8FAF9",
    gray: "6B7280",
    darkGray: "1F2937",
    red: "DC2626",
};

const makeShadow = () => ({ type: "outer", blur: 8, offset: 3, angle: 135, color: "000000", opacity: 0.12 });

// ─────────────────────────────────────────────
// SLIDE 1: TITLE
// ─────────────────────────────────────────────
{
    const sl = pres.addSlide();
    sl.background = { color: C.darkGreen };

    sl.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.18, h: 5.625, fill: { color: C.leafGreen } });
    
    // Hero Image Overlay
    sl.addImage({ path: "assets/impact_hero.png", x: 6.0, y: 0, w: 4.0, h: 5.625, sizing: { type: "cover" } });
    sl.addShape(pres.shapes.RECTANGLE, { x: 6.0, y: 0, w: 0.05, h: 5.625, fill: { color: C.gold } });

    sl.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 0.55, w: 3.2, h: 0.38, fill: { color: C.gold }, rectRadius: 0.05 });
    sl.addText("Mini Finckathon 2025 · UniLicungo", { x: 0.5, y: 0.55, w: 3.2, h: 0.38, fontSize: 9, bold: true, color: C.darkGreen, align: "center", valign: "middle" });

    sl.addText("AgroXitique", { x: 0.5, y: 1.15, w: 5.5, h: 1.4, fontSize: 64, bold: true, color: C.white, fontFace: "Georgia" });
    sl.addText("Raízes Digitais.\nColheitas Reais.", { x: 0.5, y: 2.6, w: 5.5, h: 1.1, fontSize: 24, color: C.gold, italic: true });

    sl.addText("Poupança e Crédito Colectivo via M-Pesa", { x: 0.5, y: 3.8, w: 5.5, h: 0.4, fontSize: 14, color: C.lightGreen });

    sl.addText([
        { text: "Equipa: ", options: { bold: true, color: C.gold } },
        { text: "LicungoLab (UniLicungo)", options: { color: C.lightGreen } }
    ], { x: 0.5, y: 4.5, w: 5.5, h: 0.45, fontSize: 12 });
}

// ─────────────────────────────────────────────
// SLIDE 2: O PROBLEMA
// ─────────────────────────────────────────────
{
    const sl = pres.addSlide();
    sl.background = { color: C.offWhite };

    sl.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.darkGreen } });
    sl.addText("O Desafio Rural", { x: 0.4, y: 0, w: 9, h: 0.9, fontSize: 28, bold: true, color: C.white, fontFace: "Georgia", valign: "middle" });

    const cards = [
        { icon: "assets/icon_community.png", stat: "2,8%", label: "Crédito que chega ao campo", col: C.midGreen },
        { icon: "assets/icon_security.png", stat: "Zero", label: "Histórico financeiro digital", col: C.darkGold },
        { icon: "assets/icon_community.png", stat: "92%", label: "Dependência de informais", col: C.red },
    ];

    cards.forEach((c, i) => {
        const x = 0.5 + i * 3.1;
        sl.addShape(pres.shapes.RECTANGLE, { x, y: 1.6, w: 2.8, h: 3.5, fill: { color: C.white }, shadow: makeShadow() });
        sl.addImage({ path: c.icon, x: x + 0.9, y: 1.8, w: 1.0, h: 1.0 });
        sl.addText(c.stat, { x, y: 3.0, w: 2.8, h: 0.7, fontSize: 32, bold: true, color: c.col, align: "center" });
        sl.addText(c.label, { x, y: 3.8, w: 2.8, h: 1.0, fontSize: 12, color: C.darkGray, align: "center" });
    });
}

// ─────────────────────────────────────────────
// SLIDE 4: COMO FUNCIONA (USSD FLOW)
// ─────────────────────────────────────────────
{
    const sl = pres.addSlide();
    sl.background = { color: C.darkGreen };

    sl.addText("Segurança e Simplicidade", { x: 0.4, y: 0.15, w: 9, h: 0.7, fontSize: 30, bold: true, color: C.white, fontFace: "Georgia" });

    // USSD screen mockup
    sl.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 1.25, w: 3.8, h: 3.9, fill: { color: "111827" }, rectRadius: 0.15 });
    sl.addText([
        { text: "AgroXitique\n", options: { bold: true, color: C.leafGreen, breakLine: true } },
        { text: "Introduza o PIN:\n\n", options: { color: "9CA3AF", breakLine: true } },
        { text: "****\n\n", options: { color: C.white, breakLine: true, align: "center", fontSize: 18 } },
        { text: "1. Consultar Poupança\n", options: { color: C.white, breakLine: true } },
        { text: "2. Fazer Contribuição\n", options: { color: C.white, breakLine: true } },
        { text: "3. Pedir Crédito\n\n", options: { color: C.white, breakLine: true } },
        { text: "0. Voltar", options: { color: C.gold } },
    ], { x: 0.65, y: 1.65, w: 3.1, h: 3.1, fontSize: 11, fontFace: "Consolas" });

    const steps = [
        { icon: "assets/icon_security.png", title: "ID & PIN M-Pesa", desc: "Acesso protegido por autenticação de dois factores." },
        { icon: "assets/icon_community.png", title: "Gestão de Círculo", desc: "Poupança colectiva gerida por regras comunitárias." },
        { icon: "assets/icon_security.png", title: "Score Haskell", desc: "Algoritmos auditáveis calculam o risco em tempo real." },
    ];

    steps.forEach((s, i) => {
        const y = 1.3 + i * 1.3;
        sl.addImage({ path: s.icon, x: 4.4, y: y + 0.1, w: 0.6, h: 0.6 });
        sl.addText(s.title, { x: 5.2, y: y, w: 4.5, h: 0.35, fontSize: 14, bold: true, color: C.gold });
        sl.addText(s.desc, { x: 5.2, y: y + 0.4, w: 4.5, h: 0.6, fontSize: 11, color: C.lightGreen });
    });
}

// ─────────────────────────────────────────────
// SLIDE 8 (NOVO): O MOTOR DA CONFIANÇA (HASKELL)
// ─────────────────────────────────────────────
{
    const sl = pres.addSlide();
    sl.background = { color: C.darkGreen };

    sl.addText("Haskell: O Motor da Confiança", { x: 0.5, y: 0.5, w: 9, h: 0.8, fontSize: 36, bold: true, color: C.gold, fontFace: "Georgia" });
    
    sl.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.4, w: 9, h: 0.05, fill: { color: C.leafGreen } });

    sl.addText("Porquê Programação Funcional no AgroXitique?", { x: 0.5, y: 1.6, w: 9, h: 0.5, fontSize: 18, color: C.white, bold: true });

    const points = [
        { t: "Integridade Financeira", d: "Funções puras eliminam erros de estado e transacções inválidas." },
        { t: "Cálculo de Score Auditável", d: "O risco é calculado por uma lógica matemática transparente e rigorosa." },
        { t: "Inovação Académica", d: "Uso de tecnologias de ponta para resolver problemas de base em Moçambique." }
    ];

    points.forEach((p, i) => {
        const y = 2.4 + i * 1.0;
        sl.addShape(pres.shapes.OVAL, { x: 0.6, y: y + 0.1, w: 0.2, h: 0.2, fill: { color: C.gold } });
        sl.addText(p.t, { x: 1.0, y, w: 8, h: 0.4, fontSize: 14, bold: true, color: C.lightGreen });
        sl.addText(p.d, { x: 1.0, y: y + 0.35, w: 8, h: 0.4, fontSize: 11, color: C.white });
    });

    sl.addText("LicungoLab: Ciência de Dados ao serviço do agricultor.", { x: 0.5, y: 5.1, w: 9, h: 0.4, fontSize: 10, italic: true, color: C.gray, align: "center" });
}

// Write file
pres.writeFile({ fileName: path.join(__dirname, "AgroXitique_Apresentacao.pptx") })
    .then(() => console.log("PPTX 'Humanizado' criado com sucesso!"))
    .catch(e => { console.error(e); process.exit(1); });