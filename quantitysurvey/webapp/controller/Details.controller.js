sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
    "use strict";

    return BaseController.extend("cic.org.quantitysurvey.controller.Details", {

        onInit: function () {
            this.getView().setModel(new JSONModel({
                poNumber: "",
                isEditable: false,
                divisionFilter: "",
                serviceDesc: "",
                showUpdatedServices: false
            }), "details");
            this.getRoute("RouteDetails").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            var oDetails = this.getView().getModel("details");
            oDetails.setProperty("/poNumber", oEvent.getParameter("arguments").poNumber);
            oDetails.setProperty("/isEditable", false);
        },

        onEdit: function () {
            // snapshot so Cancel can restore what was typed
            var aItems = this.getView().getModel("qsData").getProperty("/BoqItemSet");
            this._aBoqBackup = JSON.parse(JSON.stringify(aItems));
            this.getView().getModel("details").setProperty("/isEditable", true);
        },
        onCancelEdit: function () {
            this.getView().getModel("qsData").setProperty("/BoqItemSet", this._aBoqBackup);
            this.getView().getModel("details").setProperty("/isEditable", false);
        },

        onCollapseAll: function () {
            this.byId("boqTree").collapseAll();
        },

        onExpandAll: function () {
            this.byId("boqTree").expandToLevel(10);   // deeper than the tree, so everything opens
        }
    });
});
