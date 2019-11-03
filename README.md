# oauth-typescript-mongo

> Crud construído com typescript, express e mongodb com autenticação oauth2 usando GitHub

## Instalação

```sh
npm run build
docker-compose up
```

## Aplicação

- O acesso a aplicação pode ser feito usando uma conta do GitHub, através de autenticação oauth2. Neste caso a aplicação deve estar rodando em localhost:3000, endereço que foi configurado no GitHub Apps. É possível também gerar um outro token para um outro endereço, porém é necessário alterar o clientID e o clientSecret no arquivo keys.ts.
- Também é possível criar um novo usuário através do item de menu Criar Conta. Após a criação você será redirecionado para a página de login e poderá efetuá-lo com o email e senha criados.
- Na aplicação temos um crud de usuários e um outro de issues. Os dois cruds somente podem ser acessados após o login.
- A edição do campo senha de um usuário somente poderá ser efetuada se o mesmo usuário estiver logado. O email não pode ser alterado e os demais campos podem ser alterados por qualquer usuário logado.
- Quando uma issue é criada, o usuário logado é considerado como reporter da issue.

## Estrutura

- pacote view: páginas da aplicação. Foi usado o framework express handlebars para a construção das mesmas e bootstrap para estilização;
- pacote model: contém os esquemas usados pelo mongoose -biblioteca de conexão com mongodb. Nesse pacote estão definidos os modelos dos documentos das coleções do mongodb.
- pacote routes: Comtém as rotas usadas pelo express para efetuar o tratamento das chamadas get e post da view.
- pacote config: Contém um arquivos de chaves e o arquivo de configuração do passport, que é um middleware de autenticação usado nesse projeto com autenticação local e autenticação via oauth2.
