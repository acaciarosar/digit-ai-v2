# Interface Web DigitAI

Interface web desenvolvida com Django para permitir que o usuário desenhe um dígito de 0 a 9 e envie a imagem para reconhecimento pelo modelo de aprendizado de máquina disponibilizado pela API FastAPI.

## Requisitos

- Python 3.13
- Django 6.1.2
- Dependências do projeto principal, definidas no arquivo `requirements.txt` da raiz.

## Instalação

Na pasta raiz do projeto, com o ambiente virtual ativado, execute:

```powershell
pip install -r web/requirements.txt
```

## Execução

A aplicação depende de dois servidores em execução simultânea. Abra dois terminais na pasta raiz do projeto e mantenha ambos ativos durante a utilização.

**Terminal 1 — API FastAPI**

```powershell
uvicorn main:app --reload --port 8001
```

A API ficará disponível em:

`http://127.0.0.1:8001/`

**Terminal 2 — Interface Django**

```powershell
python web/manage.py runserver
```

A interface ficará disponível em:

`http://127.0.0.1:8000/`

## Utilização

1. Acesse a interface pelo navegador.
2. Desenhe um número no quadro.
3. Clique em **Reconhecer**.
4. Consulte o dígito previsto e o nível de confiança retornado pela API.
5. Utilize **Limpar** para apagar o desenho e iniciar um novo reconhecimento.

O reconhecimento depende da disponibilidade da API FastAPI.

## Arquitetura

O Django atua como camada de apresentação e comunicação com o usuário. A API FastAPI permanece responsável por receber os dados da imagem e disponibilizar o modelo de reconhecimento treinado no projeto DigitAI.

A interface Django é uma extensão do projeto original e depende da API FastAPI para realizar os reconhecimentos.