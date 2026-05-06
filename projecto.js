const {
    Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
    Header, Footer, AlignmentType, HeadingLevel, LevelFormat, BorderStyle,
    WidthType, ShadingType, VerticalAlign, PageNumber, PageBreak
} = require("docx");
const fs = require("fs");
const path = require("path");

const GREEN = "1B4332";
const LGREENB = "D8F3DC";
const GOLD = "F4A261";
const GRAY = "6B7280";

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

function heading1(text) {
    return new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 360, after: 120 },
        children: [new TextRun({ text, bold: true, font: "Georgia", size: 32 })],
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "1B4332", space: 4 } }
    });
}

function heading2(text) {
    return new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 80 },
        children: [new TextRun({ text, bold: true, font: "Arial", size: 26, color: "2D6A4F" })]
    });
}

function para(runs, spacing = { before: 80, after: 120 }) {
    const children = Array.isArray(runs)
        ? runs
        : [new TextRun({ text: runs, font: "Arial", size: 22 })];
    return new Paragraph({ children, spacing });
}

function bullet(text, bold = false) {
    return new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { before: 40, after: 40 },
        children: [new TextRun({ text, font: "Arial", size: 22, bold })]
    });
}

function statRow(stat, description, color = GREEN) {
    return new TableRow({
        children: [
            new TableCell({
                width: { size: 1800, type: WidthType.DXA },
                borders,
                shading: { fill: LGREENB, type: ShadingType.CLEAR },
                margins: { top: 100, bottom: 100, left: 120, right: 120 },
                verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: stat, bold: true, size: 36, color, font: "Georgia" })]
                })]
            }),
            new TableCell({
                width: { size: 7560, type: WidthType.DXA },
                borders,
                margins: { top: 100, bottom: 100, left: 160, right: 120 },
                children: [para(description)]
            })
        ]
    });
}

function sectionBox(title, content, fillColor = LGREENB) {
    return new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [9360],
        rows: [
            new TableRow({
                children: [new TableCell({
                    width: { size: 9360, type: WidthType.DXA },
                    borders,
                    shading: { fill: fillColor, type: ShadingType.CLEAR },
                    margins: { top: 100, bottom: 100, left: 180, right: 180 },
                    children: [
                        new Paragraph({ children: [new TextRun({ text: title, bold: true, size: 24, font: "Arial", color: GREEN })] }),
                        ...content
                    ]
                })]
            })
        ]
    });
}

