module.exports = function Route(app){
	app.get('/', function(req, res){
		res.render('index');
	})

	var users = {}; //object that keeps track of all of my users!

	app.post('/login', function(req, res){
		//console.log(req.body, '###############Post baby yeah###########')
		name = req.body.name
		color = req.body.color
		req.session.name = name
		req.session.color = color
		users[req.sessionID] = {name: name, color: color}
		console.log(users)
		app.io.broadcast('new_user', {name: name});
		req.session.save(function(){
			res.redirect('/chatroom')
		})
	})

	///////////////////////CHAT STUFF BEGINS NOW////////////////////////BABY YEAH	
	
	app.get('/chatroom', function(req, res){
		res.render('chatroom', {session_stuff: req.session})
	})

	app.get('/logout', function(req, res){
		res.redirect('/');
	})

	app.io.route('message', function(req){
		var message = req.data.message
		console.log(message, req.sessionID);
		var user = users[req.sessionID];
		app.io.broadcast('chat', {new_message: message, user_data: user})
	})

	app.io.route('log_off', function(req){
		delete users[req.sessionID]
	})

	app.io.route('color_change', function(req){
		users[req.sessionID].color = req.data.new_color
	})
}