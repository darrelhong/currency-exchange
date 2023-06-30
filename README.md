# Quickstart

```
npm i

npm run dev
```

if database is not initialised

```
npm run seed:db
```

# Features

#### cron job every minute to update db with exchange rate information

#### Endpoints

<details>
 <summary><code>GET</code> <code><b>/exchange-rates</b></code> <code>get exchange rates for currency type</code></summary>

##### Parameters

> | name   | type     | data type                   | description   |
> | ------ | -------- | --------------------------- | ------------- |
> | `base` | optional | string ('fiat' or 'crypto') | currency type |

##### Responses

> | http code | content-type       | response                                   |
> | --------- | ------------------ | ------------------------------------------ |
> | `200`     | `application/json` | `{"BTC":{"EUR":"2.0", ...}, "DOGE": ...}}` |
> | `400`     | `application/json` | `{"error":"Invalid base currency"}`        |

</details>

<details>
 <summary><code>GET</code> <code><b>/historical-rates</b></code> <code>get historical rates for currency pair</code></summary>

##### Parameters

> | name             | type     | data type | description                                              |
> | ---------------- | -------- | --------- | -------------------------------------------------------- |
> | `base_currency`  | required | string    | currency symbol                                          |
> | `taget_currency` | required | string    | currency symbol (must be opposite type to base_currency) |
> | `start`          | required | number    | unix time in milliseconds                                |
> | `end`            | optional | number    | unix time in milliseconds                                |

##### Responses

> | http code | content-type       | response                                                          |
> | --------- | ------------------ | ----------------------------------------------------------------- |
> | `200`     | `application/json` | `[{"value":"0.0000328412132267","timestamp":1688078642000}, ...]` |
> | `400`     | `application/json` | `{"error":"Invalid parameters"}`                                  |

</details>
