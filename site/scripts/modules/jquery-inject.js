(function($) {
    // properies fields
    // id: "class",
    // id_part: "id" #field in data which will be added to the end id 
    const dataInjectTypes = [ 'inject', 'inject-src', 'inject-href', 'inject-date', 'inject-target', 'inject-target-element' ]

    
    const prepareText = function(text) {
        text = text.replaceAll(/\n/ig, ' <br/> ')

        const link_regex = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm;

        const links = text.match(link_regex);
        text = text.split(link_regex);

        text = text.map((value, key) => {
            if (links && links[key]) {
                return text[key] + `<a href="${links[key]}">${links[key]}</a>`
            }

            return text[key]
        }).join(' ');

        return text
    }

    jQuery.fn.inject = function(data, properties) {

        return this.each(function() {
            if(properties) {
                if(properties.id && properties.id_part) {
                    $(this).attr('id', `${properties.id}_${data[properties.id_part]}`)
                }

                if (properties.class) {
                    $(this).addClass(data[properties.class])
                }
            }

            $.each(dataInjectTypes, (_, dataInjType) => {
                $(this).each(function() {
                    if($(this).data(dataInjType))
                        switch(dataInjType) {
                            case 'inject':
                                const separator = $(this).data('inject-separator') ?? ''
                                const keys = $(this).data('inject').split(' ')
    
                                let text = []
    
                                $.each(keys, (_, key) => {
                                    text.push(data[key])
                                })

                                text = text.join(separator)

                                text = text.replaceAll(/\n/ig, ' <br/> ')

                                text = prepareText(text)
                                    
                                $(this).append( text )
                                break;
                            case 'inject-src':
                                break;
                            case 'inject-href':
                                let params = {}
                                if (properties.href_params_keys && properties.href_params_values) {
                                    const keys = properties.href_params_keys.split(' ')
                                    const values = properties.href_params_values.split(' ')
                                    params = keys.reduce((accumulator, element, index) => {
                                        return {...accumulator, [element]: data[values[index]] ?? values[index]};
                                    }, {});
                                }
                                $(this).attr('href', $(this).data('inject-href') + "?" + jQuery.param(params))
                                break
                            case 'inject-date':
                                const key = $(this).data(dataInjType)

                                $(this).text(data[key].slice(0, 19).replace('T', ' '))
                                break;
                            case 'inject-target':
                                const target_attrs1 = $(this).data(dataInjType).split(' ');
    
                                let target1 = target_attrs1.map((value) => {
                                    return data[value] || value;
                                }).join('')
    
                                $(this).attr('data-target', target1)
                                break;
                            case 'inject-target-element':
                                const target_attrs2 = $(this).data(dataInjType).split(' ');
    
                                let target2 = target_attrs2.map((value) => {
                                    return data[value] || value;
                                }).join('')
    
                                $(this).attr('id', target2)
                                break;
                        }
                })

                $(this).find(`[data-${dataInjType}]`).inject(data)
            })
            
        })
    };
})(jQuery);