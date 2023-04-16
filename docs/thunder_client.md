# Hướng dẫn sử dụng Thunder Client

## 1. Cài đặt

Vào VS code, search **"Thunder Client"**

![](./img/thunder_client_install.png)

## 2. Sử dụng

### 2.1 Tạo collection

![](./img/make_collect.png)

## 2.2 Đặt tên cho collection

VD: Book_Auth

![](./img/collect_name.png)

## 2.3 Tạo request mới

![](./img/new_req.png)

## 2.4 Đặt tên request

VD: Register
![](./img/new_req_register.png)

## 2.5 Điền thông tin cho request

VD: Register

-   method: POST
-   url: /v1/auth/register
-   body: Vì register có thông tin về **username** và **password** nên sẽ có phần request body (body không bắt buộc với tất cả các request, thường chỉ có POST request sẽ có body) (định dạng _JSON_)

```json
{
    "usename": "abc4",
    "password": "abc4"
}
```

Sau khi gửi request lên **thành công** thì sẽ có response như sau:

![](./img/register_response.png)

## 2.6 Làm tương tự với các request sau

Login:

-   method: POST
-   url: /v1/auth/login
-   body: Thông tin user vừa register

```json
{
    "usename": "abc4",
    "password": "abc4"
}
```

Sau khi login thành công:
![](./img/login_success.png)

Ngoài ra còn có thêm trả về 1 cookie **'jwt'**

![](./img/login_cookie.png)

Refresh:

-   method: GET ()
-   url: /v1/auth/refresh
-   body: Không cần
-   Chú ý: **'refresh'** để làm mới accessToken, tuy không cần request body nhưng cần cookie **'jwt'** (trả về khi login thành công). Nếu không có cookie thì sẽ trả về `401`

Sau khi refresh thành công:
![](./img/refresh_success.png)

Refresh thành công thì sẽ trả về accessToken mới và cookie **'jwt'** mới

AccessToken mới:

![](./img/refresh_success.png)

Cookie mới (jwt ở trên là cookie cũ đã bị clear, jwt ở dưới là cookie mới):

![](./img/refresh_cookie.png)

Logout:

-   method: GET
-   url: /v1/auth/logout
-   body: Không cần

Sau khi logout thành công:
![](./img/logout_success.png)

Ngoài ra còn clear cookie **'jwt'** nhận được khi login

![](./img/logout_cookie.png)
