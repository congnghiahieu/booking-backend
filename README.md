# Booking backend

## Tutorial

1. F8 Node - Express
2. [Davegray Node API](https://www.youtube.com/watch?v=JZXQ455OT3A&list=PL0Zuz27SZ-6PFkIxaJ6Xx_X46avTM1aYw)
3. [Mongoose tutorial](https://www.youtube.com/watch?v=DZBGEVgL2eE&t=115s)

## Reference

[Booking hotel Frontend](https://github.com/congnghiahieu/booking-frontend)

[Booking hotel Admin](https://github.com/congnghiahieu/booking-admin)

## Thông tin

-   Hiện tại trong quá trình development sẽ sử dụng [MongoDB Cloud](./docs/mongo_cloud.md):

    -   Không cần start MongoDB tại local
    -   Mọi người sử dụng chung 1 DB, tránh bất đồng bộ data
    -   Khi dev ổn rồi thì sẽ chuyển sang sử dụng MongoDB local tại 1 máy
    -   Tạm thời trong quá trình dev bỏ qua phần data về ảnh cho khách sạn

-   Server chạy cổng `http://localhost:8000`
-   Đường dẫn: `/v1/...`
-   Các controller tạm hoàn thiện cơ bản: **/auth/login**, **/auth/logout**, **/auth/register**, **/auth/refresh**,
-   Sử dụng [Thunder Client](./docs/thunder_client.md) để test
-   [Các route của project](./docs/routes.md)
