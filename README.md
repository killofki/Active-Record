![ActiveRecord](https://github.com/aykutkardas/Active-Record/blob/master/logo.png?raw=true)
+ ( arrow function + ... version ) 
+ ( 180122 ) 

### Example
```js
ActiveRecord
.where({country:'Turkey', city: 'Izmir'})
.select('city', 'street', 'zipcode')
.orderBy('city', 'DESC')
.limit(10)
.get(DataJSON);
```

### Multi Where
```js
ActiveRecord
.where([{country:'Turkey'}, {country: 'Iceland'}])
.get(DataJSON);
```

Enjoy!
