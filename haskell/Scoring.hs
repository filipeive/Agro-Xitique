{- ═══════════════════════════════════════════════════════════════
   AgroXitique — Motor de Scoring
   Funções puras para cálculo do score de crédito rural
   
   Princípios:
   - Funções puras (mesmo input → mesmo output)
   - Composabilidade (cada factor é uma função independente)
   - Testabilidade (cada função testável isoladamente no GHCi)
   
   Cadeira: Programação Funcional — UniLicungo 2025
   Professor: Filipe Domingos dos Santos
   ═══════════════════════════════════════════════════════════════ -}

module Scoring where

import Types

-- ═══════════════════════════════════════════════════════════════
-- Funções auxiliares puras
-- ═══════════════════════════════════════════════════════════════

-- | Limita um valor entre mínimo e máximo
--   clamp 0 100 120 == 100
--   clamp 0 100 (-5) == 0
clamp :: Int -> Int -> Int -> Int
clamp minVal maxVal x = max minVal (min maxVal x)

-- | Arredonda uma percentagem para inteiro
percentagem :: Int -> Int -> Int
percentagem parte total
    | total == 0 = 0
    | otherwise  = round (fromIntegral parte / fromIntegral total * 100 :: Double)

-- ═══════════════════════════════════════════════════════════════
-- Factores individuais do score (cada um é uma função pura)
-- ═══════════════════════════════════════════════════════════════

-- | Factor 1: Pontualidade (peso: 40%)
--   Conta contribuições feitas a tempo e normaliza para 0-40
--
--   Exemplo:
--   > calcPontualidade 5 6
--   33
calcPontualidade :: Int    -- ^ Contribuições pontuais
                 -> Int    -- ^ Total de meses
                 -> Int    -- ^ Pontuação (0-40)
calcPontualidade pontuais totalMeses
    | totalMeses == 0 = 0
    | otherwise       = round (fromIntegral pontuais / fromIntegral totalMeses * 40 :: Double)

-- | Factor 2: Consistência (peso: 30%)
--   Baseada em meses consecutivos activos, normalizado por 6 meses
--
--   Exemplo:
--   > calcConsistencia 4 6
--   20
calcConsistencia :: Int    -- ^ Meses activos
                 -> Int    -- ^ Total de meses (mínimo referência: 6)
                 -> Int    -- ^ Pontuação (0-30)
calcConsistencia mesesActivos totalMeses
    | totalMeses == 0 = 0
    | otherwise       = round (fromIntegral mesesActivos / fromIntegral (max totalMeses 6) * 30 :: Double)

-- | Factor 3: Bónus por tamanho do grupo (peso: 10%)
--   Grupos maiores têm mais estabilidade
--
--   Exemplo:
--   > calcBonusGrupo 12
--   10
--   > calcBonusGrupo 3
--   2
calcBonusGrupo :: Int    -- ^ Número de membros
               -> Int    -- ^ Pontuação (0-10)
calcBonusGrupo n
    | n >= 12   = 10
    | n >= 8    = 7
    | n >= 5    = 5
    | otherwise = 2

-- | Factor 4: Histórico de crédito (peso: 15%)
--   +5 pontos por cada reembolso bem-sucedido
--
--   Exemplo:
--   > calcHistoricoCredito 3
--   15
calcHistoricoCredito :: Int    -- ^ Reembolsos feitos
                     -> Int    -- ^ Pontuação (0-15)
calcHistoricoCredito reembolsos = min 15 (reembolsos * 5)

-- | Factor 5: Indicações (peso: 5%)
--   +2 pontos por cada membro indicado
--
--   Exemplo:
--   > calcIndicacoes 2
--   4
calcIndicacoes :: Int    -- ^ Indicações feitas
               -> Int    -- ^ Pontuação (0-5)
calcIndicacoes indicacoes = min 5 (indicacoes * 2)

-- | Penalidades
--   -15 por atraso, -20 por falta
--
--   Exemplo:
--   > calcPenalidades 1 0
--   -15
calcPenalidades :: Int    -- ^ Número de atrasos
                -> Int    -- ^ Número de faltas
                -> Int    -- ^ Penalidade (negativo)
calcPenalidades atrasos faltas = (atrasos * (-15)) + (faltas * (-20))


-- ═══════════════════════════════════════════════════════════════
-- Composição do score final
-- ═══════════════════════════════════════════════════════════════

