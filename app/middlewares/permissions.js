exports.typeAdmin = function(req, res, next) {
	req.protectedf = true;
	next();
	return;
}
exports.typeStandard = function(req, res, next) {
	req.protectedf = false;
	next();
	return;
}
exports.havePermissions = function(req, res, next) {

	try {
		let havePermission = false;
		for(let i=0; i<req.user.roles.length; i++)
		{
			if(req.user.roles[i].name == "Admin" || (req.user.roles[i].name == "Standard" && !req.protectedf))
			{
				havePermission = true;
			}
		}
		if(!havePermission)
		{
			return res.status(400).json({
				error: {
					msg: "Without permission!"
				}
			});
		}
	}
	catch(err) {
		return res.status(400).json({
			error: {
				msg: "Without permission!"
			}
		});
	}
	next();
	return;
}