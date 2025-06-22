const paypal=require("paypal-rest-sdk");

paypal.configure({
    mode:"sandbox",
    client_id:"AZBISTM-wIRn05-sodeb7s28Gl3t6Nsf5T1qYsKgkDTRctrhyNsT_plZD7lLjXSVK6qvcaS730fHSpLA",
    client_secret:"EBpmwsOsTUWpTYL237PTxORVQWIDTXzVAPNMXCS6YO0HiQ_XCwkznGRnaDIh8_3AT1prq6MFcVtVPyks"
});

module.exports=paypal