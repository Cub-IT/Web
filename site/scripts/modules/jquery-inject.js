(function($) {
    // properies fields
    // id: "class",
    // id_part: "id" #field in data which will be added to the end id 
    const dataInjectTypes = [ 'inject', 'inject-src', 'inject-href' ]

    

    jQuery.fn.inject = function(data, properties) {
        jQuery.fn.handler = (dataInjectType, data) => {
            return this.each(function() {
                if($(this).data(dataInjectType))
                    switch(dataInjectType) {
                        case 'inject':
                            $(this).text( data[ $(this).data('inject') ] )
                            break;
                        case 'inject-src':
                            break;
                        case 'inject-href':
                            break;
                    }
            })
        }

        return this.each(function() {
            if(properties) {
                if(properties.id && properties.id_part) {
                    $(this).attr('id', `${properties.id}_${data[properties.id_part]}`)
                }
            }
            $.each(dataInjectTypes, (_, dataInjType) => {
                $(this)
                    .handler(dataInjType, data)
                    .find(`[data-${dataInjType}]`)
                    .inject(data);
            })
            
        })
    };
})(jQuery);