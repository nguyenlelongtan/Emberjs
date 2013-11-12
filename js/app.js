var Tracks = Ember.Application.create({
	LOG_TRANSITIONS: true
});

Tracks.Router.map(function(){
	this.route('tracks', {path: "/"});
});

Tracks.TracksRoute = Ember.Route.extend({
	model:function(){
		return this.store.find('track');
	}
});

Tracks.TracksController = Ember.ArrayController.extend({
	trackSelected: null,	//varible to store selected track
	newTrackName: null,
	newArtistName: null,
	newAlbumName: null,
	newLength: 0,
	trackSelectedID: null,
	actions: {
		//Function when click on each row of table to select track
		trackSelected: function(track){
			this.set('trackSelected',track);
		},
		//Function when click on add button
		addTrack: function(){
			$("#addTrackDialog").modal({"show": true});
		},
		//Function when confirm on add dialog
		doConfirmAdd: function(){
			var content = this.get('content');
			var newTrackName = this.get('newTrackName');
			var newArtistName = this.get('newArtistName');
			var newAlbumName = this.get('newAlbumName');
			var newLength = this.get('newLength');
			var unique = newTrackName != null && newTrackName.length > 1;
			content.forEach(function(track){
				if (newTrackName === track.get('trackName')){ 
					unique = false; 
					return;
				} 
			});
			
			if (unique){
				var newTrack = this.store.createRecord('track');
				newTrack.set('id', newTrackName);
				newTrack.set('trackName', newTrackName);
				newTrack.set('artistName', newArtistName);
				newTrack.set('albumName', newAlbumName);
				newTrack.set('length', newLength);
				newTrack.save();
				this.set('newTrackName', null);
				this.set('newArtistName', null);
				this.set('newAlbumName', null);
				this.set('newLength', 0);
				$("#addTrackDialog").modal('hide');
			} else {
				alert('Note must have a unique name of at least 2 characters!');
			} 
		},
		//Function when cancel on add dialog
		doCancelAdd: function(){
			$("#addTrackDialog").modal('hide');
		},
		
		//Function when click on delete button
		deleteTrack: function(){
			if(this.get('trackSelected') != null)
				$("#deleteTrackDialog").modal({"show": true});
		},
		//Function when confirm on delete dialog
		doConfirmDelete: function(){		
			var trackSelected = this.get('trackSelected');
			if(trackSelected != null){
				trackSelected.deleteRecord();
				trackSelected.save();				
			}
			$("#deleteTrackDialog").modal('hide');			
		},
		//Function when cancel on delete dialog
		doCancelDelete: function (){
			$("#deleteTrackDialog").modal('hide');
		}
	} 
});

Tracks.Store = DS.Store.extend({
	adapter: DS.LSAdapter
});

Tracks.Track = DS.Model.extend({
	trackName: DS.attr('string'),
	artistName: DS.attr('string'),
	albumName: DS.attr('string'),
	length: DS.attr('number')
});