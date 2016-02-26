var Ret = function(next, data){
    return {
        next_page: next,
        response: data
    };
}

module.exports = Ret;
