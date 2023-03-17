<a name="readme-top"></a>

<!-- Conteúdo -->
<details>
  <summary>Conteúdo</summary>
  <ol>
    <li>
      <a href="#sobre-o-projeto">Sobre o projeto</a>
      <ul>
        <li><a href="#feito-com">Feito com</a></li>
      </ul>
    </li>
    <li><a href="#exemplos-de-requisições">Exemplos de Requisições</a></li>
    <li><a href="#contato">Contato</a></li>
  </ol>
</details>

<!-- SOBRE O PROJETO -->
## Sobre o projeto

Back-End do projeto integrador da Labenu, o LabEddit.

<p align="right">(<a href="#readme-top">voltar para o topo</a>)</p>

### Feito com

* [![Typescript][typescript-shield]][typescript-url]
* [![Node][node-shield]][node-url]
* [![Express][express-shield]][express-url]
* [![SQLite][sqlite-shield]][sqlite-url]

<p align="right">(<a href="#readme-top">voltar para o topo</a>)</p>

<!-- EXEMPLOS DE REQUISIÇÕES -->
## Exemplos de Requisições

Seguem exemplos de como utilizar a API criada neste projeto.

### Users

#### Get all users

```typescript
// Request
// GET /users
// Headers:
//   Authorization: <seu_token_de_acesso>
// Response
// status 200 OK
[
    {
        "id": "4e25a2da-d325-4c19-8c18-8c4007667820",
        "username": "carldonovan",
        "role": "ADMIN"
    },
    {...},
    {
        "id": "ddb664cc-13b8-450e-8f52-c3cf0b075a06",
        "username": "thomasgrant",
        "role": "NORMAL"
    }
]
```

#### Get User By Id

```typescript
// Request
// path params = :id
// GET /users/4e25a2da-d325-4c19-8c18-8c4007667820
// Headers:
//   Authorization: <seu_token_de_acesso>
// Response
// status 200 OK
{
    "id": "4e25a2da-d325-4c19-8c18-8c4007667820",
    "username": "carldonovan",
    "role": "ADMIN"
}
```

#### Verify token

```typescript
// Request
// path params = :token
// GET /users/verify-token/bananinha
// Response
// status 200 OK
{
    "isTokenValid": false
}
```

#### Create User
```typescript
// Request
// POST /users/signup
// body JSON
{
  "username": "johndoe",
  "email": "johndoe@gmail.com",
  "password": "bananinha",
  "receiveEmails": false
}
// Response
// status 201 CREATED
{
  "token": "token-jwt-do-john-doe",
  "userId": "id-do-john-doe"
}
```

#### User Login
```typescript
// Request
// POST /users/login
// body JSON
{
  "email": "johndoe@gmail.com",
  "password": "bananinha",
}
// Response
// status 200 OK
{
  "token": "token-jwt-do-john-doe",
  "userId": "id-do-john-doe"
}
```

#### Delete User By Id

```typescript
// Request
// path params = :id
// DELETE /users/id-do-john-doe
// Headers:
//   Authorization: <seu_token_de_acesso>
// Response
// status 200 OK
```
### Posts

#### Get all posts

```typescript
// Request
// GET /posts
// Headers:
//   Authorization: <seu_token_de_acesso>
// Response
// status 200 OK
[
    {
        "id": "3ed153dc-e908-4fe6-bc93-5e0b40a9ab26",
        "content": "Que linguagem de programação devo aprender primeiro, Python ou Javascript?",
        "upvotes": 1,
        "downvotes": 0,
        "createdAt": "2023-03-17T04:01:53.790Z",
        "updatedAt": "2023-03-17T04:01:53.790Z",
        "creator": {
            "id": "11d71798-f86f-4fd7-a48e-720151171fd5",
            "username": "johntitor"
        },
        "comments": [
            {
                "id": "557f630a-f80c-47c5-9d18-b083a34e7aef",
                "content": "Depende muito de qual área você focar. Se você quer focar mais em dados, Python primeiro é melhor. Se quiser focar mais em Desenvolvimento Web, Javascript é melhor.",
                "upvotes": 0,
                "downvotes": 0,
                "creator": {
                    "id": "a3ee8f27-f424-40b0-9459-d7dca989bc4a",
                    "username": "juliaschmidt"
                }
            },
            {
                "id": "457fa5b1-7bff-432f-ba7a-445df9e4d3ec",
                "content": "Eu acho que Python é melhor de aprender primeiro, independente de qualquer coisa, porque a sintaxe é muito tranquila, parece que você está escrevendo uma carta para o seu computador.",
                "upvotes": 0,
                "downvotes": 0,
                "creator": {
                    "id": "ddb664cc-13b8-450e-8f52-c3cf0b075a06",
                    "username": "thomasgrant"
                }
            }
        ]
    },
    {...},
    {
        "id": "63f3113f-ce65-41d0-9e73-b14e3f139915",
        "content": "Estudar programação é perceber que x = x + 1 é algo completamente possível!",
        "upvotes": 2,
        "downvotes": 0,
        "createdAt": "2023-03-17T04:08:46.200Z",
        "updatedAt": "2023-03-17T04:08:46.200Z",
        "creator": {
            "id": "ddb664cc-13b8-450e-8f52-c3cf0b075a06",
            "username": "thomasgrant"
        },
        "comments": [
            {
                "id": "db507e1d-a6e6-49bb-8ec4-f9c91a2dded5",
                "content": "A primeira vez que eu vi isso na minha vida demorei uma semana pra conseguir entender. XD",
                "upvotes": 0,
                "downvotes": 0,
                "creator": {
                    "id": "11d71798-f86f-4fd7-a48e-720151171fd5",
                    "username": "johntitor"
                }
            }
        ]
    }
]
```