-- | Calcula o score individual de um membro
--   Combina todos os factores numa pontuação final de 0 a 100
--
--   Exemplo:
--   > let m = Membro "Maria" "84123" Activo [Contribuicao 200 True (MesAno 5 2025)] 5 1
--   > calcularScoreIndividual m 8
--   ScoreResult {scoreTotal = 72, ...}
calcularScoreIndividual :: Membro -> Int -> ScoreResult
calcularScoreIndividual membro numMembrosGrupo =
    let contribs   = memContribs membro
        pontuais   = length (filter contEmDia contribs)
        totalMeses = max (length contribs) (memMesesActivos membro)
        
        -- Calcular cada factor independentemente
        fPontualidade = calcPontualidade pontuais totalMeses
        fConsistencia = calcConsistencia (memMesesActivos membro) totalMeses
        fBonusGrupo   = calcBonusGrupo numMembrosGrupo
        fHistCredito  = calcHistoricoCredito 0  -- Sem empréstimos anteriores
        fIndicacoes   = calcIndicacoes (memIndicacoes membro)
        fPenalidades  = calcPenalidades (contarAtrasos contribs) 0
        
        -- Composição: soma de todos os factores
        scoreRaw = fPontualidade + fConsistencia + fBonusGrupo 
                 + fHistCredito + fIndicacoes + fPenalidades
        
        scoreFinal = clamp 0 100 scoreRaw
        
        factores = ScoreFactores
            { factPontualidade     = fPontualidade
            , factConsistencia     = fConsistencia
            , factBonusGrupo       = fBonusGrupo
            , factHistoricoCredito = fHistCredito
            , factIndicacoes       = fIndicacoes
            , factPenalidades      = fPenalidades
            }
    in ScoreResult
        { scoreTotal         = scoreFinal
        , scoreClassificacao = classificar scoreFinal
        , scoreLimiteCredito = calcularLimiteCredito scoreFinal
        , scoreFactores      = factores
        }

-- | Conta contribuições em atraso (não pontuais)
contarAtrasos :: [Contribuicao] -> Int
contarAtrasos = length . filter (not . contEmDia)

-- | Calcula o score médio de um grupo
--   O score do grupo é a média dos scores individuais, com ajuste
calcularScoreGrupo :: Grupo -> Int
calcularScoreGrupo grupo =
    let membros = grupoMembros grupo
        n       = length membros
        scores  = map (\m -> calcularScoreIndividual m n) membros
        soma    = sum (map scoreTotal scores)
        media   = if n == 0 then 0 else soma `div` n
        
        -- Ajuste: penalizar se muitos pendentes
        pendentes    = length (filter (\m -> memStatus m == Pendente) membros)
        taxaPagamento = if n == 0 then 0 else percentagem (n - pendentes) n
        ajuste       = if taxaPagamento >= 75 then 5
                       else if taxaPagamento >= 50 then 0
                       else (-10)
    in clamp 0 100 (media + ajuste)


-- ═══════════════════════════════════════════════════════════════
-- Classificação e limites de crédito
-- ═══════════════════════════════════════════════════════════════

-- | Classifica um score numérico
--
--   > classificar 85
--   Excelente
--   > classificar 72
--   Bom
classificar :: Int -> Classificacao
classificar s
    | s >= 85   = Excelente
    | s >= 70   = Bom
    | s >= 50   = Regular
    | s >= 30   = Fraco
    | otherwise = Critico

-- | Determina o limite de crédito baseado no score
--
--   > calcularLimiteCredito 85
--   10000.0
--   > calcularLimiteCredito 50
--   4000.0
calcularLimiteCredito :: Int -> Double
calcularLimiteCredito s
    | s >= 85   = 10000.0
    | s >= 70   = 8000.0
    | s >= 50   = 4000.0
    | s >= 30   = 2000.0
    | otherwise = 0.0

-- | Calcula o limite de crédito do grupo (ajustado por nº de membros)
calcularLimiteCreditoGrupo :: Int -> Int -> Double
calcularLimiteCreditoGrupo score numMembros =
    let base          = calcularLimiteCredito score
        multiplicador = min (fromIntegral numMembros / 5.0) 2.0 :: Double
    in base * multiplicador

-- | Calcula o valor de cada parcela (juros simples)
--
--   > calcularParcela 4000 3 4
--   1060.0
calcularParcela :: Double  -- ^ Valor do crédito
                -> Double  -- ^ Taxa mensal (%)
                -> Int     -- ^ Número de parcelas
                -> Double  -- ^ Valor de cada parcela
calcularParcela valor taxaMensal numParcelas =
    let jurosTotal = valor * (taxaMensal / 100) * fromIntegral numParcelas
    in (valor + jurosTotal) / fromIntegral numParcelas


-- ═══════════════════════════════════════════════════════════════
-- Funções de conveniência para demonstração
-- ═══════════════════════════════════════════════════════════════

-- | Cria uma contribuição pontual
contribPontual :: Double -> MesAno -> Contribuicao
contribPontual val mesAno = Contribuicao val True mesAno

-- | Cria uma contribuição em atraso
contribAtrasada :: Double -> MesAno -> Contribuicao
contribAtrasada val mesAno = Contribuicao val False mesAno

-- | Mostra o score de forma legível
mostrarScore :: ScoreResult -> String
mostrarScore sr = unlines
    [ "══════════════════════════════════"
    , "  Score: " ++ show (scoreTotal sr) ++ "/100 — " ++ show (scoreClassificacao sr)
    , "  Limite de crédito: " ++ show (scoreLimiteCredito sr) ++ " MT"
    , "──────────────────────────────────"
    , "  Factores:"
    , "    Pontualidade:     +" ++ show (factPontualidade f)
    , "    Consistência:     +" ++ show (factConsistencia f)
    , "    Bónus grupo:      +" ++ show (factBonusGrupo f)
    , "    Hist. crédito:    +" ++ show (factHistoricoCredito f)
    , "    Indicações:       +" ++ show (factIndicacoes f)
    , "    Penalidades:      " ++ show (factPenalidades f)
    , "══════════════════════════════════"
    ]
  where f = scoreFactores sr
