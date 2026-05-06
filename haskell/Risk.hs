{- ═══════════════════════════════════════════════════════════════
   AgroXitique — Simulação de Risco
   Avaliação de risco e simulação de cenários para microcrédito
   
   Cadeira: Programação Funcional — UniLicungo 2025
   Professor: Filipe Domingos dos Santos
   ═══════════════════════════════════════════════════════════════ -}

module Risk where

import Types
import Scoring (classificar, calcularLimiteCredito, calcularParcela)

-- ═══════════════════════════════════════════════════════════════
-- Avaliação de Risco
-- ═══════════════════════════════════════════════════════════════

-- | Avalia o nível de risco baseado no score do grupo
--
--   > avaliarRisco 80
--   RiscoResult {riscoNivel = RiscoBaixo, riscoProbDefault = 5, ...}
avaliarRisco :: Int -> RiscoResult
avaliarRisco score
    | score >= 75 = RiscoResult RiscoBaixo  5  (calcularLimiteCredito score)
    | score >= 50 = RiscoResult RiscoMedio 15  (calcularLimiteCredito score)
    | otherwise   = RiscoResult RiscoAlto  35  (calcularLimiteCredito score)

-- | Texto descritivo do nível de risco
descreverRisco :: NivelRisco -> String
descreverRisco RiscoBaixo = "Baixo — Grupo estável com bom histórico"
descreverRisco RiscoMedio = "Médio — Grupo com alguma inconsistência"
descreverRisco RiscoAlto  = "Alto — Grupo novo ou com muitos atrasos"


-- ═══════════════════════════════════════════════════════════════
-- Simulação de Cenários
-- ═══════════════════════════════════════════════════════════════

-- | Gera cenários de risco para um pedido de crédito
--
--   > simularCenarios 72 4000 8
--   [CenarioRisco "Optimista" ... , CenarioRisco "Base" ... , ...]
simularCenarios :: Int      -- ^ Score do grupo
                -> Double   -- ^ Valor do crédito solicitado
                -> Int      -- ^ Número de membros
                -> [CenarioRisco]
simularCenarios score _valor _membros =
    [ CenarioRisco
        { cenarioNome          = "Optimista"
        , cenarioDescricao     = "Todos pagam a tempo, boa colheita"
        , cenarioProbabilidade = if score >= 70 then 60 else 30
        , cenarioImpactoScore  = 10
        }
    , CenarioRisco
        { cenarioNome          = "Base"
        , cenarioDescricao     = "Maioria paga, colheita normal"
        , cenarioProbabilidade = 30
        , cenarioImpactoScore  = 0
        }
    , CenarioRisco
        { cenarioNome          = "Pessimista"
        , cenarioDescricao     = "Atrasos frequentes, má colheita"
        , cenarioProbabilidade = if score >= 70 then 10 else 40
        , cenarioImpactoScore  = -15
        }
    ]

-- | Verifica se um grupo é elegível para crédito
--   Requisitos: score >= 50 e pelo menos 5 membros
--
--   > elegibilidadeCredito 72 8
--   (True, "Elegível para crédito até 8000.0 MT")
elegibilidadeCredito :: Int -> Int -> (Bool, String)
elegibilidadeCredito score numMembros
    | score < 30 = (False, "Score insuficiente (mínimo: 30)")
    | numMembros < 3 = (False, "Grupo muito pequeno (mínimo: 3 membros)")
    | score < 50 = (True, "Elegível com limite reduzido: " ++ show limite ++ " MT")
    | otherwise  = (True, "Elegível para crédito até " ++ show limite ++ " MT")
  where limite = calcularLimiteCredito score

-- | Calcula a capacidade de reembolso do grupo
--   Baseada na poupança mensal vs. parcela do crédito
--
--   > capacidadeReembolso 200 8 4000 3 4
--   "Capacidade: 1600 MT/mês vs parcela de 1060 MT — Sustentável"
capacidadeReembolso :: Double   -- ^ Contribuição mensal per capita
                    -> Int      -- ^ Número de membros
                    -> Double   -- ^ Valor do crédito
                    -> Double   -- ^ Taxa de juros mensal (%)
                    -> Int      -- ^ Número de parcelas
                    -> String
capacidadeReembolso contribMensal numMembros valorCredito taxa parcelas =
    let entradaMensal = contribMensal * fromIntegral numMembros
        parcela       = calcularParcela valorCredito taxa parcelas
        ratio         = entradaMensal / parcela
        status        = if ratio >= 1.5 then "Sustentável ✓"
                        else if ratio >= 1.0 then "Apertado ⚠"
                        else "Insustentável ✗"
    in "Capacidade: " ++ show (round entradaMensal :: Int) ++ " MT/mês vs parcela de "
       ++ show (round parcela :: Int) ++ " MT — " ++ status

-- | Mostra um relatório de risco completo
mostrarRelatorioRisco :: Int -> Double -> Int -> String
mostrarRelatorioRisco score valorCredito numMembros =
    let risco    = avaliarRisco score
        cenarios = simularCenarios score valorCredito numMembros
        (elegivel, msgEleg) = elegibilidadeCredito score numMembros
        capReemb = capacidadeReembolso 200 numMembros valorCredito 3 4
    in unlines
        [ "══════════════════════════════════"
        , "  RELATÓRIO DE RISCO"
        , "══════════════════════════════════"
        , "  Score do grupo: " ++ show score ++ "/100"
        , "  Nível de risco: " ++ descreverRisco (riscoNivel risco)
        , "  Prob. incumprimento: " ++ show (riscoProbDefault risco) ++ "%"
        , ""
        , "  " ++ msgEleg
        , "  " ++ capReemb
        , ""
        , "  Cenários:"
        , concatMap mostrarCenario cenarios
        , "══════════════════════════════════"
        ]

mostrarCenario :: CenarioRisco -> String
mostrarCenario c = "    " ++ cenarioNome c ++ " (" ++ show (cenarioProbabilidade c) ++ "%)"
    ++ "\n      " ++ cenarioDescricao c
    ++ "\n      Impacto no score: " ++ show (cenarioImpactoScore c) ++ " pts\n"
