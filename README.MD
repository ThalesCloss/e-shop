# Aplicação
A proposta foi desenvolvida em TypeScript, seguindo os conceitos da arquitetura limpa. O domínio da aplicação é totalmente desacoplado de frameworks.

O tratamento de erros do domínio é apenas um modelo simples para esboçar a possibilidade de maior rigor na validação dos erros, uma vez que não é possível identificar no TypeScript quais exceções serão lançadas pelo metodo. Dessa forma o desenvolvedor fica obrigado a tratar a resposta para seguir o fluxo. Outras alternativas são bem-vindas, como Either ou notification pattern.

Para a camada de API foi utilizado o framework Nestjs, por fornecer várias ferramentas que facilitam o desenvolvimento.

# Docker

Executando a aplicação. No diretório raiz do projeto execute:

`docker-compose -f docker/docker-compose.yml up`

A aplicação passará a executar na porta 3000.

Na url http://localhost:3000/docs/ é possível acessar a especificação Open-API e executar requisições.

# Testes

Para executar os testes de unidade execute:

`docker exec -it api_e-shop yarn test`

