# List Manager

Este é um projeto de exemplo de um gerenciador de listas simples, desenvolvido em ASP.NET Core Web API para o backend e HTML, CSS (Tailwind CSS) e JavaScript puro para o frontend. Ele permite criar diferentes tipos de listas (compras, tarefas, anotações, metas) e gerenciar itens dentro delas, incluindo adicionar, editar, excluir e marcar como concluído. Este projeto é ideal para ser incluído em um portfólio, demonstrando habilidades em desenvolvimento web full-stack com .NET.

## Imagens do Projeto

<img width="1617" height="560" alt="image" src="https://github.com/user-attachments/assets/cfb9dbee-9023-4c45-8fd8-61733a5bcc67" />

<img width="1488" height="790" alt="image" src="https://github.com/user-attachments/assets/938c7079-3084-4681-812e-24d3c16dde9a" />

<img width="1488" height="790" alt="image" src="https://github.com/user-attachments/assets/00e9dc8d-3545-41ff-8064-99312a0a8cdd" />

<img width="1488" height="790" alt="image" src="https://github.com/user-attachments/assets/8ddf918e-98cd-44a0-8b69-18cae7654e49" />

<img width="1488" height="790" alt="image" src="https://github.com/user-attachments/assets/50326d18-0863-41fe-a71d-f8c9b4189876" />




## Funcionalidades

- **Criação e Gerenciamento de Listas:** Crie, visualize, edite e exclua listas com nome, descrição, tipo e cor personalizados.
- **Gerenciamento de Itens:** Adicione, edite, exclua e marque itens como concluídos dentro de cada lista.
- **Prioridade de Itens:** Defina prioridade (Baixa, Média, Alta) para os itens da lista.
- **Interface Responsiva:** Design adaptável para diferentes tamanhos de tela, utilizando Tailwind CSS.
- **Dados em Memória:** Para simplicidade e facilidade de demonstração, os dados são armazenados em memória, sem a necessidade de um banco de dados persistente.

## Tecnologias Utilizadas

- **Backend:**
    - ASP.NET Core Web API 8.0
    - C#
- **Frontend:**
    - HTML5
    - CSS3 (Tailwind CSS)
    - JavaScript (Vanilla JS)
- **Outros:**
    - Font Awesome para ícones

## Como Rodar o Projeto Localmente

Siga os passos abaixo para configurar e executar o projeto em sua máquina local.

### Pré-requisitos

Certifique-se de ter os seguintes softwares instalados:

- [.NET SDK 8.0](https://dotnet.microsoft.com/download/dotnet/8.0)
- Um editor de código (como [Visual Studio Code](https://code.visualstudio.com/))

### Passos para Execução

1.  **Clone o Repositório:**
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO>
    cd ListManager
    ```

2.  **Navegue até o Diretório do Projeto:**
    ```bash
    cd ListManager
    ```

3.  **Restaure as Dependências e Compile o Projeto:**
    ```bash
    dotnet build
    ```

4.  **Execute a Aplicação:**
    ```bash
    dotnet run
    ```
    Por padrão, a aplicação será iniciada em `http://localhost:5000` (ou outra porta disponível). O console indicará a URL exata.

5.  **Acesse a Aplicação no Navegador:**
    Abra seu navegador web e navegue para a URL fornecida (ex: `http://localhost:5000`).

## Estrutura do Projeto

```
ListManager/
├── Controllers/             # Controladores da API
│   └── ListsController.cs
├── Models/                  # Modelos de dados (ListItem, TodoList, DTOs)
│   ├── CreateListRequest.cs
│   ├── ListItem.cs
│   └── TodoList.cs
├── Services/                # Lógica de negócio e gerenciamento de dados
│   └── ListService.cs
├── wwwroot/                 # Arquivos estáticos do frontend
│   ├── index.html
│   ├── script.js
│   └── styles.css
├── Program.cs               # Configuração da aplicação e injeção de dependências
├── ListManager.csproj       # Arquivo de projeto .NET
└── README.md                # Este arquivo
```

## Como Usar

1.  **Visualizar Listas:** Ao abrir a aplicação, você verá um grid com as listas existentes (incluindo algumas de exemplo).
2.  **Criar Nova Lista:** Clique no botão "Nova Lista" no canto superior direito. Preencha o nome, descrição, tipo e escolha uma cor para sua lista.
3.  **Visualizar Detalhes da Lista:** Clique em qualquer card de lista para abrir um modal com seus itens.
4.  **Adicionar Item:** Dentro do modal de detalhes da lista, digite o nome do item no campo "Adicionar novo item...", selecione a prioridade e clique no botão de adicionar.
5.  **Marcar/Desmarcar Item:** Clique no ícone de círculo ao lado do item para marcá-lo como concluído ou desmarcá-lo.
6.  **Editar Item:** Clique no ícone de lápis ao lado do item para editar seu título.
7.  **Excluir Item:** Clique no ícone de lixeira ao lado do item para excluí-lo.
8.  **Editar Lista:** Dentro do modal de detalhes da lista, clique no ícone de lápis no cabeçalho para editar os detalhes da lista.
9.  **Excluir Lista:** Dentro do modal de detalhes da lista, clique no ícone de lixeira no cabeçalho para excluir a lista inteira.

## Contribuição

Sinta-se à vontade para fazer um fork deste repositório, propor melhorias e enviar pull requests. Sugestões de melhorias incluem:

-   Implementação de persistência de dados (ex: SQLite, SQL Server, PostgreSQL).
-   Autenticação e autorização de usuários.
-   Funcionalidades de arrastar e soltar para reordenar itens/listas.
-   Filtros e ordenação de listas e itens.
-   Testes unitários e de integração.

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes. (Não incluído neste exemplo, mas recomendado para projetos de portfólio).


