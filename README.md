# JAREN SHOP API
API for Jaren Shop e-commerce data management.

## API Reference
[TOCM]

[TOC]
## **1. Brands**
Brands of perfumes marketed in e-commerce
#### **Get all brands** (example)

Request
```
GET  /api/v1/brands

```
Response
```
application/json

[
	{
		"id": 1,
		"name":  "DIOR",
		"logoUrl": "http://diorlogo.png"
	},
	{
		"id": 2,
		"name":  "CHANEL",
		"logoUrl": "http://chanellogo.png"
	}
]
```

#### **Get brand** (example)

Request
```
GET  /api/v1/brands/1

```
Response
```
application/json

{
	"id": 1,
	"name":  "DIOR",
	"logoUrl": "http://diorlogo.png"
}
```

#### **Add new brand** (example)

Request
```
POST  /api/v1/brands
```
```
application/json

{
	"name":  "DIOR",
	"logoUrl": "http://diorlogo.png"
}
```
Response
```
application/json

{
	"id": 1,
	"name":  "DIOR",
	"logoUrl": "http://diorlogo.png"
}
```
