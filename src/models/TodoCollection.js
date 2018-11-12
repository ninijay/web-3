class TodoCollection {
    constructor(bus){
        this.collection = [];
        this.localStorage_key = 'todos';

        this.bus = bus;
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

    add(model){
        model.uuid = this.uuid();
        this.collection.push(model);
        this.save();
        this.bus.trigger("collectionUpdated");
    }
    
    remove(name){
    	this.collection.pull(name);
    	this.rmv(name);
    	this.bus.trigger("collectionUpdated");
    }
    
    rmv(name){
    	 localStorage.removeItem(name);
    }

    fetch(){
        this.collection = JSON.parse(localStorage.getItem(this.localStorage_key)) || [];
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