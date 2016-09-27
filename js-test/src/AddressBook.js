var AddressBook = function () {
    this.contacts = [];
    this.isActive = false;
};

AddressBook.prototype.addContact = function (myContact) {
    this.contacts.push(myContact);
};

AddressBook.prototype.getContact = function (index) {
    if (isNaN(index)) { return null; }
    return this.contacts[index];
};

AddressBook.prototype.deleteContact = function(index){
    if (isNaN(index)) { return null; }
    return this.contacts.splice(index, 1);
};

AddressBook.prototype.asyncTest = function(callback){
    var self = this;
    setTimeout(function(){
        self.isActive = true;
        if(callback){
            callback();
        }
    }, 100);
};