const doc = new Document({
    numbering: {
        config: [
            {
                reference: "bullets",
                levels: [{
                    level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
                    style: { paragraph: { indent: { left: 720, hanging: 360 } } }
                }]
            }
        ]
    },
    styles: {
        default: { document: { run: { font: "Arial", size: 22 } } },
        paragraphStyles: [
            {
                id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
                run: { size: 32, bold: true, font: "Georgia", color: GREEN },
                paragraph: { spacing: { before: 360, after: 120 }, outlineLevel: 0 }
            },
            {
                id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
                run: { size: 26, bold: true, font: "Arial", color: "2D6A4F" },
                paragraph: { spacing: { before: 240, after: 80 }, outlineLevel: 1 }
            },
        ]
    },
    sections: [{
        properties: {
            page: {
                size: { width: 11906, height: 16838 }, // A4
                margin: { top: 1440, right: 1260, bottom: 1440, left: 1260 }
            }
        },
        headers: {
            default: new Header({
                children: [
                    new Paragraph({
                        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: GREEN, space: 4 } },
                        children: [
                            new TextRun({ text: "AgroXitique  ", bold: true, font: "Georgia", size: 20, color: GREEN }),
                            new TextRun({ text: "| Proposta de Projecto — Mini Finckathon 2025", font: "Arial", size: 20, color: GRAY }),
                        ]
                    })
                ]
            })
        },
        footers: {
            default: new Footer({
                children: [
                    new Paragraph({
                        border: { top: { style: BorderStyle.SINGLE, size: 4, color: GREEN, space: 4 } },
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({ text: "UniLicungo · LicungoLab · M-Pesa & Fundação Vodacom  |  Pág. ", font: "Arial", size: 18, color: GRAY }),
                            new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 18, color: GRAY }),
                        ]
                    })
                ]
            })
        },
        children: [

            // ── CAPA ──────────────────────────────────────
            new Paragraph({ spacing: { before: 600 } }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "🌱 AgroXitique", bold: true, font: "Georgia", size: 72, color: GREEN })]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 120, after: 80 },
                children: [new TextRun({ text: "Poupança Colectiva e Crédito Agrícola Digital via M-Pesa", font: "Georgia", size: 32, color: "2D6A4F", italic: true })]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 80, after: 80 },
                children: [new TextRun({ text: "Proposta de Projecto — Mini Finckathon 2025", font: "Arial", size: 24, color: GRAY })]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 240, after: 60 },
                border: { top: { style: BorderStyle.SINGLE, size: 6, color: GREEN, space: 6 }, bottom: { style: BorderStyle.SINGLE, size: 6, color: GREEN, space: 6 } },
                children: [new TextRun({ text: "Equipa LicungoLab  ·  Universidade Licungo, Quelimane  ·  Maio 2025", font: "Arial", size: 20, color: GREEN, bold: true })]
            }),
            new Paragraph({
                spacing: { before: 60, after: 60 }, alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "M-Pesa & Fundação Vodacom | Cadeira de Programação Funcional", font: "Arial", size: 20, color: GOLD })]
            }),
            new Paragraph({ children: [new PageBreak()] }),

            // ── 1. SUMÁRIO EXECUTIVO ──────────────────────
            heading1("1. Sumário Executivo"),
            para([
                new TextRun({ text: "O AgroXitique ", bold: true, font: "Arial", size: 22 }),
                new TextRun({ text: "é uma plataforma de poupança colectiva e microcrédito agrícola que opera via USSD (*150#) integrado ao M-Pesa, sem necessidade de smartphone ou acesso à internet. O sistema permite que grupos de agricultores rurais da Zambézia e de todo Moçambique poupem em conjunto, construam um histórico financeiro digital e acedam a microcrédito para insumos agrícolas.", font: "Arial", size: 22 })
            ]),
            para("O projecto responde directamente ao desafio do Mini Finckathon 2025: melhorar o acesso e uso de serviços financeiros digitais em Moçambique, com foco nas populações rurais excluídas do sistema financeiro formal."),

            // ── 2. O PROBLEMA ─────────────────────────────
            heading1("2. O Problema"),
            heading2("2.1 Exclusão Financeira dos Agricultores Rurais"),
            para("Moçambique é maioritariamente agrícola, mas os agricultores rurais continuam à margem do sistema financeiro digital. Os dados são alarmantes:"),

            new Table({
                width: { size: 9360, type: WidthType.DXA },
                columnWidths: [1800, 7560],
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({
                                width: { size: 1800, type: WidthType.DXA }, borders, shading: { fill: GREEN, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
                                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Dado", bold: true, color: "FFFFFF", size: 22, font: "Arial" })] })]
                            }),
                            new TableCell({
                                width: { size: 7560, type: WidthType.DXA }, borders, shading: { fill: GREEN, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 160, right: 120 },
                                children: [new Paragraph({ children: [new TextRun({ text: "Descrição", bold: true, color: "FFFFFF", size: 22, font: "Arial" })] })]
                            }),
                        ]
                    }),
                    statRow("4%", "dos moçambicanos rurais têm acesso à banca móvel (vs. 31% urbanos) — INE, Censo 2017"),
                    statRow("2,8%", "do total dos empréstimos bancários chega ao sector agrícola — CIFAM/MADER 2024"),
                    statRow("1 t/ha", "produtividade do milho em Moçambique (África do Sul: 5 t/ha) — IGM 2025"),
                    statRow("<2%", "uso de fertilizantes na Zambézia e Sofala — Relatório IGM 2025"),
                ]
            }),
            new Paragraph({ spacing: { before: 120 } }),

            heading2("2.2 Contexto Específico da Zambézia"),
            para("A Zambézia é uma das províncias com maior potencial agrícola de Moçambique, mas também uma das mais afectadas pela falta de acesso a serviços financeiros rurais. A UniLicungo, sediada em Quelimane, está no centro desta realidade — o que torna este projecto particularmente relevante para a região."),

            // ── 3. A SOLUÇÃO ──────────────────────────────
            heading1("3. A Solução — AgroXitique"),
            heading2("3.1 Conceito Central"),
            para("O AgroXitique digitaliza e formaliza o conceito tradicional de xitique (poupança colectiva rotativa), já amplamente praticado em Moçambique, e acrescenta-lhe uma camada de crédito agrícola e histórico financeiro. Tudo via USSD — funciona em qualquer telemóvel, sem internet."),

            heading2("3.2 Módulos do Sistema"),
            new Paragraph({ spacing: { before: 80 } }),

            sectionBox("Módulo 1 — Poupança Colectiva AgroXitique", [
                bullet("Grupos de 5 a 15 agricultores formam um \"Círculo AgroXitique\" via *150#"),
                bullet("Cada membro contribui mensalmente (ex: 200 MT) via M-Pesa"),
                bullet("O fundo acumulado é guardado para a época de plantio (Setembro–Dezembro) ou distribuído de forma rotativa"),
                bullet("Transparência total: todos os membros recebem SMS de confirmação a cada transacção"),
            ]),
            new Paragraph({ spacing: { before: 100 } }),
            sectionBox("Módulo 2 — Score de Crédito Rural", [
                bullet("Cada contribuição a tempo gera pontos automáticos no sistema"),
                bullet("O histórico de 3 a 6 meses cria um perfil financeiro digital — algo que estes agricultores nunca tiveram"),
                bullet("O score é calculado com lógica de Programação Funcional (funções puras, resultados auditáveis)"),
                bullet("O score pode ser partilhado com bancos parceiros como o Banco Terra (100% USSD)"),
            ], "FFF3E0"),
            new Paragraph({ spacing: { before: 100 } }),
            sectionBox("Módulo 3 — Crédito para Insumos Agrícolas", [
                bullet("Com base no score, o grupo solicita microcrédito colectivo para fertilizantes e sementes"),
                bullet("Reembolso em parcelas pós-colheita, alinhadas ao calendário agrário de Moçambique"),
                bullet("Responsabilidade solidária do grupo reduz o risco de incumprimento"),
                bullet("Limite inicial de crédito cresce com o histórico de pontualidade do grupo"),
            ], "E8F5E9"),
            new Paragraph({ spacing: { before: 160 } }),

            heading2("3.3 Fluxo USSD — Experiência do Agricultor"),
            para("O agricultor marca *150# no seu telemóvel e vê o menu:"),
            bullet("1. Criar/Juntar Círculo"),
            bullet("2. Fazer Contribuição Mensal"),
            bullet("3. Consultar Saldo do Grupo"),
            bullet("4. Solicitar Crédito para Insumos"),
            bullet("5. Ver o Meu Score"),
            bullet("6. Histórico de Transacções"),
            para("Cada opção é confirmada com SMS automático. O sistema é acessível 24h/7 dias."),

            // ── 4. VALIDAÇÃO ──────────────────────────────
            heading1("4. Validação de Mercado"),
            para("O AgroXitique não parte do zero — baseia-se em evidências sólidas de que o mercado já validou os componentes essenciais da solução:"),
            bullet("O Xitique Digital do M-Pesa já atingiu 750.000 adesões em Moçambique em 2024"),
            bullet("A Vodafone M-Pesa e a GIZ assinaram um acordo em 2025 para expandir serviços financeiros digitais rurais, com prioridade para a Zambézia"),
            bullet("A startup Kuvula (crowdfunding para agricultores) captou USD 2,1 milhões em 2024"),
            bullet("O Banco Terra abriu 480.000 contas 100% via USSD — provando que o canal funciona"),
            bullet("A Estratégia de Inclusão Financeira de Moçambique 2025–2031 prioriza exactamente este tipo de solução"),

            // ── 5. ARQUITECTURA TÉCNICA ───────────────────
            heading1("5. Arquitectura Técnica"),
            heading2("5.1 Stack Tecnológico"),
            new Table({
                width: { size: 9360, type: WidthType.DXA },
                columnWidths: [2800, 6560],
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({
                                width: { size: 2800, type: WidthType.DXA }, borders, shading: { fill: GREEN, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
                                children: [new Paragraph({ children: [new TextRun({ text: "Camada", bold: true, color: "FFFFFF", size: 22, font: "Arial" })] })]
                            }),
                            new TableCell({
                                width: { size: 6560, type: WidthType.DXA }, borders, shading: { fill: GREEN, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 160, right: 120 },
                                children: [new Paragraph({ children: [new TextRun({ text: "Tecnologia / Componente", bold: true, color: "FFFFFF", size: 22, font: "Arial" })] })]
                            }),
                        ]
                    }),
                    ...[
                        ["Canal de Acesso", "USSD (*150#) — sem internet, sem smartphone"],
                        ["Pagamentos", "M-Pesa API — Vodacom Moçambique"],
                        ["Lógica de Negócio", "Engine AgroXitique — Score calculado com Programação Funcional (Haskell)"],
                        ["Notificações", "SMS automático após cada transacção"],
                        ["Base de Dados", "Histórico de grupos, contribuições e scores"],
                        ["Integração Bancária", "API Banco Terra / bancos comerciais parceiros"],
                    ].map(([c, d]) => new TableRow({
                        children: [
                            new TableCell({ width: { size: 2800, type: WidthType.DXA }, borders, shading: { fill: LGREENB, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [para([new TextRun({ text: c, bold: true, font: "Arial", size: 22 })])] }),
                            new TableCell({ width: { size: 6560, type: WidthType.DXA }, borders, margins: { top: 80, bottom: 80, left: 160, right: 120 }, children: [para(d)] }),
                        ]
                    }))
                ]
            }),
            new Paragraph({ spacing: { before: 160 } }),

            heading2("5.2 Ligação à Programação Funcional"),
            para("O módulo de cálculo do Score de Crédito é implementado usando princípios de Programação Funcional (Haskell). As vantagens são:"),
            bullet("Funções puras — o mesmo input produz sempre o mesmo score, garantindo justiça e auditabilidade"),
            bullet("Composabilidade — regras de pontuação são combinadas como funções simples"),
            bullet("Testabilidade — cada regra pode ser testada isoladamente com GHCi"),
            para("Exemplo conceptual em Haskell:"),
            new Paragraph({
                spacing: { before: 80, after: 80 },
                shading: { fill: "1F2937", type: ShadingType.CLEAR },
                children: [
                    new TextRun({ text: "calcularScore :: [Contribuicao] -> Score", font: "Consolas", size: 18, color: "86EFAC", break: 0 }),
                    new TextRun({ text: "\ncalcularScore contribs = pontuacaoPontualidade + bonusGrupo", font: "Consolas", size: 18, color: "FDE68A", break: 1 }),
                    new TextRun({ text: "\n  where pontuacaoPontualidade = length (filter emDia contribs) * 10", font: "Consolas", size: 18, color: "FFFFFF", break: 1 }),
                    new TextRun({ text: "\n        bonusGrupo = if tamanhoGrupo > 10 then 20 else 0", font: "Consolas", size: 18, color: "FFFFFF", break: 1 }),
                ]
            }),

            // ── 6. IMPACTO ────────────────────────────────
            heading1("6. Impacto Esperado"),
            new Table({
                width: { size: 9360, type: WidthType.DXA },
                columnWidths: [3500, 5860],
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({ width: { size: 3500, type: WidthType.DXA }, borders, shading: { fill: GREEN, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Dimensão de Impacto", bold: true, color: "FFFFFF", size: 22, font: "Arial" })] })] }),
                            new TableCell({ width: { size: 5860, type: WidthType.DXA }, borders, shading: { fill: GREEN, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 160, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Como o AgroXitique Contribui", bold: true, color: "FFFFFF", size: 22, font: "Arial" })] })] }),
                        ]
                    }),
                    ...[
                        ["Inclusão Financeira", "Agricultores sem conta bancária criam histórico financeiro digital via M-Pesa"],
                        ["Segurança Alimentar", "Acesso a crédito para insumos aumenta a produtividade agrícola"],
                        ["Equidade de Género", "Foco em mulheres agricultoras, seguindo o modelo Xitique já validado"],
                        ["Escalabilidade", "Replicável em todas as províncias usando infra-estrutura M-Pesa existente"],
                        ["Resiliência Comunitária", "Grupos com responsabilidade solidária fortalecem o tecido social rural"],
                        ["Alinhamento Estratégico", "Cumpre os objectivos da Estratégia de Inclusão Financeira 2025–2031"],
                    ].map(([c, d]) => new TableRow({
                        children: [
                            new TableCell({ width: { size: 3500, type: WidthType.DXA }, borders, shading: { fill: LGREENB, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [para([new TextRun({ text: c, bold: true, font: "Arial", size: 22 })])] }),
                            new TableCell({ width: { size: 5860, type: WidthType.DXA }, borders, margins: { top: 80, bottom: 80, left: 160, right: 120 }, children: [para(d)] }),
                        ]
                    }))
                ]
            }),
            new Paragraph({ spacing: { before: 160 } }),

            // ── 7. EQUIPA ─────────────────────────────────
            heading1("7. Equipa e Orientação"),
            bullet("Equipa: LicungoLab — até 3 estudantes do 1.º ano de Informática, UniLicungo"),
            bullet("Professor Orientador: Docente da Cadeira de Programação Funcional, UniLicungo"),
            bullet("Equilíbrio de género e diversificação de cursos conforme as regras do Mini Finckathon"),
            bullet("Mentoria: Parceiros M-Pesa e Fundação Vodacom durante o mês de Maio 2025"),

            // ── 8. PRÓXIMOS PASSOS ────────────────────────
            heading1("8. Próximos Passos"),
            bullet("Semana 1–2 de Maio: Desenvolvimento do protótipo USSD e motor de score em Haskell"),
            bullet("Semana 2 de Maio: Testes com grupo piloto de 5 agricultores da região de Quelimane"),
            bullet("Semana 3–4 de Maio: Apresentação ao júri e refinamento com base no feedback"),
            bullet("Pós-Finckathon: Parceria com M-Pesa e GIZ para piloto real na Zambézia"),

            // ── RODAPÉ ────────────────────────────────────
            new Paragraph({
                spacing: { before: 480 },
                border: { top: { style: BorderStyle.SINGLE, size: 6, color: GREEN, space: 6 } },
                alignment: AlignmentType.CENTER,
                children: [
                    new TextRun({ text: "AgroXitique · Raízes Digitais. Colheitas Reais.", bold: true, font: "Georgia", size: 22, color: GREEN }),
                    new TextRun({ text: "\nUniLicungo · LicungoLab · Mini Finckathon 2025 · M-Pesa & Fundação Vodacom", font: "Arial", size: 18, color: GRAY, break: 1 }),
                ]
            })
        ]
    }]
});

Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync(path.join(__dirname, "AgroXitique_Proposta.docx"), buffer);
    console.log("DOCX criado com sucesso!");
}).catch(e => { console.error(e); process.exit(1); });