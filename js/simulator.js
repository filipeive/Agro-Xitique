// ═══════════════════════════════════════════════════════════════
// AgroXitique — Simulator Controller
// Controla a navegação USSD, animações e interacção
// ═══════════════════════════════════════════════════════════════

const AgroSimulator = (() => {
    let currentScreen = "idle";
    let navigationHistory = [];

    // ── DOM References ────────────────────────────────────────
    const $ = (id) => document.getElementById(id);

    function getFlowMeta(screenName) {
        const meta = {
            idle: {
                title: "Vodacom M-Pesa",
                step: "0",
                progress: "Passo 0 de 0",
                session: "Pronto para marcar *150#",
                panelState: "À espera de marcação",
                nextStep: "Abrir menu M-Pesa",
                detail: "Use *150# para iniciar um fluxo inspirado no M-Pesa real.",
                panelDetail: "O simulador encaixa o AgroXitique dentro da navegação realista do *150#."
            },
            loading: {
                step: "1",
                progress: "A abrir sessão",
                session: "A ligar ao serviço USSD",
                panelState: "Sessão em arranque",
                nextStep: "Carregar menu M-Pesa",
                detail: "O menu está a ser carregado no telemóvel.",
                panelDetail: "A mensagem inicial desaparece assim que a sessão entra no menu."
            },
            main: {
                step: "1",
                progress: "Passo 1 de 2",
                session: "Menu M-Pesa activo",
                panelState: "Menu principal M-Pesa aberto",
                nextStep: "Escolher uma operação",
                detail: "A estrutura segue o padrão M-Pesa com Xitique, Pagamentos e Minha Conta.",
                panelDetail: "O teu fluxo AgroXitique entra a partir de 4 - Xitique M-Pesa."
            },
            xitique_menu: {
                step: "2",
                progress: "Passo 2 de 2",
                session: "Xitique M-Pesa aberto",
                panelState: "Menu Xitique activo",
                nextStep: "Escolher Diário, Semanal ou AgroXitique",
                detail: "As opções Diário e Semanal seguem a lógica descrita nas páginas oficiais.",
                panelDetail: "A opção AgroXitique mostra a extensão académica sobre o fluxo real."
            },
            agrox_main: {
                step: "2",
                progress: "Passo 2 de 3",
                session: "AgroXitique activo",
                panelState: "Sub-serviço agrícola aberto",
                nextStep: "Escolher operação do grupo",
                detail: "Aqui começa a parte própria do projecto: poupança colectiva, score e crédito.",
                panelDetail: "A demo assume AgroXitique como um serviço montado por cima do Xitique M-Pesa."
            },
            my_account: {
                step: "2",
                progress: "Passo 2 de 2",
                session: "Minha Conta aberta",
                panelState: "Área de conta activa",
                nextStep: "Consultar saldo, extracto ou PIN",
                detail: "As entradas reflectem caminhos oficiais citados pela Vodacom MZ.",
                panelDetail: "Útil para reforçar que o simulador foi aproximado ao ecossistema real."
            },
            payments_info: {
                step: "2",
                progress: "Passo 2 de 2",
                session: "Pagamentos M-Pesa",
                panelState: "Menu de pagamentos contextualizado",
                nextStep: "Voltar ao menu principal",
                detail: "O fluxo oficial coloca TV, água e seguros dentro de 6 - Pagamentos.",
                panelDetail: "Mantive isto como contexto para a demo, sem desviar do caso agrícola."
            },
            txuna_info: {
                step: "2",
                progress: "Passo 2 de 2",
                session: "Txuna em contexto",
                panelState: "Crédito oficial contextualizado",
                nextStep: "Voltar ao menu principal",
                detail: "O Txuna é o produto oficial de empréstimo citado pela Vodacom.",
                panelDetail: "Serve como referência para o módulo de crédito do AgroXitique."
            },
            savings: {
                step: "1",
                progress: "Passo 1 de 2",
                session: "Consulta de poupança",
                panelState: "Leitura de saldo do grupo",
                nextStep: "Voltar ao menu",
                detail: "Resumo rápido do valor acumulado e do progresso para a meta.",
                panelDetail: "Use este ecrã para mostrar tração financeira."
            },
            contribute: {
                step: "2",
                progress: "Passo 2 de 3",
                session: "Pagamento prestes a iniciar",
                panelState: "Contribuição em preparação",
                nextStep: "Confirmar com PIN",
                detail: "O valor mensal e o saldo M-Pesa já estão pré-preenchidos.",
                panelDetail: "Este fluxo demonstra entrada de caixa e aumento de score."
            },
            contribute_pin: {
                step: "3",
                progress: "Passo 3 de 3",
                session: "Aguardando PIN",
                panelState: "Confirmação de pagamento",
                nextStep: "Introduzir qualquer PIN",
                detail: "Na demo, qualquer código com 4 ou mais dígitos conclui o pagamento.",
                panelDetail: "A confirmação gera SMS e reflecte o novo saldo."
            },
            contribute_done: {
                step: "3",
                progress: "Passo 3 de 3",
                session: "Pagamento concluído",
                panelState: "Contribuição registada",
                nextStep: "Voltar ao menu",
                detail: "Saldo, score e poupança do grupo já foram actualizados.",
                panelDetail: "Bom ponto para pausar e explicar impacto operacional."
            },
            credit: {
                step: "2",
                progress: "Passo 2 de 3",
                session: "Simulação de crédito",
                panelState: "Avaliação de elegibilidade",
                nextStep: "Escolher montante",
                detail: "Mostra score, risco e produtos de microcrédito disponíveis.",
                panelDetail: "Este fluxo demonstra o motor de decisão do projecto."
            },
            credit_simulator: {
                step: "2",
                progress: "Passo 2 de 3",
                session: "Comparação de parcelas",
                panelState: "Simulador financeiro activo",
                nextStep: "Voltar ao crédito",
                detail: "Permite mostrar prestações mensais com juros de forma imediata.",
                panelDetail: "Útil para explicar previsibilidade no reembolso."
            },
            credit_approved: {
                step: "3",
                progress: "Passo 3 de 3",
                session: "Pedido submetido",
                panelState: "Crédito em análise",
                nextStep: "Voltar ao menu",
                detail: "A solicitação reduz o crédito disponível e regista histórico.",
                panelDetail: "Ponto certo para conectar com o motor Haskell."
            },
            score: {
                step: "2",
                progress: "Passo 2 de 2",
                session: "Consulta de score",
                panelState: "Score individual aberto",
                nextStep: "Ver histórico ou voltar",
                detail: "Explique os factores de pontualidade, consistência e grupo.",
                panelDetail: "Este ecrã sustenta a parte técnica e auditável da solução."
            },
            group_manage: {
                step: "2",
                progress: "Passo 2 de 2",
                session: "Gestão do grupo",
                panelState: "Operação de liderança activa",
                nextStep: "Ver membros ou enviar lembrete",
                detail: "Mostra pendências e acções para coordenar o círculo.",
                panelDetail: "Bom ecrã para demonstrar valor colectivo, não só individual."
            },
            repayment: {
                step: "2",
                progress: "Passo 2 de 2",
                session: "Calendário de reembolso",
                panelState: "Planeamento de cobrança",
                nextStep: "Voltar ao menu",
                detail: "A timeline de parcelas reforça o alinhamento com a colheita.",
                panelDetail: "Ajuda o júri a ver a lógica sazonal do produto."
            }
        };

        if (screenName.startsWith("credit_confirm_")) {
            return {
                step: "3",
                progress: "Passo 3 de 3",
                session: "Confirmação do pedido",
                panelState: "Pedido de crédito em validação",
                nextStep: "Confirmar ou cancelar",
                detail: "O resumo apresenta valor, parcelas e co-responsabilidade do grupo.",
                panelDetail: "Ponto ideal para explicar gestão de risco."
            };
        }

        return meta[screenName] || {
            step: "1",
            progress: "Passo 1 de 1",
            session: "Sessão activa",
            panelState: "Fluxo em execução",
            nextStep: "Seguir instruções no ecrã",
            detail: "Use as opções numéricas para continuar a sessão.",
            panelDetail: "O painel reflecte o estado corrente do simulador."
        };
    }

    function syncExperience(screenName) {
        const meta = getFlowMeta(screenName);
        const titleEl = $("screen-title");
        const metaEl = document.querySelector(".screen-meta");
        const sessionChip = $("session-chip");
        const journeyChip = $("journey-chip");
        const panelSessionState = $("panel-session-state");
        const panelSessionDetail = $("panel-session-detail");
        const panelNextStep = $("panel-next-step");
        const panelNextDetail = $("panel-next-detail");
        const input = $("user-input");
        const secondaryBtn = $("input-secondary-btn");
        const primaryBtn = $("input-primary-btn");

        if (titleEl) {
            titleEl.dataset.step = meta.step || "1";
        }
        if (metaEl) {
            metaEl.classList.toggle("is-hidden", screenName !== "idle");
        }
        if (sessionChip) {
            sessionChip.textContent = meta.session;
        }
        if (journeyChip) {
            journeyChip.textContent = meta.progress;
        }
        if (panelSessionState) {
            panelSessionState.textContent = meta.panelState;
        }
        if (panelSessionDetail) {
            panelSessionDetail.textContent = meta.detail;
        }
        if (panelNextStep) {
            panelNextStep.textContent = meta.nextStep;
        }
        if (panelNextDetail) {
            panelNextDetail.textContent = meta.panelDetail;
        }
        if (input) {
            input.placeholder = screenName === "idle"
                ? "Utilize o teclado para marcar"
                : "Introduza a opção ou PIN";
        }
        if (secondaryBtn) {
            secondaryBtn.textContent = screenName === "idle" ? "Limpar" : "Cancelar";
        }
        if (primaryBtn) {
            primaryBtn.textContent = screenName === "idle" ? "Discar" : "Enviar";
        }
    }

    function renderIdleBody() {
        return `
            <div class="idle-state" style="margin-bottom: -30px !important;">
                <p class="idle-label" style="color:rgba(255,255,255,0.8)">Ecossistema AgroXitique</p>
                <p class="idle-code">Sessão pronta</p>
                <p class="idle-copy" style="color:rgba(255,255,255,0.6)">Toque em Discar para carregar o menu M-Pesa. O atalho *150# continua implícito.</p>
            </div>
        `;
    }

    // ── Set Screen with Animation ─────────────────────────────
    function setScreen(name) {
        const s = AgroScreens.screens[name];
        if (!s) return;

        currentScreen = name;
        navigationHistory.push(name);

        const titleEl = $("screen-title");
        const bodyEl = $("screen-body");

        // Fade out
        bodyEl.classList.remove("fade-enter");

        // Small delay for USSD-like feel
        setTimeout(() => {
            titleEl.innerHTML = s.title || "Vodacom M-Pesa";
            bodyEl.innerHTML = s.body();
            bodyEl.classList.add("fade-enter");
            syncExperience(name);

            $("input-area").style.display = "flex";
            $("dial-btn").style.display = "block"; // Always visible now

            const input = $("user-input");
            input.value = "";
            input.focus();

            // Scroll screen to top
            $("screen").scrollTop = 0;
        }, 150);
    }


    // ── Handle Input ──────────────────────────────────────────
    function handleInput() {
        const input = $("user-input");
        const inp = input.value.trim();

        if (currentScreen === "idle") {
            startSession(inp);
            input.value = "";
            return;
        }

        if (!inp) return;

        // Suporte ao # (Next) e 0 (Back) universal se o handler permitir
        const s = AgroScreens.screens[currentScreen];
        if (!s) return;

        const next = s.handler(inp);
        if (next && AgroScreens.screens[next]) {
            setScreen(next);
        }

        input.value = "";
    }

    // ── Reset Session ─────────────────────────────────────────
    function resetSession() {
        currentScreen = "idle";
        navigationHistory = [];

        $("screen-title").innerHTML = "Vodacom M-Pesa";
        $("screen-body").innerHTML = renderIdleBody();
        $("input-area").style.display = "none"; // Escondido no início
        $("dial-btn").style.display = "block";
        $("user-input").value = "";
        syncExperience("idle");
    }

    // ── Keypad Interaction ────────────────────────────────────
    function appendDial(val) {
        const input = $("user-input");
        const inputArea = $("input-area");
        const signature = document.querySelector(".mpesa-signature");
        if (!input) return;
        
        // Forçar visibilidade se houver algo para mostrar
        if (inputArea) {
            inputArea.style.display = "flex";
        }
        
        // Ocultar o selo M-Pesa para ganhar espaço ao digitar
        if (signature) {
            signature.style.display = "none";
        }

        input.value += val;
        input.focus();
        
        if (currentScreen === "idle") {
            syncExperience("idle");
        }
    }

    function quickDial() {
        const input = $("user-input");
        if (input) {
            input.value = "*150#";
        }
        startSession("*150#");
    }

    function startSession(rawInput = "") {
        const input = $("user-input");
        const typedCode = rawInput || input?.value.trim() || "";

        if (currentScreen !== "idle") {
            if (input) input.focus();
            return;
        }

        // Validação estrita: apenas *150# abre o M-Pesa
        if (typedCode !== "*150#") {
            triggerShake();
            showSMS("Erro de Sistema", "Problema de ligação ou código MMI inválido.");
            return;
        }

        const dialBtn = $("dial-btn");
        if (dialBtn) dialBtn.style.display = "block";

        // Ocultar selo durante a sessão
        const signature = document.querySelector(".mpesa-signature");
        if (signature) signature.style.display = "none";

        // Show loading animation
        const bodyEl = $("screen-body");
        const titleEl = $("screen-title");
        titleEl.innerHTML = "Vodacom M-Pesa";
        bodyEl.innerHTML = `
            <div class="ussd-loading">
                <span class="muted">A processar...</span>
                <div class="loading-bar"></div>
                <div class="dial-preview small">${typedCode}</div>
            </div>
        `;
        syncExperience("loading");

        setTimeout(() => setScreen("main"), 1000);
    }

    function triggerShake() {
        const phone = document.querySelector(".phone");
        if (phone) {
            phone.classList.add("shake-error");
            setTimeout(() => phone.classList.remove("shake-error"), 500);
        }
    }

    // ── SMS Notification Popup ────────────────────────────────
    function showSMS(title, message) {
        // Remove existing popup
        const existing = document.querySelector('.sms-popup');
        if (existing) existing.remove();

        const popup = document.createElement('div');
        popup.className = 'sms-popup';
        popup.innerHTML = `
            <div class="sms-header">📩 ${title}</div>
            <div class="sms-body">${message}</div>
        `;
        document.body.appendChild(popup);

        // Auto-remove after 4s
        setTimeout(() => {
            if (popup.parentNode) popup.remove();
        }, 4000);
    }

    // ── Initialize ────────────────────────────────────────────
    function init() {
        const input = $("user-input");

        // Enter key support
        document.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                handleInput();
            }
        });

        // Initial panel render
        if (typeof AgroAnalytics !== 'undefined') {
            AgroAnalytics.renderPanel();
        }

        updateTime();
        setInterval(updateTime, 60000);
        resetSession();
    }

    function updateTime() {
        const timeEl = $("phone-time");
        if (timeEl) {
            const now = new Date();
            timeEl.textContent = now.getHours().toString().padStart(2, '0') + ':' +
                now.getMinutes().toString().padStart(2, '0');
        }
    }

    function clearDial() {
        const input = $("user-input");
        const inputArea = $("input-area");
        if (!input || input.value.length === 0) return;

        input.value = input.value.slice(0, -1);

        if (currentScreen === "idle" && input.value.length === 0) {
            $("screen-body").innerHTML = renderIdleBody();
            if (inputArea) inputArea.style.display = "none";
            const signature = document.querySelector(".mpesa-signature");
            if (signature) signature.style.display = "flex";
        }
    }

    function primaryAction() {
        if (currentScreen === "idle") {
            startSession();
            return;
        }
        handleInput();
    }

    function secondaryAction() {
        const input = $("user-input");
        if (currentScreen === "idle") {
            if (input) {
                input.value = "";
            }
            $("screen-body").innerHTML = renderIdleBody();
            syncExperience("idle");
            return;
        }
        resetSession();
    }

    function simulateNewMember() {
        const names = ["Ricardo Mboa", "Isabel Chilaule", "Bernardo Sitoe"];
        const name = names[Math.floor(Math.random() * names.length)];
        const s = AgroData.state;
        s.members.push({ name: name, paid: false, score: 30, monthsActive: 1 });
        s.group.score = Math.min(100, s.group.score + 2);
        AgroAnalytics.renderPanel();
        showSMS("Novo Membro", `${name} aderiu ao grupo!`);
    }

    function simulateMassSavings() {
        const s = AgroData.state;
        s.members.forEach(m => {
            if (!m.paid) {
                m.paid = true;
                s.group.savings += 200;
            }
        });
        s.group.score = Math.min(100, s.group.score + 5);
        AgroAnalytics.renderPanel();
        showSMS("Poupança Actualizada", "Todos os membros efectuaram a contribuição mensal.");
    }

    // ── Public API ────────────────────────────────────────────
    return {
        startSession,
        handleInput,
        primaryAction,
        secondaryAction,
        resetSession,
        setScreen,
        showSMS,
        init,
        appendDial,
        clearDial,
        simulateNewMember,
        simulateMassSavings,
        quickDial,
        getCurrentScreen: () => currentScreen,
    };
})();

if (typeof window !== 'undefined') {
    window.AgroSimulator = AgroSimulator;
}
