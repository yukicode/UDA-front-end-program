describe("Address Book", function () {
    var addressBook,
        myContact;

    beforeEach(function () {
        addressBook = new AddressBook();
        myContact = new Contact();
    });

    it("should be able to add a contact", function () {
        addressBook.addContact(myContact);
        expect(addressBook.getContact(0)).toBe(myContact);
    });

    it("should be able to delete a contact", function () {
        addressBook.addContact(myContact);
        addressBook.deleteContact(0);
        expect(addressBook.getContact(0)).not.toBeDefined();
    });
});

describe("An async function", function(){
    var addressBook = new AddressBook();
    beforeEach(function(done){
        addressBook.asyncTest(done);
    });
    it("should be active", function(done){
        expect(addressBook.isActive).toBe(true);
        done();
    });
});