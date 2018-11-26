class TodoCollection {
    constructor(bus, id){
        this.collection = [];
        this.localStorage_key = 'todos-'+id;

        this.projId = id;
        this.root = "http://zhaw-issue-tracker-api.herokuapp.com/api/";
        this.bus = bus;
        this.result = [];
    }

    get(id) {
        return this.collection.find(function(el){
            return el.uuid == id;
        });
    }

    all(){
        return this.collection;
    }

    save(){
        localStorage.setItem(this.localStorage_key, JSON.stringify(this.collection));
    }

    add_old(model){
        model.uuid = this.uuid();
        this.collection.push(model);
        this.save();
        this.bus.trigger("collectionUpdated");
    }
    
    add(model, callback){
        model.client_id = this.uuid();
        model.project_client_id = this.projId;
        console.log(model.project_client_id);
        $.ajax({
            type: "POST",
//            url: this.root + "project/12525/issues",
            url: this.root + "project/"+ this.projId +"/issues",
            data: JSON.stringify(model),
            contentType: "application/json"
        }).done(callback(json));
    }
    
    remove(uuid){
        var index = -1;
        for(var i = 0; i < this.collection.length; i++){
            if(this.collection[i].uuid == uuid){
                index = i;
                break;
            }
        }
        this.collection.splice(index, 1);
    	this.save();
    	this.bus.trigger("collectionUpdated");
    }

// fetch(){
// this.collection = JSON.parse(localStorage.getItem(this.localStorage_key)) ||
// [];
// this.bus.trigger("collectionUpdated");
// }
    
    fetch(){
		$.ajax({
            type: "GET",
            url: this.root + "projects/12525/issues",
            success: function(result) {
            	this.result = result;
            }
        }).done( function() {
//        	this.collection = JSON.parse(this.result);
        	console.log(this.result);
        });
        
        this.bus.trigger("collectionUpdated");
    }
    
    uuid(){
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
        console.log(uuid);
        return uuid;
    }
}