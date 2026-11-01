# DigitAI — Classificação de Dígitos Manuscritos com Inteligência Artificial

## 1. Apresentação

O **DigitAI** é um projeto de aprendizado de máquina desenvolvido para reconhecer e classificar dígitos manuscritos de 0 a 9, utilizando uma Rede Neural Artificial do tipo **Multilayer Perceptron (MLP)**, treinada com a base de dados MNIST.

O projeto contempla o treinamento e a comparação de diferentes algoritmos de classificação, a seleção do modelo com melhor desempenho, a serialização do modelo treinado e o desenvolvimento de uma API REST para disponibilizar as predições.

A aplicação foi construída com FastAPI e utiliza validação de dados com Pydantic, permitindo receber imagens representadas por vetores de pixels e retornar o dígito previsto e o respectivo nível de confiança.

## 2. Tecnologias utilizadas

- Python
- Jupyter Notebook
- NumPy
- Pandas
- Matplotlib
- Pillow
- Scikit-learn
- FastAPI
- Pydantic
- Uvicorn
- Joblib
- Git e GitHub

## 3. Base de dados e treinamento

O treinamento foi realizado com a base de dados **MNIST (Modified National Institute of Standards and Technology)**, composta por imagens de dígitos manuscritos em escala de cinza, com dimensões de 28 × 28 pixels.

Cada imagem foi representada por um vetor de 784 características, com valores normalizados para o intervalo de 0 a 1.

A divisão dos dados foi realizada de forma estratificada:

- Treinamento: 49.000 imagens (70%).
- Validação: 7.000 imagens (10%).
- Teste: 14.000 imagens (20%).

Foram comparados três algoritmos de classificação:

- K-Nearest Neighbors (KNN).
- Random Forest.
- Multilayer Perceptron (MLP).

### 3.1. Comparação dos modelos

Os modelos foram avaliados utilizando as métricas Accuracy, Precision, Recall e F1-score, com média ponderada (*weighted average*).

**Resultados na validação:**

| Modelo | Accuracy | Precision | Recall | F1-score |
|---|---:|---:|---:|---:|
| KNN | 0,972286 | 0,972480 | 0,972286 | 0,972253 |
| Random Forest | 0,965143 | 0,965118 | 0,965143 | 0,965090 |
| MLP | 0,975000 | 0,975113 | 0,975000 | 0,975007 |

**Resultados no conjunto de teste:**

| Modelo | Accuracy | Precision | Recall | F1-score |
|---|---:|---:|---:|---:|
| KNN | 0,972143 | 0,972371 | 0,972143 | 0,972110 |
| Random Forest | 0,964786 | 0,964787 | 0,964786 | 0,964760 |
| MLP | 0,979571 | 0,979585 | 0,979571 | 0,979566 |

A MLP apresentou o melhor desempenho entre os três modelos nas métricas avaliadas, sendo selecionada para utilização na API.

### 3.2. Modelo selecionado

A arquitetura da MLP utiliza uma camada oculta com 128 neurônios, função de ativação ReLU e limite de 30 iterações de treinamento.

O modelo treinado foi serializado com Joblib e armazenado no diretório `models/`, no arquivo `mlp_model.joblib`.

## 4. Desafio de classificação com imagens próprias

Além dos experimentos com a base MNIST, foram produzidas três imagens manuscritas próprias, representando os dígitos 4, 7 e 9.

As imagens foram submetidas a um pipeline de pré-processamento que contempla:

- Conversão para escala de cinza.
- Remoção de pixels muito escuros.
- Identificação da região do dígito por meio da bounding box.
- Centralização do desenho.
- Redimensionamento para 28 × 28 pixels.
- Normalização dos valores para o intervalo de 0 a 1.

A MLP original classificou corretamente a imagem do dígito 4. As imagens dos dígitos 7 e 9 foram classificadas como 3. Assim, neste experimento com três imagens próprias, houve um acerto e dois erros. Esses resultados registram uma limitação do modelo nos exemplos avaliados, sem permitir generalizar seu desempenho para todas as imagens produzidas fora do MNIST.

## 5. Arquitetura da aplicação

A API foi desenvolvida com FastAPI, seguindo uma arquitetura modular que separa as responsabilidades de validação, inferência, roteamento e inicialização da aplicação.

### Organização dos arquivos

```text
digit-ai-v2/
│
├── assets/
│   ├── digito_4.png
│   ├── digito_7.png
│   ├── digito_9.png
│   └── logo_digitai.png
│
├── models/
│   └── mlp_model.joblib
│
├── digitai_mnist.ipynb
├── schemas.py
├── services.py
├── routers.py
├── main.py
├── requirements.txt
├── .gitignore
└── README.md
```

### Responsabilidade dos módulos

