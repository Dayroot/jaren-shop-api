exports.success = ( res, status, body) => {
    res
        .status(status || 200)
        .send({
            error: '',
            body,
        });
}

exports.error = ( res, status, reason, details='' ) => {
    console.error(details);
    res
        .status(status || 500)
        .send({
            error: reason,
            body: '',
        });
}