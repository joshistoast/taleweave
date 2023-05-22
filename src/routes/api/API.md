# The API

Taleweave has a basic RESTful API that can be used to query posts and tags.

## Table of Contents

- [The API](#the-api)
  - [Table of Contents](#table-of-contents)
  - [Posts](#posts)
    - [Get all posts](#get-all-posts)
      - [Parameters](#parameters)
      - [Example Response](#example-response)
    - [Get a post](#get-a-post)
      - [Example Response](#example-response-1)
  - [Tags](#tags)
    - [Autocomplete](#autocomplete)
      - [Parameters](#parameters-1)
      - [Example Response](#example-response-2)

## Posts

### Get all posts

`GET /api/posts`

Returns a list of all posts.

#### Parameters

| Name | Type | Description | Default | Example |
| ---- | ---- | ----------- | ------- | ------- |
| `limit` | `number` | The maximum number of posts to return. | `10` | `20` |
| `page` | `number` | The page of posts to return. | `1` | `2` |
| `featured` | `boolean` | Whether to return only featured posts. | `undefined` | `true` |
| `tags` | `string` | A comma-separated list of tags to filter by. | `undefined` | `fantasy,sci-fi` |
| `search` | `string` | A search query to filter posts by. This searches titles, descriptions, tags and contents | `undefined` | `magic` |
| `ratings` | `string` | A comma-separated list of age ratings to filter by. | `undefined` | `t,m` |
| `author` | `string` | The username of the author to filter by. | `undefined` | `johndoe` |

#### Example Response

```json
{
  "posts": [
    {
      "id": "157965ee-9571-4db3-8e48-8124157bc904",
      "createdAt": "2023-05-16T16:19:33.488Z",
      "updatedAt": "2023-05-16T16:20:52.048Z",
      "title": "Once upon a time",
      "description": "",
      "featured": false,
      "rating": "s",
      "author": {
        "id": "1",
        "username": "johndoe",
        "displayName": "John Doe",
      },
      "tags": [
        {
          "id": "1",
          "name": "fantasy",
          "_count": {
            "posts": 1
          }
        }
      ],
      "_count": {
        "bookmarks": 2,
      }
    },
    // more posts...
  ],
  "tags": [
    {
      "id": "1",
      "name": "fantasy",
      "_count": {
        "posts": 1
      }
    }
  ],
  "pagination": {
    "size": 10,
    "page": 1,
    "total": 1,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

### Get a post

`GET /api/posts/:id`

Returns a single post with more data.

#### Example Response

```json
{
  "post": {
    "id": "157965ee-9571-4db3-8e48-8124157bc904",
    "createdAt": "2023-05-16T16:19:33.488Z",
    "updatedAt": "2023-05-16T16:20:52.048Z",
    "title": "Once upon a time",
    "description": "",
    "featured": false,
    "rating": "s",
    "author": {
      "id": "1",
      "username": "johndoe",
      "displayName": "John Doe",
    },
    "tags": [
      {
        "id": "1",
        "name": "fantasy",
        "_count": {
          "posts": 1
        }
      }
    ],
    "content": "", // The posts's html content
    "_count": {
      "bookmarks": 2,
    }
  },
  "isBookmarked": true,
  "score": {
    "id": "1",
    "createdAt": "2023-05-18T20:45:14.911Z",
    "updatedAt": "2023-05-21T23:35:32.510Z",
    "postId": "1",
    "userId": "1",
    "value": 5
  }
}
```

## Tags

### Autocomplete

This endpoint is used to autocomplete tags on inputs such as the tag input on the post editor.

`GET /api/tags/autocomplete`

#### Parameters

| Name | Type | Description | Default | Example |
| ---- | ---- | ----------- | ------- | ------- |
| `query` | `string` | The query to autocomplete. | `undefined` | `fant` |

#### Example Response

```json
[
  {
    "name": "fantasy",
    "id": "1",
    "_count": {
      "posts": 1
    }
  }
  // more tags...
]
```
