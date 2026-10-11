sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History",
    "../model/formatter"
], function (Controller, UIComponent, History, formatter) {
    "use strict";

    return Controller.extend("cic.org.quantitysurvey.controller.BaseController", {

        formatter: formatter,

        getRouter: function () {
            return UIComponent.getRouterFor(this);
        },

        getRoute: function (sRouteName) {
            return this.getRouter().getRoute(sRouteName);
        },

        getTarget: function (sTargetName) {
            return this.getRouter().getTarget(sTargetName);
        },

        onNavBack: function () {
            var sPreviousHash = History.getInstance().getPreviousHash();
            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                this.getRouter().navTo("RouteHome", {}, true);
            }
        }
    });
});