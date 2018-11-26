class TodoCollection {
    constructor(bus, project_id, project_client_id){
        this.collection = [];
        this.localStorage_key = 'todos-' + project_id;
        this.project_id  = project_id;
        this.project_client_id = project_client_id;
        this.root = "http://zhaw-issue-tracker-api.herokuapp.com/api/projects/";
        this.bus = bus;
        this.result = [];
    }

    get(id) {
        return this.collection.find(function(el){
            return el.id == id;
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
        parent = this;

        model.client_id = this.uuid();
        model.project_id = this.project_id;
        model.project_client_id = this.project_client_id;

        model.due_date = "2018-11-26T16:12:39.703Z";
        console.log(JSON.stringify(model));

        $.ajax({
            type: "POST",
            url: this.root + this.project_id + "/issues",
            data: JSON.stringify(model),
            contentType: "application/json",
            success : function(data){
                model.id = data.id;
                parent.collection.push(model);
                parent.save();
                parent.bus.trigger("collectionUpdated");
                callback;
            }
        });
    }
    
    remove(id){
        var index = -1;
        for(var i = 0; i < this.collection.length; i++){
            if(this.collection[i].id == id){
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
        parent = this;
        this.collection = JSON.parse(localStorage.getItem(this.localStorage_key)) || [];
		$.ajax({
            type: "GET",
            url: this.root + this.project_id + "/issues",
            contentType: "application/json",
            success: function(data) {
                data.forEach(function(d) {
                    var found = false;
                    parent.collection.forEach(function(e) {
                        if(d.id == e.id){
                            found = true;
                        }
                    }, this);
                    if(!found){
                        parent.collection.push(d);
                        parent.save();
                    }
                }, this);
                parent.bus.trigger("collectionUpdated");
            }
        });
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