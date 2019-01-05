const path_render_trader = './views/backoffice/';
const path_render_admin = './views/admin/';

exports.getPathFileRender = function getPathFileRender(path_router) {

    switch (path_router) {
        case "my-profile":
            return path_render_trader + "my_profile.ejs";
        case "algo-trading":
            return path_render_trader + "algo_trading.ejs";
        case "ledger":
            return path_render_trader + "ledger.ejs";
        case "my-deposit":
            return path_render_trader + "my_deposit.ejs";
        case "my-withdrawls":
            return path_render_trader + "my_withdrawls.ejs";
        case "en/trade/real-time-market":
            return path_render_trader + "order_book.ejs";
        case "order-history":
            return path_render_trader + "orders_history.ejs";
        case "user-your-bitcoins":
            return path_render_trader + "use_your_bitcoins.ejs";
        case "kyc":
            return path_render_trader + "kyc.ejs";
        case "en/trade/otc":
            return path_render_trader + "otc.ejs";
        case "wallet-currency":
            return path_render_trader + "wallet.ejs";
        case "admin/withdraw":
            return path_render_admin + "verify_withdraw_transaction.ejs";
        case "admin/deposit":
            return path_render_admin + "verify_withdraw_transaction.ejs";
        case "admin/kyc":
            return path_render_admin + "verify_kyc.ejs";
        default:
            return "not found"
    }
}