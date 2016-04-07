# GDG São José dos Campos
##### Hackathon 09/04/2016
---

### Doc API
#
#
#
##### Listar Todos
#
```sh
GET - api/ocorrencias

response:
{
  "status": "OK",
  "result": [...]
}
```
##### Listar por time
#
```sh
GET - api/ocorrencias/team/:team

response:
{
  "status": "OK",
  "result": [...]
}
```
##### Obter por ID
#
```sh
GET - api/ocorrencias/:ocurid

response:
{
  "status": "OK",
  "result": [...]
}
```
##### Adicionar
#
```sh
POST - api/ocorrencias/team/:team
Content-Type: application/json
{
    "coordinates": [1, 0], // longitute, latitude
    "type": 0,
    "description": "terreno usado como lixao"
}

response:
{
  "status": "OK",
  "result": "5706b3f8170e6dx300bd583e" // id da ocorrência
}
```
##### Anexar foto
#
```sh
POST - api/ocorrencias/:ocurid/attach
Content-Type: multipart/form-data

response:
{
  "status": "OK",
  "result": "/upload/AbB_FqVyKrZShGuCzejxXVPz.png" // caminho da imagem
}
```
##### Excluir Ocorrência
#
```sh
DELETE - api/ocorrencias/:ocurid

response:
{
  "status": "OK",
  "result": []
}
```

#### Observações
Tipos de ocorrências
```sh
{
    '0': 'Lixo',
    '1': 'Caixa d\'água',
    '2': 'Piscina',
    '3': 'Calha',
    '4': 'Vazos',
    '5': 'Terreno vazio',
    '6': 'Casa/Predio abandonado',
    '7': 'Outro'
}
```
Exemplo de um GET
```sh
GET - api/ocorrencias/5706b3f8170e6d0300bd583e

response:
{
  "status": "OK",
  "result": [
    {
      "_id": "5706b3f8170e6d0300bd583e",
      "coordinates": [
        1,
        0
      ],
      "type": 0,
      "description": "terreno usado como lixao",
      "datetime": "2016-04-07T19:24:40.667Z",
      "images": [
        "/upload/AbB_FqVyKrZShGuCzejxXVPz.png"
      ],
      "team": "5"
    }
  ]
}
```
