**TODO**:

Tạo 1 book đồng thời cũng tạo 1 trans
Xoá 1 book cũng xoá 1 trans của nó

Viết middleware check param required (clean code)
Tạo folder services

(Done) Phân trang: get user list, get hotel list, get service list, get book list, get trans, get comment list
Request: page=, per_page=
Response: {
total:
total_page:
data: []
meta: {
page:
per_page:
},
}

Đánh index

Future features: Login bằng gg (Dùng Auth0, passport.js), Lưu file vào Cloud Storage, rate limiter, thông báo qua mail bằng mailgun hoặc twillio, thanh toán visa bằng stripe

# 1. Auth

Prefix: `/v1/auth`

| Function | Endpoint    | Method | Slug | Query params | Req body |
| -------- | ----------- | ------ | ---- | ------------ | -------- |
| register | `/register` | POST   |      |              |          |
| login    | `/login`    | POST   |      |              |          |
| logout   | `/logout`   | GET    |      |              |          |
| refresh  | `/refresh`  | GET    |      |              |          |

# 2. User

Prefix: `/v1/users`

| Function           | Endpoint       | Method | Slug | Query params | Req body |
| ------------------ | -------------- | ------ | ---- | ------------ | -------- |
| getUsers           | `/?user_id=`   | GET    |      | user_id      |          |
| createUser         | `/`            | POST   |      |              |          |
| updateUserInfoById | `/update_info` | PUT    |      |              | id       |
| deleteUserById     | `/`            | DELETE |      |              | id       |

# 3. Hotel

Prefix: `/v1/hotels`
Note:

-   Với getHotels nếu không có hotel_id thì mặc định lấy all

| Function        | Endpoint       | Method | Slug | Query params | Req body |
| --------------- | -------------- | ------ | ---- | ------------ | -------- |
| getHotels       | `/?hotel_id`   | GET    |      | hotel_id     |          |
| createHotel     | `/`            | POST   |      |              |          |
| updateHotelInfo | `/update_info` | PUT    |      |              | id       |
| deleteHotelById | `/`            | DELETE |      |              | id       |

# 4. Hotel image

Prefix: `/v1/hotels/images`

| Function                   | Endpoint | Method | Slug | Query params | Req body           |
| -------------------------- | -------- | ------ | ---- | ------------ | ------------------ |
| getImagesByHotelId         | `/:id`   | GET    | id   |              |                    |
| addImagesByHotelId         | `/`      | POST   |      |              | id                 |
| deleteSingleImageByHotelId | `/`      | DELETE |      |              | id, image_name=... |
| deleteAllHotelImage        | `/`      | DELETE |      |              | id, image_name=all |

# 5. Service

Prefix: `/v1/services`

Note:

-   getServices:

    -   nếu không có param thì lấy tất cả service
    -   nếu có param id thì lấy theo service id
    -   nếu có param hotel_id thì lấy theo hotel id

-   deleteServices:
    -   Phải có ít nhất param
    -   nếu có param id thì lấy theo service id
    -   nếu có param hotel_id thì lấy theo hotel id

| Function          | Endpoint            | Method | Slug | Query params | Req body |
| ----------------- | ------------------- | ------ | ---- | ------------ | -------- |
| getServices       | `/?id=\|?hotel_id ` | GET    |      | hotel_id, id |          |
| createService     | `/`                 | POST   |      |              |          |
| updateServiceInfo | `/update_info`      | PUT    |      |              | id       |
| deleteServices    | `/?id=\|?hotel_id=` | DELETE |      | hotel_id, id |          |

# 6. Service image

Prefix: `/v1/services/images`

| Function                     | Endpoint | Method | Slug | Query params | Req body           |
| ---------------------------- | -------- | ------ | ---- | ------------ | ------------------ |
| getImageByServiceId          | `/:id`   | GET    | id   |              |                    |
| addImagesByServiceId         | `/`      | POST   |      |              | id                 |
| deleteSingleImageByServiceId | `/`      | DELETE |      |              | id, image_name=... |
| deleteAllServiceImage        | `/`      | DELETE |      |              | id, image_name=all |

# 7. Book

-   deleteBooks:
    -   Phải có ít nhất param
    -   nếu có param book_id thì lấy theo book id
    -   nếu có param user_id thì lấy theo user id
    -   nếu có param hotel_id thì lấy theo hotel id

Prefix: `/v1/books`

| Function           | Endpoint      | Method | Slug | Query params | Req body |
| ------------------ | ------------- | ------ | ---- | ------------ | -------- |
| getBookByUserId    | `/?user_id=`  | GET    |      | user_id      |          |
| getBookByHotelId   | `/?hotel_id=` | GET    |      | hotel_id     |          |
| createBook         | `/`           | POST   |      |              |          |
| updateBookById ??? | `/:id`        | PUT    | id   |              |          |
| deleteBooks        | `/?book_id=`  | DELETE |      | book_id      |          |
| deleteBooks        | `/?user_id=`  | DELETE |      | user_id      |          |
| deleteBooks        | `/?hotel_id=` | DELETE |      | hotel_id     |          |

# 8. Transaction

Prefix: `/v1/trans`

| Function    | Endpoint           | Method | Slug | Query params | Req body |
| ----------- | ------------------ | ------ | ---- | ------------ | -------- |
| getTrans    | `/?user_id=`       | GET    |      | user_id      |          |
| createTran  | `/`                | POST   |      |              |          |
| deleteTrans | `/?id=\|?user_id=` | DELETE |      | user_id      |          |

# 9. Comment

Prefix: `/v1/cmts`

| Function           | Endpoint      | Method | Slug | Query params | Req body |
| ------------------ | ------------- | ------ | ---- | ------------ | -------- |
| getCmtByHotelId    | `/?hotel_id=` | GET    |      | hotel_id     |          |
| getCmtByUserId     | `/?user_id=`  | GET    |      | user_id      |          |
| createCmt          | `/`           | POST   |      |              |          |
| updateCmtById      | `/update_cmt` | PUT    |      |              |          |
| deleteCmtById      | `/?cmt_id=`   | DELETE |      | cmt_id       |          |
| deleteCmtByUserId  | `/?user_id=`  | DELETE |      | user_id      |          |
| deleteCmtByHotelId | `/?hotel_id=` | DELETE |      | hotel_id     |          |
