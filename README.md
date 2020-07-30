
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

**post TEST**

`put -> http://localhost:3000/users/image`
```js
  Authorization: Bearer {token}
```
```js
  file: .jpg (jpge,png)
```

**get WatchImg**

`get -> http://localhost:3000/users/image`
```js
  Authorization: Bearer {token}
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

**get WatchTotalUser**

`get -> http://localhost:3000/users/total`

