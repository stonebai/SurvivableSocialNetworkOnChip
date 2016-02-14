# SSNoc API Document

## Register
    POST /api/register
    
***Parameters***

| Name	        | Type	      | Description  |
| :------------- |:-------------|:-----|
| registerName | String | User Name, Unique  |
| registerPassword | String | Password |

***Response***

    State : 200 OK
    Json : 
    {
        register: true
    }

***

## login

    POST /api/login
    
***Parameters***
    
| Name	        | Type	      | Description  |
| :------------- |:-------------|:-----|
| loginName | String | The user name exist in our database  |
| loginPassword | String | The  |

***Response***

    State : 200 OK
    Json : 
    {
        login: true
    }
