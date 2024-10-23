

# Fire Shield - Extensão de Cibersegurança

Fire Shield é uma extensão de navegador que realiza uma análise de segurança e privacidade de páginas web, fornecendo informações detalhadas sobre vários aspectos de segurança.

## Funcionalidades

### 1. Análise de Conexões de Terceiros 
- Detecta e lista conexões a domínios de terceiros durante a navegação.


### 2. Detecção de Ameaças de Sequestro de Navegador 
- Identifica possíveis tentativas de hijacking e hooking do navegador
    - Verifica a presença de scripts suspeitos
    - Analisa os scripts carregados em busca de padrões maliciosos
    - Atribui uma pontuação de ameaça com base nas detecções

### 3. Monitoramento de Armazenamento Local
- Analisa o uso do armazenamento local (HTML5 Local Storage) pelos sites.
- Informa sobre a quantidade de dados armazenados localmente.

### 4. Análise de Cookies 
- Contabiliza e categoriza cookies injetados durante o carregamento da página.
- Diferencia entre cookies de primeira e terceira parte, bem como cookies de sessão e de navegação.

### 5. Detecção de Canvas Fingerprinting 
- Identifica tentativas de fingerprinting usando a API Canvas.

### 6. Pontuação de Privacidade 
- Calcula uma pontuação geral de privacidade com base nos resultados das análises acima.
- Fornece uma avaliação clara sobre o respeito à privacidade do usuário pelo site visitado.

#### 6.1 Como funciona a pontuação

| Critério | Pontos Deduzidos | Condição |
|----------|------------------|----------|
| Cookies | 10 | Se houver mais de 10 cookies |
| Canvas Fingerprinting | 30 | Se detectado |
| Armazenamento Local | 10 | Se houver mais de 20 itens armazenados |
| Requisições de Terceiros | 15 | Se houver mais de 15 requisições |
| Sequestro de Navegador | 20 | Se detectadas mais de 2 ações suspeitas |
| Sequestro de Navegador | 10 | Se detectadas 1-2 ações suspeitas |


A pontuação começa em 100 e são vai diminuindo a quantidade de pontos conforme a tabela acima. Quanto maior a pontuação final, melhor a privacidade do site.

## Como Usar

1. Instale a extensão Fire Shield no seu navegador.
2. Navegue normalmente na web.
3. Clique no ícone da extensão para ver a análise detalhada da página atual.
4. Revise as informações fornecidas sobre segurança e privacidade.

## Referências
* https://github.com/mdn/webextensions-examples
