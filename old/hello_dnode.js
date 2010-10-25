var DNode = require('dnode')
,  sys = require('sys')

,  server = DNode({
      handshake: function (remote){
         sys.puts(sys.inspect(remote))
      }
   }).listen(6060)
,  client
  
server.on('ready',function (){
   client = DNode().connect(6060,function (remote){
      remote.handshake("HELLO")  
   })
});