#### Get Post By Id

```typescript
// Request
// path params = :id
// GET /posts/3ed153dc-e908-4fe6-bc93-5e0b40a9ab26
// Headers:
//   Authorization: <seu_token_de_acesso>
// Response
// status 200 OK
{
    "id": "3ed153dc-e908-4fe6-bc93-5e0b40a9ab26",
    "content": "Que linguagem de programação devo aprender primeiro, Python ou Javascript?",
    "upvotes": 1,
    "downvotes": 0,
    "createdAt": "2023-03-17T04:01:53.790Z",
    "updatedAt": "2023-03-17T04:01:53.790Z",
    "creator": {
        "id": "11d71798-f86f-4fd7-a48e-720151171fd5",
        "username": "johntitor"
    },
    "comments": [
        {
            "id": "557f630a-f80c-47c5-9d18-b083a34e7aef",
            "content": "Depende muito de qual área você focar. Se você quer focar mais em dados, Python primeiro é melhor. Se quiser focar mais em Desenvolvimento Web, Javascript é melhor.",
            "upvotes": 0,
            "downvotes": 0,
            "creator": {
                "id": "a3ee8f27-f424-40b0-9459-d7dca989bc4a",
                "username": "juliaschmidt"
            }
        },
        {
            "id": "457fa5b1-7bff-432f-ba7a-445df9e4d3ec",
            "content": "Eu acho que Python é melhor de aprender primeiro, independente de qualquer coisa, porque a sintaxe é muito tranquila, parece que você está escrevendo uma carta para o seu computador.",
            "upvotes": 0,
            "downvotes": 0,
            "creator": {
                "id": "ddb664cc-13b8-450e-8f52-c3cf0b075a06",
                "username": "thomasgrant"
            }
        }
    ]
}
```

#### Get all post votes
```typescript
// Request
// GET /posts/votes
// Headers:
//   Authorization: <seu_token_de_acesso>
// Response
// status 200 OK
[
    {
        "userId": "e3d060d2-b18e-4035-8f95-4f27627fa897",
        "postId": "65fd7570-4b43-4fb8-9d3b-df2d247fab08",
        "vote": 1
    },
    {...},
    {
        "userId": "a3ee8f27-f424-40b0-9459-d7dca989bc4a",
        "postId": "65fd7570-4b43-4fb8-9d3b-df2d247fab08",
        "vote": 1
    }
]
```

#### Create post
```typescript
// Request
// POST /posts
// Headers:
//   Authorization: <seu_token_de_acesso>
// body JSON
{
    "content": "Preciso estudar mais linguagem Markdown!"
}
// Response
// status 201 CREATED
```

#### Edit Post Vote by Id
```typescript
// Request
// path params = :id
// PUT /posts/:id/vote
// Headers:
//   Authorization: <seu_token_de_acesso>
// body JSON
{
    "vote": true
}
// Response
// status 200 OK
```

#### Edit Post By Id
```typescript
// Request
// path params = :id
// PUT /posts/:id
// Headers:
//   Authorization: <seu_token_de_acesso>
// body JSON
{
    "content": "Mudei de ideia. Eu sou ótimo em Markdown!"
}
// Response
// status 200 OK
```

#### Delete Post By Id
```typescript
// Request
// path params = :id
// DELETE /posts/:id
// Headers:
//   Authorization: <seu_token_de_acesso>
// Response
// status 200 OK
```

### Comments

#### Get all comments

