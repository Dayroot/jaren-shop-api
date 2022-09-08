exports.successResponse = ( res, statusCode, body) => {
    res
        .status(statusCode)
        .json({
            error: null,
            body,
        });
}

exports.errorResponse = ( res, statusCode, reason ) => {
    res
        .status(statusCode)
        .json({
            error: reason,
            body: null,
        });
}
