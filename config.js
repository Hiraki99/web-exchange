var config = {
    url:{
        HOST_PRODUCER:"http://54.255.151.121:5040/pre-trade/confirm-connect",
        HOST:"http://54.255.151.121:5050/api",
        // HOST_PRE_TRADE:'http://54.255.151.121:5041',
        SOCKET_HOST_PRE_TRADE:"http://54.169.58.227:5000",
        SOCKET_HOST_PRE_TRADE:"http://localhost:5000",

        HOST_PRE_TRADE_DATA:"http://54.255.151.121:5045",
        HOST_PRE_TRADE_DATA:"http://localhost:5045",

        SOCKET_HOST_DEPOSIT : "http://localhost:5024",
        // SOCKET_HOST_DEPOSIT : "http://54.255.151.121:5020",
        AUTH_API : "http://localhost:8001",
        NODEJS_HOST: "http://localhost:8090",
        // SOCKET_HOST_PRE_TRADE_REAL_TIME: "http://54.169.58.227:5041"
        SOCKET_HOST_PRE_TRADE_REAL_TIME: "http://localhost:5041"
    },
    defaultUser: {
        username: 'tuan.nguyenminh',
        password: '$2a$10$bVj26uFKSmfo1Tgs65TxIOx/kOFHEAawoc11zFXVZY.yDum/XPAtm', // mean '123456'
        displayName: 'Minh Tuan',
        emails: 'ntuan221@gmail.com',
        role: 'admin'
    },
}

module.exports = config;