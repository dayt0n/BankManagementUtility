import decode from 'jwt-decode';

function PermissionCheck(role) {
    if (document.cookie) {
        var user = decode(document.cookie);
        console.log(user);
        console.log(document.cookie);

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