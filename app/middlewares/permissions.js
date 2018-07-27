exports.typeAdmin = function(req, res, next) {
    req.protected = true;
    next();
    return;
}
exports.typeStandard = function(req, res, next) {
    req.protected = false;
    next();
    return;
}
exports.havePermissions = function(req, res, next) {

    try {
        let havePermission = false;
        for(let i=0; i<req.user.roles.length; i++)
        {
            if(req.user.roles[i] == "Admin" || (req.user.roles[i] == "Standard" && !protected))
            {
                havePermission = true;
            }
        }
        if(!havePermission)
        {
            return res.status(400).json({
                error: {
                    msg: 'Without permission!'
                }
            });
        }
    }
    catch(err) {
        return res.status(400).json({
            error: {
                msg: 'Without permission!'
            }
        });
    }
    next();
    return;
}