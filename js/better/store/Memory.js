define(['better'],function($){
    var MemoryStore

    // var MemoryStore = function(){
    // }

    /**
     *
     * @class MemoryStore
     */
   MemoryStore = $.declare(null, {
       idProp: 'id',
       //items: Array
       //           Storage recordset
       items:[],
       dataMap: {},
       __construct: function(args) {
           this.items = []
           this.dataMap = {}
           $.extend(this, args)
           this.init();
       },
       init: function(){
           $.each(this.items, $.proxy(function(idx,item){
               this.dataMap[item[this.idProp]] = item;
           },this))
       },
       byId: function(/*String*/ id){
           return this.dataMap[id+""]
       },
       getItemId: function (/*String|Item*/ stringOrItem) {
           if(isItem(this, stringOrItem)) {
               return stringOrItem[this.idProp]
           } else if('string' == $.type(stringOrItem) || "number" == $.type(stringOrItem)) {
               return stringOrItem + "";
           } else {
               var msg =
                   "Trying to add something that is not an store item. Store item must have <"
                       + this.idProp
                       +"> attribute";
               throw new Error(msg);
           }
       },
       new: function(/*Item*/ item){
           //summary:
           //           Add new item to store item.
           //          Item must have unique and not empty {store.idProp} attribute
           var id = this.getItemId(item),
               msg;

           if(this.dataMap[id]) { // duplicate entry
               msg = "Item with id <" + id + "> already exists";
               throw new Error(msg);
           }

           this.items.push(item);
           this.dataMap[id] = item;
           this.onNew(item);
       },
       delete: function(/*String|Item*/stringOrItem){
           var id = this.getItemId(stringOrItem),
               item = this.byId(id),
               idx = $.inArray(item, this.items);
           if(item) { // item exists within this particular store if byId method returned Item object
               delete this.dataMap[id];
               this.items.splice(idx,1);
               this.onDelete(item);
           } else {
               var msg = "Item you trying to delete does not belong to this store";
               throw new Error(msg);
           }

       },
       update: function(/*String|Item*/ stringOrItem, /*String*/propName, /*Anything*/propVal){
           var id = this.getItemId(stringOrItem),
               item = this.byId(id),
               oldVal = item[propName];
           item[propName] = propVal;
           this.onUpdate(item,propName,propVal,oldVal)
       },
       onNew: function(/*Item*/item){
           //summary:
           //           Event/Join Point.
           //           Bind to it via $.connect, $.aop.after or any other AOP.after tool/aspect
       },
       onDelete: function(/*Item*/item){
           //summary:
           //           Event/Join Point.
           //           Bind to it via $.connect, $.aop.after or any other AOP.after tool/aspect
       },
       onUpdate: function(/*Item*/item,/*String*/prop, /*Anything*/newVal, /*Anything*/oldVal){
           //summary:
           //           Event/Join Point.
           //           Bind to it via $.connect, $.aop.after or any other AOP.after tool/aspect
       },
       findBy: function(/*Function*/cb) {
           //summary:
           //           Find items in store by callback function.
           //           Callback function get 2 parameters: index and item
           //           Function must return boolean value.
           //           [return true] from callback will add tested item to resultset
           //           [return false] from callback will exclude item from resultset
           //           Examplle:
           //                       Get all tickets with cost greater than 100 bucks
           //                       ticketsStore.findBy(function(index, item)){
           //                           return item.cost >= 100
           //                       }
           // return:Array



           //TODO: rewrite this without jquery
           return $(this.items).filter(cb).toArray()
       }
   })




    function isItem(self, /*Anything*/item) {
        if('object' !== $.type(item)) {
            return false;
        }

        if(!item[self.idProp]) {
            return false;
        }

        return true;
    }

    function own(self, /*Item*/ item) {
        //summary:
        //          Whether an item belongs to this particular store
        return self.dataMap[item[self.idProp]];
    }

    $.ns.setObject('better.store.Memory', MemoryStore)

   return MemoryStore
})