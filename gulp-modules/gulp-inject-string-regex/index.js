const es = require('event-stream'),
      PluginError = require('plugin-error'),
      fs = require('fs');

var stream = function(injectMethod){
    return es.map(function (file, cb) {
        try {
            file.contents = new Buffer( injectMethod( String(file.contents) ));
        } catch (err) {
            return cb(new PluginError('gulp-inject-string-regex', err));
        }
        cb(null, file);
    });
};

const handlerBefore = (regex, fileContents, opt) => {
    var index, start, end;

    index = fileContents.search(regex);
    if(index > -1 && opt){
        const matches = fileContents.match(regex);
        str = fs.readFileSync(`${__dirname}/../../${opt.path + (opt.filename ? opt.filename :  matches[opt.regexIndex || 1])}.${opt.fileExtension || 'html'}`, 'utf-8');

        search = matches[0];
        start = fileContents.substr(0, index);
        end = fileContents.substr(index);

        end = handlerBefore(regex, end, opt);
        return start + str + end;
    } else {
        return fileContents;
    }
}

const handlerAfter = (regex, fileContents, opt) => {
    var index, start, end;

    index = fileContents.search(regex);
    if(index > -1 && opt){
        const matches = fileContents.match(regex);
        str = fs.readFileSync(`${__dirname}/../../${opt.path + (opt.filename ? opt.filename :  matches[opt.regexIndex || 1])}.${opt.fileExtension || 'html'}`, 'utf-8');

        search = matches[0];
        start = fileContents.substr(0, index + search.length);
        end = fileContents.substr(index + search.length);

        end = handlerAfter(regex, end, opt);
        return start + str + end;
    } else {
        return fileContents;
    }
}

module.exports = {
    before: function(regex, opt){
        return stream(function(fileContents){
            var index, start, end;

            index = fileContents.search(regex);
            if(index > -1 && opt){
                const matches = fileContents.match(regex);
                str = fs.readFileSync(`${__dirname}/../../${opt.path + (opt.filename ? opt.filename :  matches[opt.regexIndex || 1])}.${opt.fileExtension || 'html'}`, 'utf-8');

                search = matches[0];
                start = fileContents.substr(0, index);
                end = fileContents.substr(index);

                end = handlerBefore(regex, end, opt);
                return start + str + end;
            } else {
                return fileContents;
            }
        });
    },
    after: function(regex, opt){
        return stream(function(fileContents){
            var index, start, end;

            index = fileContents.search(regex);
            if(index > -1 && opt){
                const matches = fileContents.match(regex);
                console.log(opt)
                str = fs.readFileSync(`${__dirname}/../../${opt.path + (opt.filename ? opt.filename :  matches[opt.regexIndex || 1])}.${opt.fileExtension || 'html'}`, 'utf-8');

                search = matches[0];
                start = fileContents.substr(0, index + search.length);
                end = fileContents.substr(index + search.length);

                end = handlerAfter(regex, end, opt);
                return start + str + end;
            } else {
                return fileContents;
            }
        });
    }
};

module.exports._stream = stream;