```typescript
// Request
// GET /comments
// Headers:
//   Authorization: <seu_token_de_acesso>
// Response
// status 200 OK
[
    {
        "id": "557f630a-f80c-47c5-9d18-b083a34e7aef",
        "content": "Depende muito de qual área você focar. Se você quer focar mais em dados, Python primeiro é melhor. Se quiser focar mais em Desenvolvimento Web, Javascript é melhor.",
        "upvotes": 0,
        "downvotes": 0,
        "createdAt": "2023-03-17T04:03:17.624Z",
        "updatedAt": "2023-03-17T04:03:17.624Z",
        "creator": {
            "id": "a3ee8f27-f424-40b0-9459-d7dca989bc4a",
            "username": "juliaschmidt"
        },
        "postId": "3ed153dc-e908-4fe6-bc93-5e0b40a9ab26"
    },
    {...},
    {
        "id": "db507e1d-a6e6-49bb-8ec4-f9c91a2dded5",
        "content": "A primeira vez que eu vi isso na minha vida demorei uma semana pra conseguir entender. XD",
        "upvotes": 0,
        "downvotes": 0,
        "createdAt": "2023-03-17T04:11:26.752Z",
        "updatedAt": "2023-03-17T04:11:26.752Z",
        "creator": {
            "id": "11d71798-f86f-4fd7-a48e-720151171fd5",
            "username": "johntitor"
        },
        "postId": "63f3113f-ce65-41d0-9e73-b14e3f139915"
    }
]
```

#### Get Comment By Id

```typescript
// Request
// path params = :id
// GET /comments/557f630a-f80c-47c5-9d18-b083a34e7aef
// Headers:
//   Authorization: <seu_token_de_acesso>
// Response
// status 200 OK
{
    "id": "557f630a-f80c-47c5-9d18-b083a34e7aef",
    "content": "Depende muito de qual área você focar. Se você quer focar mais em dados, Python primeiro é melhor. Se quiser focar mais em Desenvolvimento Web, Javascript é melhor.",
    "upvotes": 0,
    "downvotes": 0,
    "createdAt": "2023-03-17T04:03:17.624Z",
    "updatedAt": "2023-03-17T04:03:17.624Z",
    "creator": {
        "id": "a91ebf62-a55d-43e6-b6cd-9e1a6a2aed87",
        "username": "alicegrassi"
    },
    "postId": "3ed153dc-e908-4fe6-bc93-5e0b40a9ab26"
}
```

#### Get all comments votes

```typescript
// Request
// GET /comments/votes
// Headers:
//   Authorization: <seu_token_de_acesso>
// Response
// status 200 OK
[
    {
        "userId": "a3ee8f27-f424-40b0-9459-d7dca989bc4a",
        "commentId": "265164e3-47bd-4227-b3e4-40c2e2726f83",
        "vote": 1
    },
    {
        "userId": "11d71798-f86f-4fd7-a48e-720151171fd5",
        "commentId": "4099e536-2a6e-43f8-99a0-07a760b81d43",
        "vote": 1
    }
]
```

#### Create comment

```typescript
// Request
// POST /comments
// Headers:
//   Authorization: <seu_token_de_acesso>
// body JSON
{
    "content": "Se for aprender Desenvolvimento Front-End, é Javascript na certa!",
    "postId": "3ed153dc-e908-4fe6-bc93-5e0b40a9ab26"
}
// Response
// status 201 CREATED
```

#### Edit Comment Vote by Id
```typescript
// Request
// path params = :id
// PUT /comments/:id/vote
// Headers:
//   Authorization: <seu_token_de_acesso>
// body JSON
{
    "vote": true
}
// Response
// status 200 OK
```

#### Edit Comment By Id
```typescript
// Request
// path params = :id
// PUT /comments/:id
// Headers:
//   Authorization: <seu_token_de_acesso>
// body JSON
{
    "content": "Python é uma linguagem cheia de recursos e muito fácil de aprender."
}
// Response
// status 200 OK
```

#### Delete Comment By Id
```typescript
// Request
// path params = :id
// DELETE /comments/:id
// Headers:
//   Authorization: <seu_token_de_acesso>
// Response
// status 200 OK
```

<p align="right">(<a href="#readme-top">voltar para o topo</a>)</p>
 
 <!-- CONTATO -->
 ## Contato

[![Github][github-shield]][github-url][![Linkedin][linkedin-shield]][linkedin-url]


<p align="right">(<a href="#readme-top">voltar para o topo</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
[typescript-shield]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white 
[typescript-url]: https://www.typescriptlang.org/
[node-shield]: https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white
[node-url]: https://nodejs.org/
[express-shield]: https://img.shields.io/badge/Express.js-404D59?style=for-the-badge
[express-url]: https://www.npmjs.com/package/express
[sqlite-shield]: https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white
[sqlite-url]: https://sqlite.org/
[linkedin-shield]: https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white
[linkedin-url]: https://www.linkedin.com/in/vitor-fontenele/
[github-shield]: https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white
[github-url]: https://github.com/vitorfontenele
