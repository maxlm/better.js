define(['better'],function($){
   var inMemoryStore = 
   $.declare(null, {
       idProp: '',
       data: [],
       dataMap: {},
       __construct: function(args) {
           this.data = {}
           this.dataMap = {}
           $.extend(this, args)
           this.init();
       },
       init: function(){
           $.each(this.data.items, function(idx,item){
               this.dataMap[item[this.idProp]] = idx;
           })
       },
       byId: function(id){
           return this.dataMap[id]
       },
       newItem: function(item){
           
       },
       deleteItem: function(item){
           
       },
       updateItem: function(){
           this.onUpdate(item,prop,oldVal,newVal)
       },
       onNew: function(){
           
       },
       onDelete: function(){
           
       },
       onUpdate: function(item,prop, oldVal, newVal){
           
       }
   })
   
   return inMemoryStore
})