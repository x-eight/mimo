**create USER**

`post -> http://localhost:3000/users`
```json
  {
    "email":"luis@example.com",
    "password":"luis"
  }
```

**update Role**

`put -> http://localhost:3000/users/:id`
```json
  {
    "status":"teacher"
  }
  or
  {
    "status":"student"
  }
```

**login USER**
`post -> http://localhost:3000/users/login`
```json
  {
    "email":"luis@example.com",
    "password":"luis"
  }
```

`post -> http://localhost:3000/users/test`
```js
  Authorization: Bearer {token}
```

**delete USER**
`delete -> http://localhost:3000/users/:id`
