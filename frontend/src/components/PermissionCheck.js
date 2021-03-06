import decode from 'jwt-decode';

function PermissionCheck(role) {
    if (document.cookie) {
        var user = decode(document.cookie);

        if (user["role"] !== role) {
            return false;
        }
    }
    else {
        return false;
    }

    return user;
}

export default PermissionCheck;