| Arquivo | Responsabilidade |
|---|---|
| `digitai_mnist.ipynb` | Treinamento, comparação e avaliação dos modelos. |
| `schemas.py` | Definição dos modelos Pydantic e validação dos dados de entrada e saída. |
| `services.py` | Carregamento do modelo serializado e execução da inferência. |
| `routers.py` | Definição dos endpoints da API utilizando APIRouter. |
| `main.py` | Inicialização da aplicação FastAPI e gerenciamento do ciclo de vida. |
| `models/` | Armazenamento do modelo treinado. |
| `assets/` | Armazenamento das imagens próprias utilizadas no desafio de classificação. |
| `requirements.txt` | Registro das dependências e respectivas versões. |

### 5.1. Gerenciamento do modelo

O modelo é carregado uma única vez durante a inicialização da aplicação, utilizando o mecanismo `lifespan` do FastAPI e o gerenciador de contexto assíncrono `asynccontextmanager`.

Após o carregamento, o modelo permanece disponível na memória da aplicação por meio de `app.state.model`, evitando novas leituras do arquivo serializado a cada requisição.

## 6. Instalação e execução

### 6.1. Pré-requisitos

- Python 3.13.17 instalado.
- Git instalado.
- Ambiente virtual Python.

### 6.2. Clonar o repositório

```bash
git clone https://github.com/acaciarosar/digit-ai-v2.git
```

Acesse o diretório:

```bash
cd digit-ai-v2
```

### 6.3. Criar e ativar o ambiente virtual

No Windows:

```powershell
python -m venv .venv
```

Ativar:

```powershell
.venv\Scripts\Activate.ps1
```

### 6.4. Instalar as dependências

```bash
python -m pip install -r requirements.txt
```

### 6.5. Executar a aplicação

Na raiz do projeto, execute:

```bash
uvicorn main:app --reload
```

A API estará disponível em:

```text
http://127.0.0.1:8000
```

## 7. Endpoints disponíveis

A aplicação disponibiliza três endpoints:

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/` | Retorna uma mensagem de funcionamento da API. |
| GET | `/health` | Verifica a disponibilidade do serviço e do modelo carregado. |
| POST | `/predict` | Recebe os pixels de uma imagem e retorna a classificação. |

### 7.1. GET /

Retorna uma mensagem indicando que a API está em execução.

Resposta esperada:

```json
{
  "message": "DigitAI API está em execução.",
  "endpoint": "/predict"
}
```

### 7.2. GET /health

Verifica se o modelo está disponível na memória da aplicação.

Resposta quando o modelo está carregado:

```json
{
  "status": "ok",
  "model_loaded": true
}
```

Caso o modelo não esteja disponível, a API retorna HTTP 503.

### 7.3. POST /predict

Recebe um vetor contendo exatamente 784 valores numéricos, correspondentes aos pixels de uma imagem de 28 × 28.

Os valores devem estar no intervalo de 0 a 1.

Exemplo de estrutura da requisição:

```json
{
  "pixels": [
    0.0,
    0.0,
    0.0
  ]
}
```

A lista completa deve conter exatamente 784 valores. O exemplo acima ilustra apenas o início do vetor.

Resposta de exemplo obtida durante os testes:

```json
{
  "digit": 5,
  "confidence": 0.2958522140979767
}
```

O campo `digit` representa a classe prevista, enquanto `confidence` representa a probabilidade atribuída pelo modelo à classe selecionada.

Esse resultado foi obtido com um vetor de teste composto por 784 pixels zerados, utilizado para verificar o funcionamento da API. Portanto, não representa uma avaliação de reconhecimento de uma imagem manuscrita real.

### 7.4. Validação e códigos HTTP

A API utiliza schemas Pydantic para validar rigorosamente os dados recebidos.

Entre as validações implementadas estão:

- Exatamente 784 pixels por requisição.
- Valores numéricos no intervalo de 0 a 1.
- Rejeição de campos adicionais não previstos no schema.
- Validação dos dados retornados pelo modelo.

Os principais códigos HTTP utilizados são:

| Código | Descrição |
|---|---|
| 200 | Requisição processada com sucesso. |
| 422 | Dados de entrada inválidos ou fora dos critérios de validação. |
| 500 | Erro interno durante a execução da predição. |
| 503 | Modelo indisponível no endpoint de saúde. |

## 8. Documentação interativa

O FastAPI disponibiliza automaticamente uma documentação interativa dos endpoints por meio do Swagger UI.

Após iniciar a aplicação, acesse:

```text
http://127.0.0.1:8000/docs
```

Por meio dessa interface, é possível consultar os endpoints, enviar requisições e visualizar as respostas da API.

## 9. Vídeo de apresentação

O vídeo de apresentação do projeto será disponibilizado no Google Drive.

**Link:** A inserir após a publicação do vídeo.

## 10. Considerações finais

O DigitAI integra conceitos de aprendizado de máquina, processamento de imagens, validação de dados e desenvolvimento de APIs.

O projeto permitiu comparar diferentes algoritmos de classificação, selecionar uma MLP com base nos resultados obtidos e disponibilizar o modelo treinado por meio de uma API modular.

A implementação também contempla o carregamento do modelo em memória, a validação rigorosa das entradas e a disponibilização de endpoints para consulta e classificação de dígitos manuscritos.

---

**Projeto Final — Módulo 2**

Repositório: https://github.com/acaciarosar/digit-ai-v2