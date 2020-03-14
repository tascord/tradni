module.exports = {

    sentenceCase: function (text) {
        
        if(typeof text != 'string') return false;

        return text[0].toUpperCase() + text.slice(1);
    },

    removeDuplicates: function (array) {
        
        if(typeof array != 'object') return false;

        var _array = [];

        for(var i in array) {
            
            var isDupe = false;

            for(var j in _array) {
                if(_array[j] === array[i]) isDupe = true;
            }

            if(isDupe == false) _array.push(array[i]);

        }

        return _array;

    }

};