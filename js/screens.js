// ═══════════════════════════════════════════════════════════════
// AgroXitique — Ecrãs USSD
// Simulação de um fluxo AgroXitique dentro da moldura do M-Pesa
// ═══════════════════════════════════════════════════════════════

const AgroScreens = (() => {
    const S = () => AgroData.state;

    const progressBar = (val, max, len = 14) => {
        const filled = Math.round((val / max) * len);
        return "█".repeat(filled) + "░".repeat(len - filled);
    };

    const scoreLabel = (s) => {
        if (s >= 85) return "Excelente ★★★";
        if (s >= 70) return "Bom ★★";
        if (s >= 50) return "Regular ★";
        if (s >= 30) return "Fraco";
        return "Crítico";
    };

    const fmtMT = (v) => v.toLocaleString("pt") + " MT";
    const divider = '<span class="divider">─────────────────────</span>';

    const screens = {
        main: {
            title: "M-Pesa",
            body: () => `Bem-vindo ao M-Pesa.
            
1. Transferir dinheiro
2. Levantar dinheiro
3. Para Banco
4. Xitique M-Pesa
5. Comprar CREDELEC
6. Pagamentos
7. Seguros M-Pesa
8. Txuna M-Pesa
9. Minha Conta
0. Sair`,
            handler: (inp) => {
                const map = {
                    "1": "transfer_info",
                    "2": "withdraw_info",
                    "3": "bank_info",
                    "4": "xitique_menu",
                    "5": "credelec_info",
                    "6": "payments_info",
                    "7": "insurance_info",
                    "8": "txuna_info",
                    "9": "my_account"
                };
                if (inp === "0") {
                    AgroSimulator.resetSession();
                    return null;
                }
                return map[inp] || "main";
            }
        },

        transfer_info: {
            title: "Transferir dinheiro",
            body: () => `Fluxo real M-Pesa
---------------------
Nas páginas oficiais:
1. Digita *150#
2. Escolhe M-Pesa
3. Transferir dinheiro
4. Número
5. Valor
6. PIN
7. Confirmar

Nesta demo o foco é o
Xitique agrícola.

0. Voltar`,
            handler: () => "main"
        },

        withdraw_info: {
            title: "Levantar dinheiro",
            body: () => `Operação da carteira
---------------------
Levantamento não faz parte
da demo principal.

Aqui mostramos como um
serviço agrícola pode viver
dentro do *150# real.

0. Voltar`,
            handler: () => "main"
        },

        bank_info: {
            title: "Para Banco",
            body: () => `Para Banco
---------------------
Exemplo oficial encontrado:
*150# > 3 Para Banco >
3 Millennium BIM

Mantivemos o projecto no
menu Xitique M-Pesa para
ficar mais coerente.

0. Voltar`,
            handler: () => "main"
        },

        credelec_info: {
            title: "Comprar CREDELEC",
            body: () => `Comprar CREDELEC
---------------------
O portal da Vodacom MZ
indica este menu como
opção 5 no *150#.

Nesta demo não simulamos
energia; simulamos Xitique
agrícola e crédito do grupo.

0. Voltar`,
            handler: () => "main"
        },

        payments_info: {
            title: "Pagamentos",
            body: () => `Pagamentos M-Pesa
---------------------
Fluxo oficial citado:
*150# > 6 Pagamentos

Exemplos reais:
- TV
- Água
- Seguros

As confirmações chegam
por SMS.

0. Voltar`,
            handler: () => "main"
        },

        txuna_info: {
            title: "Txuna M-Pesa",
            body: () => `Txuna M-Pesa
---------------------
O Txuna é o crédito oficial
disponível no ecossistema
M-Pesa.

No AgroXitique, o módulo
de crédito do grupo é uma
extensão académica desse
tipo de experiência.

0. Voltar`,
            handler: () => "main"
        },

        insurance_info: {
            title: "Seguros M-Pesa",
            body: () => `Seguros M-Pesa
---------------------
Material oficial recente
mostra a opção 7 ligada
a Seguros M-Pesa.

Exemplos:
- Seguro Funeral
- Seguro Automóvel

O AgroXitique não entra
aqui; fica dentro do menu
Xitique M-Pesa.

0. Voltar`,
            handler: () => "main"
        },

        my_account: {
            title: "Minha Conta",
            body: () => `Minha Conta
---------------------
1. Ver saldo
2. Consulta / Extracto
3. Reverter Transacção
4. Actualizar dados
6. Alterar PIN
0. Voltar`,
            handler: (inp) => {
                const map = {
                    "1": "my_account_pin_auth", // Pede PIN antes do saldo
                    "2": "my_account_extract",
                    "3": "my_account_reverse",
                    "4": "my_account_update",
                    "6": "my_account_pin"
                };
                return inp === "0" ? "main" : (map[inp] || "my_account");
            }
        },

        my_account_pin_auth: {
            title: "Segurança",
            body: () => `Introduza o PIN M-Pesa:`,
            handler: (inp) => {
                if (inp.length >= 4) return "my_account_balance";
                return "my_account";
            }
        },

        my_account_balance: {
            title: "Saldo M-Pesa",
            body: () => `Saldo da conta
---------------------
Cliente: ${S().user.name}
Número: ${S().user.phone}
Saldo actual:
${fmtMT(S().user.balance)}

0. Voltar`,
            handler: () => "my_account"
        },

        my_account_extract: {
            title: "Consulta / Extracto",
            body: () => `Consulta oficial
---------------------
Segundo a Vodacom MZ:
*150# > Minha conta >
Consulta > Extracto

Podes escolher um período
de 1 mês até 6 meses.

0. Voltar`,
            handler: () => "my_account"
        },

        my_account_reverse: {
            title: "Reverter Transacção",
            body: () => `Reversão
---------------------
Fluxo oficial citado:
*150# > 9 Minha conta >
3 Reverter Transacção

A reversão depende do
consentimento do receptor.

0. Voltar`,
            handler: () => "my_account"
        },

        my_account_update: {
            title: "Actualizar dados",
            body: () => `Actualizar dados
---------------------
No portal oficial:
*150# > 9 Minha conta >
4 Actualizar dados

É usado para gestão de
limites e conformidade.

0. Voltar`,
            handler: () => "my_account"
        },

        my_account_pin: {
            title: "Alterar PIN",
            body: () => `Alterar PIN
---------------------
Fluxo oficial citado:
*150# > 9 Minha conta >
6 Alterar PIN

Não partilhes o teu PIN.

0. Voltar`,
            handler: () => "my_account"
        },

        xitique_menu: {
            title: "Xitique M-Pesa",
            body: () => `Xitique M-Pesa
---------------------
1. Diário
2. Semanal
3. AgroXitique
9. Como funciona
0. Voltar`,
            handler: (inp) => {
                if (inp === "1") return "xitique_daily";
                if (inp === "2") return "xitique_weekly";
                if (inp === "3") return "agrox_login"; // Vai para o login primeiro
                if (inp === "9") return "xitique_about";
                return inp === "0" ? "main" : "xitique_menu";
            }
        },

        agrox_login: {
            title: "AgroXitique",
            body: () => `Introduza o ID do Grupo
para aceder à poupança
---------------------
(Dica Demo: 2025)

0. Voltar`,
            handler: (inp) => {
                if (inp === "0") return "xitique_menu";
                if (inp === "2025") return "agrox_pin"; // Próximo passo: PIN
                // Se não for o ID padrão, sugere criar novo
                return "agrox_unregistered";
            }
        },

        agrox_pin: {
            title: "Segurança",
            body: () => `Introduza o seu PIN M-Pesa
para validar o acesso ao
grupo "${AgroData.state.group.name}"
---------------------

0. Voltar`,
            handler: (inp) => {
                if (inp === "0") return "agrox_login";
                if (inp.length >= 4) {
                    return "agrox_main";
                }
                AgroSimulator.showSMS("Erro de PIN", "O PIN deve ter pelo menos 4 dígitos.");
                return "agrox_pin";
            }
        },

        agrox_unregistered: {
            title: "AgroXitique",
            body: () => `ID não encontrado.
Deseja criar um novo
círculo de poupança?
---------------------
1. Sim, criar grupo
2. Tentar outro ID
0. Sair`,
            handler: (inp) => {
                if (inp === "1") return "agrox_create_name";
                if (inp === "2") return "agrox_login";
                return inp === "0" ? "xitique_menu" : "agrox_unregistered";
            }
        },

        agrox_create_name: {
            title: "Novo Grupo",
            body: () => `Passo 1/2:
Introduza o nome do
seu novo círculo:
---------------------
(Ex: Machamba Viva)

0. Voltar`,
            handler: (inp) => {
                if (inp === "0") return "agrox_unregistered";
                if (inp.length > 2) {
                    // Guarda o nome temporariamente no estado para a demo
                    AgroData.state.group.name = inp;
                    return "agrox_create_members";
                }
                return "agrox_create_name";
            }
        },

        agrox_create_members: {
            title: "Registo",
            body: () => `Passo 2/2:
O sistema irá registar 
5 membros fundadores
para o grupo "${AgroData.state.group.name}".
---------------------
1. Confirmar Registo
0. Cancelar`,
            handler: (inp) => {
                if (inp === "1") {
                    // Gerar um ID aleatório de 4 dígitos para a demo
                    const newGroupId = Math.floor(1000 + Math.random() * 9000);
                    AgroSimulator.showSMS(
                        "AgroXitique: Grupo Criado",
                        `O círculo "${AgroData.state.group.name}" foi registado! ID do Grupo: ${newGroupId}. Guarde este ID para aceder e fazer contribuições.`
                    );
                    AgroAnalytics.renderPanel();
                    return "agrox_main";
                }
                return inp === "0" ? "agrox_unregistered" : "agrox_create_members";
            }
        },

        xitique_daily: {
            title: "Xitique Diário",
            body: () => `Xitique Diário
---------------------
Opção oficial do M-Pesa:
1. Receber na Sexta-feira
2. Receber no fim do mês

O AgroXitique reutiliza a
lógica de contribuição mas
com foco no grupo rural.

0. Voltar`,
            handler: () => "xitique_menu"
        },

        xitique_weekly: {
            title: "Xitique Semanal",
            body: () => `Xitique Semanal
---------------------
Opção oficial do M-Pesa:
Escolher número de semanas
de 1 a 6 e o valor.

Depois confirmar com PIN.

0. Voltar`,
            handler: () => "xitique_menu"
        },

        xitique_about: {
            title: "Como funciona",
            body: () => `Base oficial consultada
---------------------
O Xitique M-Pesa permite:
- escolher valor exacto
- contribuições automáticas
- contribuições extra

O AgroXitique acrescenta:
- score do grupo
- crédito agrícola
- gestão colectiva

0. Voltar`,
            handler: () => "xitique_menu"
        },

        agrox_main: {
            title: "AgroXitique",
            body: () => {
                const pendentes = S().members.filter(m => !m.paid).length;
                const notif = pendentes > 0
                    ? `\n⚠ ${pendentes} membro(s) com pagamento pendente\n`
                    : `\n✓ Todos os pagamentos em dia!\n`;
                return `AgroXitique do grupo
Saldo M-Pesa: ${fmtMT(S().user.balance)}${notif}
1. Consultar Poupança
2. Fazer Contribuição
3. Solicitar Crédito
4. Ver o Meu Score
5. Convidar Membro
6. Gestão do Grupo
7. Calendário Reembolso
0. Voltar ao Xitique`;
            },
            handler: (inp) => {
                const map = {
                    "1": "savings",
                    "2": "contribute",
                    "3": "credit",
                    "4": "score",
                    "5": "invite",
                    "6": "group_manage",
                    "7": "repayment"
                };
                return inp === "0" ? "xitique_menu" : (map[inp] || "agrox_main");
            }
        },

        savings: {
            title: "Consultar Poupança",
            body: () => `Círculo: ${S().group.name}
---------------------
Poupança actual:
${fmtMT(S().group.savings)}

Meta Época Plantio:
${fmtMT(S().group.target)} (Set 2025)

Progresso: ${Math.round((S().group.savings / S().group.target) * 100)}%
Membros pagos: ${S().members.filter(m => m.paid).length}/${S().members.length}

0. Voltar`,
            handler: () => "agrox_main"
        },

        contribute: {
            title: "Contribuição AgroXitique",
            body: () => S().user.contributed
                ? `✓ Contribuição já efectuada!

Já contribuíste este mês
com 200 MT para o grupo.

Próxima contribuição:
01 de Junho 2026

Score após pagamento:
+10 pontos -> ${S().user.creditScore} pts

0. Voltar`
                : `Contribuição Mensal
---------------------
Valor a pagar: 200 MT
Conta M-Pesa: ${S().user.name}
Saldo actual: ${fmtMT(S().user.balance)}

O valor será adicionado à
poupança colectiva.

1. Confirmar PIN
0. Cancelar`,
            handler: (inp) => {
                if (inp === "1" && !S().user.contributed) {
                    return "contribute_pin";
                }
                return inp === "0" ? "agrox_main" : "contribute";
            }
        },

        contribute_pin: {
            title: "Confirmar PIN",
            body: () => `Confirmação de pagamento
---------------------
Valor: 200 MT
Para: Círculo ${S().group.name}

Introduza o PIN M-Pesa
para confirmar:

(Na demo: qualquer PIN
com 4 ou mais dígitos)`,
            handler: (inp) => {
                if (inp.length >= 4) {
                    const s = S();
                    s.user.contributed = true;
                    s.user.balance -= 200;
                    s.group.savings += 200;
                    s.user.creditScore = Math.min(100, s.user.creditScore + 10);
                    s.user.totalContributed += 200;
                    s.group.score = Math.min(100, s.group.score + 2);
                    const member = s.members.find((m) => m.name === s.user.name);
                    if (member) {
                        member.paid = true;
                        member.score = s.user.creditScore;
                    }
                    s.history.unshift({
                        date: "05/05",
                        desc: `Contribuição ${s.user.name}`,
                        amt: "+200 MT",
                        type: "credit"
                    });
                    AgroAnalytics.renderPanel();
                    AgroSimulator.showSMS(
                        "M-Pesa Confirmado",
                        `200 MT debitados. Novo saldo: ${fmtMT(s.user.balance)}.`
                    );
                    return "contribute_done";
                }
                return "contribute_pin";
            }
        },

        contribute_done: {
            title: "Confirmado",
            body: () => `✓ Pagamento Confirmado
---------------------
200 MT debitados.
Novo saldo: ${fmtMT(S().user.balance)}
Score: ${S().user.creditScore}/100

Poupança do grupo:
${fmtMT(S().group.savings)}

0. Voltar ao Menu`,
            handler: () => "agrox_main"
        },

        credit: {
            title: "Crédito Agrícola",
            body: () => {
                const risco = AgroScoring.avaliarRisco(S().group.score);
                return `Microcrédito Agrícola
---------------------
Score: ${S().group.score}/100
Risco: ${risco.nivel}
Crédito máx: ${fmtMT(S().group.credit)}

Reembolso após colheita
Taxa: 3% ao mês

1. Solicitar 2.000 MT
2. Solicitar 4.000 MT
3. Solicitar 8.000 MT
4. Simulador parcelas
0. Voltar`;
            },
            handler: (inp) => {
                if (inp === "1") return "credit_confirm_2000";
                if (inp === "2") return "credit_confirm_4000";
                if (inp === "3") return "credit_confirm_8000";
                if (inp === "4") return "credit_simulator";
                return inp === "0" ? "agrox_main" : "credit";
            }
        },

        credit_simulator: {
            title: "Simular Parcelas",
            body: () => {
                const taxa = S().group.interestRate;
                const p1 = AgroScoring.calcularParcela(2000, taxa, 3);
                const p2 = AgroScoring.calcularParcela(4000, taxa, 4);
                return `Simulação Reembolso
---------------------
Taxa: ${taxa}% / mês

2.000 MT (3 parc):
-> ${fmtMT(p1)} / mês

4.000 MT (4 parc):
-> ${fmtMT(p2)} / mês

0. Voltar`;
            },
            handler: () => "credit"
        },

        credit_confirm_2000: makeCreditConfirm(2000, 3),
        credit_confirm_4000: makeCreditConfirm(4000, 4),
        credit_confirm_8000: makeCreditConfirm(8000, 6),

        credit_approved: {
            title: "Pedido Submetido",
            body: () => `✓ Pedido Submetido
---------------------
Pedido enviado com sucesso.

O teu pedido de crédito foi
submetido para análise.

Prazo de resposta: 24 horas
Resposta via SMS.

Crédito disponível:
${fmtMT(S().group.credit)}

0. Voltar ao Menu`,
            handler: () => "agrox_main"
        },

        score: {
            title: "Meu Score",
            body: () => {
                const result = AgroScoring.calcularScoreIndividual({
                    monthsActive: S().user.monthsActive,
                    totalMeses: 6,
                    contribuicoesPontuais: S().user.monthsActive,
                    numMembrosGrupo: S().members.length,
                    reembolsosFeitos: S().user.loansRepaid,
                    indicacoesFeitas: S().user.invitesMade,
                });
                return `Meu Score de Crédito
---------------------
Score: ${S().user.creditScore}/100
Estado: ${AgroScoring.classificarScore(S().user.creditScore)}

Factores:
Pontualidade: +${result.factores.pontualidade}
Consistência: +${result.factores.consistencia}
Bónus grupo: +${result.factores.bonusGrupo}

1. Ver histórico
0. Voltar`;
            },
            handler: (inp) => {
                if (inp === "1") return "score_history";
                return "agrox_main";
            }
        },

        score_history: {
            title: "Histórico do Score",
            body: () => {
                const hist = AgroData.analytics.scoreHistory;
                return `Evolução do Score
---------------------
${hist.map((h) => `${h.month}: ${h.value} pts`).join("\n")}

Dicas:
+10 pts Pago a tempo
+5 pts Novo membro
-15 pts Atraso

0. Voltar`;
            },
            handler: () => "score"
        },

        invite: {
            title: "Convidar Membro",
            body: () => `Convidar Membro
---------------------
Membros: ${S().members.length}/${S().group.maxMembers}

Vantagens:
+5 pts no teu score
+ Crédito disponível

Código do grupo:
${S().group.code}

1. Simular adesão
0. Voltar`,
            handler: (inp) => {
                if (inp === "1") {
                    const s = S();
                    const newName = "Amelia Zacarias";
                    s.members.push({ name: newName, paid: false, score: 20, monthsActive: 0 });
                    s.user.creditScore = Math.min(100, s.user.creditScore + 5);
                    s.user.invitesMade += 1;
                    s.group.score = Math.min(100, s.group.score + 3);
                    s.history.unshift({
                        date: "05/05",
                        desc: `${newName} aderiu ao grupo`,
                        amt: "+5 pts",
                        type: "info"
                    });
                    AgroAnalytics.renderPanel();
                    AgroSimulator.showSMS(
                        "Novo Membro",
                        `${newName} aderiu ao círculo! +5 pts no teu score.`
                    );
                    return "invite_done";
                }
                return "agrox_main";
            }
        },

        invite_done: {
            title: "Membro Adicionado",
            body: () => `✓ Membro Adicionado
---------------------
Amelia Zacarias juntou-se
ao círculo ${S().group.name}.

Total: ${S().members.length} membros
Teu score: ${S().user.creditScore}/100

0. Voltar ao Menu`,
            handler: () => "agrox_main"
        },

        group_manage: {
            title: "Gestão do Grupo",
            body: () => {
                const paid = S().members.filter((m) => m.paid).length;
                const pending = S().members.filter((m) => !m.paid);
                const pendingList = pending.length > 0
                    ? pending.map((m) => `<span class="warn">⚠ ${m.name}</span>`).join("\n")
                    : '<span class="info">Todos em dia!</span>';
                return `<span class="info">Círculo: ${S().group.name}</span>
${divider}
Código: <span class="opt">${S().group.code}</span>
Membros: <span class="opt">${S().members.length} / ${S().group.maxMembers}</span>
Pagos este mês: <span class="info">${paid}</span> / ${S().members.length}

<span class="muted">── Pendentes ──</span>
${pendingList}

Score do grupo: <span class="opt">${S().group.score}/100</span>

<span class="opt">1.</span> Ver todos os membros
<span class="opt">2.</span> Enviar lembrete SMS
<span class="opt">0.</span> Voltar`;
            },
            handler: (inp) => {
                if (inp === "1") return "group_members";
                if (inp === "2") {
                    const pending = S().members.filter((m) => !m.paid);
                    if (pending.length > 0) {
                        AgroSimulator.showSMS(
                            "Lembrete Enviado",
                            `SMS enviado para ${pending.length} membro(s) com pagamento pendente.`
                        );
                    }
                    return "group_manage";
                }
                return "agrox_main";
            }
        },

        group_members: {
            title: "Lista de Membros",
            body: () => {
                const list = S().members.map((m) => {
                    const status = m.paid ? '<span class="info">✓</span>' : '<span class="warn">⚠</span>';
                    return `${status} ${m.name} <span class="muted">(${m.score}pts)</span>`;
                }).join("\n");
                return `<span class="info">${S().group.name}</span>
${divider}
${list}

<span class="muted">Legenda: ✓ Pago  ⚠ Pendente</span>

<span class="opt">0.</span> Voltar`;
            },
            handler: () => "group_manage"
        },

        repayment: {
            title: "Calendário Reembolso",
            body: () => {
                const used = S().group.creditUsed;
                if (used === 0) {
                    return `<span class="info">Calendário de Reembolso</span>
${divider}
Não existe crédito activo
neste momento.

Crédito disponível:
<span class="opt">${fmtMT(S().group.credit)}</span>

Para solicitar crédito,
use a opção 3 do menu.

<span class="opt">0.</span> Voltar ao Menu`;
                }
                const parcela = AgroScoring.calcularParcela(used, 3, 4);
                return `<span class="info">Reembolso em Curso</span>
${divider}
Crédito activo: <span class="opt">${fmtMT(used)}</span>
Parcela mensal: <span class="opt">${fmtMT(parcela)}</span>

Calendário:
<span class="opt">Jan 2026</span> — ${fmtMT(parcela)} <span class="muted">pendente</span>
<span class="opt">Fev 2026</span> — ${fmtMT(parcela)} <span class="muted">pendente</span>
<span class="opt">Mar 2026</span> — ${fmtMT(parcela)} <span class="muted">pendente</span>
<span class="opt">Abr 2026</span> — ${fmtMT(parcela)} <span class="muted">pendente</span>

<span class="muted">Alinhado ao calendário agrícola
(reembolso após colheita)</span>

<span class="opt">0.</span> Voltar ao Menu`;
            },
            handler: () => "agrox_main"
        },
    };

    function makeCreditConfirm(valor, parcelas) {
        const parcela = AgroScoring.calcularParcela(valor, 3, parcelas);
        return {
            title: "Confirmar Pedido",
            body: () => `<span class="info">Resumo do Pedido</span>
${divider}
Valor:       <span class="opt">${fmtMT(valor)}</span>
Finalidade:  Insumos agrícolas
Grupo:       ${S().group.name}
Score:       <span class="opt">${S().group.score} / 100</span>

Reembolso: ${parcelas} parcelas de
<span class="opt">${fmtMT(parcela)}</span> (inclui 3% juros/mês)
Início: Janeiro 2026

<span class="warn">ATENÇÃO: Todos os membros
do grupo são co-responsáveis.</span>

<span class="opt">1.</span> Confirmar pedido
<span class="opt">0.</span> Cancelar`,
            handler: (inp) => {
                if (inp === "1") {
                    const s = S();
                    if (s.group.credit >= valor) {
                        s.group.credit -= valor;
                        s.group.creditUsed += valor;
                        s.history.unshift({
                            date: "05/05",
                            desc: "Crédito solicitado — grupo",
                            amt: `-${fmtMT(valor)}`,
                            type: "debit"
                        });
                        AgroAnalytics.renderPanel();
                        AgroSimulator.showSMS(
                            "Crédito Aprovado",
                            `Pedido de ${fmtMT(valor)} submetido para análise. Resposta em 24h.`
                        );
                    }
                    return "credit_approved";
                }
                return "agrox_main";
            }
        };
    }

    return { screens, progressBar, scoreLabel, fmtMT };
})();

if (typeof window !== "undefined") {
    window.AgroScreens = AgroScreens;
}
