**create USER**

`post -> http://localhost:3000/users`
```json
  {
    "email":"luis@example.com",
    "password":"luis"
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

**update Role**

`put -> http://localhost:3000/users`
```js
  Authorization: Bearer {token}
```

```json
  {
    "status":"teacher"
  }
  or
  {
    "status":"student"
  }
```

**delete USER**

`delete -> http://localhost:3000/users`
```js
  Authorization: Bearer {token}
```

**post TEST**

`post -> http://localhost:3000/users/test`
```js
  Authorization: Bearer {token}
```
