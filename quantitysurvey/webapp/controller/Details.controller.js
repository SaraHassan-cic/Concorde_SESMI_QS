sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
    "use strict";

    return BaseController.extend("cic.org.quantitysurvey.controller.Details", {

        onInit: function () {
            this.getView().setModel(new JSONModel({ poNumber: "" }), "details");
            this.getRoute("RouteDetails").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            var sPoNumber = oEvent.getParameter("arguments").poNumber;
            this.getView().getModel("details").setProperty("/poNumber", sPoNumber);
        }
    });
});
