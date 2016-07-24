var settings=require('./settings.json');

var io=$('socket.io-client').connect(settings.url);

module.exports={
    name:"socket.io", 
    "triggers":
    [
        {
            name:"on",
            fields:[{name:"eventName", displayName:"The name of the event to watch"}],
            when:function(fields,callback){
                io.on(fields.eventName, function(message){
                    if(typeof(message)=='string')
                        callback($.extend({text:message}, arguments[1]));
                    else
                        callback(message);
                });
                
                process.on('exit', function(){
                    io.disconnect();
                });
            }
        }
    ],
    "actions":
    [
        {
            name:"emit", 
            fields:[{name:"eventName", displayName:"the name of the event to trigger"}, {name:"data", displayName:"The data to transmit"}],
            delegate:function(fields){
                var result=function(fields){
                    console.log('emitting '+fields.eventName+' with message '+JSON.stringify(fields.data));
                    io.emit(fields.eventName, fields.data);
                };
                result.fields=fields;
                return result;
            }
        }
    ]
};