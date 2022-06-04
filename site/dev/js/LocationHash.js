export function getParam(key) {
    var hash = window.location.hash;
    if (hash != "") {
        var hashUrlVars = hash.slice( 1 ).split("&");
        var l = hashUrlVars.length;

        var hashUrlObj = {}
        for (var i=0; i< l ; i++){
            var SS = hashUrlVars[i].split("=");
            hashUrlObj[SS[0]] = SS[1];
        }

        if (hashUrlObj[key])
            return hashUrlObj[key];
        else
            return null;
    }
    else
        return null;
};

export function setParam(key , val) {
    var hash = window.location.hash;
    if (hash != "") {
        var hashUrlVars = hash.slice( 1 ).split("&");
        var l = hashUrlVars.length;

        var hashUrlObj = {}
        for (var i=0; i< l ; i++) {
            var SS = hashUrlVars[i].split("=");
            hashUrlObj[SS[0]] = SS[1];
        }

        hashUrlObj[key] = val;
    }
    else {
        var hashUrlObj = {}
        hashUrlObj[key] = val;
    }


    var str = [];
    for (var prop in hashUrlObj) {
        if (hashUrlObj.hasOwnProperty(prop)) {
            str.push( prop + "=" + hashUrlObj[prop] ) ;
        }
    }
    var finalhash = "#" + str.join("&");
    window.location.hash =finalhash;
};

export function deleteParam(key) {
    var hash = window.location.hash;
    if (hash != "") {
        var hashUrlVars = hash.slice( 1 ).split("&");
        var l = hashUrlVars.length;

        var hashUrlObj = {}
        for (var i=0; i< l ; i++) {
            var SS = hashUrlVars[i].split("=");
            hashUrlObj[SS[0]] = SS[1];
        }

        delete hashUrlObj[key];
    } 
    else
        return ; //Noting to do

    var str = [];
    for (var prop in hashUrlObj) {
        if (hashUrlObj.hasOwnProperty(prop)) {
            str.push( prop + "=" + hashUrlObj[prop] ) ;
        }
    }
    var finalhash = "#" + str.join("&");
    window.location.hash =finalhash;
};

export {getParam, setParam, deleteParam};