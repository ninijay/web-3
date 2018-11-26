class ProjectCollection {
    constructor(bus){
        this.localStorage_key = 'projects';
        this.collection = JSON.parse(localStorage.getItem(this.localStorage_key)) || [];
        this.bus = bus;
        this.root = "http://zhaw-issue-tracker-api.herokuapp.com/api/projects";
    }

    get(id) {
        return this.collection.find(function(el){
            return el.client_id == id;
        });
    }

    all(){
        return this.collection;
    }

    save(){
        localStorage.setItem(this.localStorage_key, JSON.stringify(this.collection));
    }

    add(model, callback){
        parent = this;

        model.client_id = this.uuid();
        model.active = false;
        
        var postModel = {
            client_id: "",
            title: "",
            active: false
        };

        postModel.client_id = model.client_id;
        postModel.title = (model.title == undefined ? model.name : model.title);
        postModel.active = model.active;

        console.log(JSON.stringify(postModel));
        
        $.ajax({
            type: "POST",
            url: this.root,
            data: JSON.stringify(postModel),
            contentType: "application/json",
            success: function(data){
                alert("project with id: " + data.id + " created");
                model.id = data.id;
                var found = false;
                if(parent.collection.length > 0){
                    parent.collection.forEach(function(element) {
                        if(element.client_id == model.client_id){
                            element.id = model.id;
                            found = true;
                        }
                    }, this); 
                }
                if(!found){
                    parent.collection.push(model);
                }
                parent.save();
                parent.bus.trigger("collectionUpdated");
                callback;
            }
        });
        
        
/*        $.post(
            this.root, 
            JSON.stringify(postModel),
            function(data){

            }).done(function(data){
                model.id = data.id;
                this.collection.push(model);
                this.save();
                this.bus.trigger("collectionUpdated");
                callback();
        });*/
    }

    fetch(){
        this.collection = JSON.parse(localStorage.getItem(this.localStorage_key)) || [];
        this.bus.trigger("collectionUpdated");
    }

    uuid(){
        var client_id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
        console.log(client_id);
        return client_id;
    }
}