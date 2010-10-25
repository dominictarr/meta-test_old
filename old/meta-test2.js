var DNode = require('dnode')
,	sys = require('sys')

exports.start = function (port,ready){
	funx = {
		timesTen: function (n,done){
			done(n * 10);
		},
		hello: function (done){
			done(n * 10);
		},
		throwError: function (done){
			sys.puts("THASOFAJSODJAD");
			throw new Error("INTENSIONAL ERROR");
		},
	}
	server = DNode(funx).listen(port)
	server.on('ready', ready);
	return server;
}


