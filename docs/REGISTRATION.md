# Registration And Login

## Quick Jump
 * [Registration](#Registration)
 * [Login](#Login)

 ## Registration
 ### Request
 Endpoint: `/register`

 Body: `application/json`

 ```typescript
 email: string;
 password: string; //Min: 8
 nickname: string; //Min: 4
 gender: 'M' | 'F';
 preference: 'M' | 'F' | 'A';
 ```
 ### Response
 ```typescript
 "user": UserDto,
 "token": string // Bearer token, used for auth
 ```

 ## Login
 ### Request
 Endpoint: `/login`

 Body: `application/json`

 ```typescript
 email: string;
 password: string;
 ```
 ### Response
 ```typescript
 "user": UserDto,
 "token": string // Bearer token, used for auth
 ```


