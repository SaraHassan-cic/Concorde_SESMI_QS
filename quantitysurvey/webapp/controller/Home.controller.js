sap.ui.define([
    "./BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend("cic.org.quantitysurvey.controller.Home", {

        onTableUpdateFinished: function (oEvent) {
            this.getView().getModel("home").setProperty("/totalRecords", oEvent.getParameter("total"));
        },
        onRowPress: function (oEvent) {
            var sPoNumber = oEvent.getSource().getBindingContext("dataModel").getProperty("PoNumber");
            this.getRouter().navTo("RouteDetails", { poNumber: sPoNumber });
        }

    });
}); ``
